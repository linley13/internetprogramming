/*
 * Copyright (c) 2015 Samsung Electronics Co., Ltd. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* global window*/

/**
 * Application common calculations module.
 * Provides methods that are necessary for navigation.
 *
 * @module app.common.calculations
 * @namespace app.common.calculations
 * @memberof app.common
 */

// make sure that "app" namespace is created
window.app = window.app || {};

// strict mode wrapper function
(function defineAppCommonCalculations(app) {
    'use strict';

    /**
     * Earth radius constant.
     *
     * @private
     * @const {number}
     */
    var EARTH_RADIUS = 6371000,

    /**
     * Meters unit constant.
     *
     * @private
     * @const {string}
     */
    METERS_UNIT = 'm',

    /**
     * Kilometers unit constant.
     *
     * @private
     * @const {string}
     */
    KILOMETERS_UNIT = 'km',

    /**
     * Calculations module reference.
     *
     * @memberof app.common.calculations
     * @private
     * @type {object}
     */
    calculations = null;

    // create namespace for the module
    app.common = app.common || {};
    app.common.calculations = app.common.calculations || {};
    calculations = app.common.calculations;

    /**
     * Converts the number value expressed in radians to degrees.
     *
     * @private
     * @param {number} value
     * @returns {number}
     */
    function toDegrees(value) {
        return value * 180 / Math.PI;
    }

    /**
     * Converts the number value expressed in degrees to radians.
     *
     * @private
     * @param {number} value
     * @returns {number}
     */
    function toRadians(value) {
        return value * Math.PI / 180;
    }

    /**
     * Formats distance value to be displayed in meters or kilometers.
     *
     * @private
     * @param {number} distance Distance in meters.
     * @returns {number}
     */
    function formatDistance(distance) {
        if (distance >= 1000) {
            distance /= 1000;
        }
        return distance.toFixed(0);
    }

    /**
     * Formats unit value to represent meters or kilometers.
     *
     * @private
     * @param {number} distance Distance in meters.
     * @returns {string}
     */
    function formatUnit(distance) {
        if (distance >= 1000) {
            return KILOMETERS_UNIT;
        }
        return METERS_UNIT;
    }

    /**
     * Calculates the angle based on the start and destination position.
     *
     * @memberof app.common.calculations
     * @public
     * @param {object} start
     * @param {number} start.latitude
     * @param {number} start.longitude
     * @param {object} destination
     * @param {number} destination.latitude
     * @param {number} destination.longitude
     * @returns {number}
     */
    calculations.calculateAngle = function calculateAngle(start, destination) {
        var sLon = toRadians(start.longitude),
            dLon = toRadians(destination.longitude),
            sLat = toRadians(start.latitude),
            dLat = toRadians(destination.latitude),
            deltaLon = dLon - sLon;

        if (deltaLon > Math.PI) {
            deltaLon -= 2 * Math.PI;
        } else if (deltaLon < -Math.PI) {
            deltaLon += 2 * Math.PI;
        }

        return toDegrees((Math.atan2(
            deltaLon,
            Math.log(
                Math.tan(dLat / 2 + Math.PI / 4) /
                Math.tan(sLat / 2 + Math.PI / 4)
            )
        )));
    };

    /**
     * Calculates the distance between two positions
     * based on its coordinates.
     *
     * @memberof app.common.calculations
     * @public
     * @see http://www.sunearthtools.com/tools/distance.php
     * @param {object} start
     * @param {number} start.latitude
     * @param {number} start.longitude
     * @param {object} destination
     * @param {number} destination.latitude
     * @param {number} destination.longitude
     * @returns {number}
     */
    calculations.calculateDistance =
            function calculateDistance(start, destination) {
        var sLon = toRadians(start.longitude),
            dLon = toRadians(destination.longitude),
            sLat = toRadians(start.latitude),
            dLat = toRadians(destination.latitude),
            distance = EARTH_RADIUS *
                Math.acos(
                    Math.sin(sLat) * Math.sin(dLat) +
                    Math.cos(sLat) * Math.cos(dLat) * Math.cos(dLon - sLon)
                );

        return {
            raw: distance,
            formatted: formatDistance(distance),
            unit: formatUnit(distance)
        };
    };

    /**
     * Obtains angle from rotation.
     *
     * @memberof app.common.calculations
     * @param {number} value
     * @returns {number}
     */
    calculations.angleFromRotation = function angleFromRotation(value) {
        var angle = -value % 360;

        if (angle < 0) {
            angle += 360;
        }

        return angle;
    };

    /**
     * Calculates angle for navigation path indicator.
     *
     * @memberof app.common.calculations
     * @param {number} partialPath
     * @param {number} totalPath
     * @param {number} totalAngle
     * @returns {number}
     */
    calculations.calculatePathAngle =
        function calculatePathAngle(partialPath, totalPath, totalAngle) {

        return partialPath * totalAngle / totalPath;
    };

})(window.app);
