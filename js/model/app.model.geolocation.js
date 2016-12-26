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

/*global window, console, navigator, setTimeout*/

/**
 * Application geolocation model module.
 * It is responsible for providing information about user location.
 *
 * @module app.model.geolocation
 * @requires {@link app.common.events}
 * @requires {@link app.common.calculations}
 * @namespace app.model.geolocation
 * @memberof app.model
 */

// make sure that "app" namespace is created
window.app = window.app || {};

(function defineAppModelGeolocation(app) {
    'use strict';

    /**
     * Geolocation checking interval (in milliseconds).
     *
     * @private
     * @const {number}
     */
    var GEO_CHECKING_INTERVAL = 2000,

        /**
         * Geolocation checking counter.
         * Defines max number of checking interval occurrences.
         *
         * @private
         * @const {number}
         */
        GEO_CHECKING_COUNTER = 5,

        /**
         * Destination threshold (in meters).
         *
         * @private
         * @const {number}
         */
        DESTINATION_THRESHOLD = 50,

        /**
         * Geolocation model module reference.
         *
         * @private
         * @type {object}
         */
        modelGeolocation = null,

        /**
         * Common events module reference.
         *
         * @private
         * @type {object}
         */
        commonEvents = app.common.events,

        /**
         * Common calculations module reference.
         *
         * @private
         * @type {object}
         */
        commonCalculations = app.common.calculations,

        /**
         * Geolocation API object.
         *
         * @private
         * @type {object}
         */
        geolocation = null,

        /**
         * Current position data.
         *
         * @private
         * @type {Position}
         */
        currentPosition = null,

        /**
         * Destination position data.
         *
         * @private
         * @type {object}
         */
        destinationPosition = {},

        /**
         * Stores information about number of checking interval occurrences.
         *
         * @private
         * @type {number}
         */
        checkingCounter = 0;

    // create namespace for the module
    app.model = app.model || {};
    app.model.geolocation = app.model.geolocation || {};
    modelGeolocation = app.model.geolocation;

    /**
     * Checks if the current position is equal to the one given as parameter.
     * Returns true if it is, false otherwise.
     *
     * @param {Position} position
     * @returns {boolean}
     */
    function isPositionEqual(position) {
        if (currentPosition &&
            (currentPosition.coords.latitude === position.coords.latitude ||
            currentPosition.coords.longitude === position.coords.longitude)) {
            return true;
        }
        return false;
    }

    /**
     * Returns true if destination is reached, false otherwise.
     *
     * @private
     * @returns {boolean}
     */
    function isDestinationReached() {
        var distanceLeft = 0;

        if (!destinationPosition) {
            return false;
        }

        distanceLeft = commonCalculations.calculateDistance({
            latitude: currentPosition.coords.latitude,
            longitude: currentPosition.coords.longitude
        }, destinationPosition).raw;

        return distanceLeft < DESTINATION_THRESHOLD;
    }

    /**
     * Performs action on get current position success.
     *
     * @private
     * @param {Position} position
     * @fires model.geolocation.current.position.changed
     * @fires model.geolocation.current.destination.reached
     * @fires model.geolocation.position.available
     */
    function onGetCurrentPositionSuccess(position) {
        if (!isPositionEqual(position)) {
            currentPosition = position;
            commonEvents.dispatchEvent(
                'model.geolocation.current.position.changed'
            );
            if (isDestinationReached()) {
                commonEvents.dispatchEvent(
                    'model.geolocation.destination.reached'
                );
            }
        }
        commonEvents.dispatchEvent('model.geolocation.position.available');
        checkingCounter = 0;
        setTimeout(getGeoPosition, GEO_CHECKING_INTERVAL);
    }

    /**
     * Performs action on get current position error.
     *
     * @private
     * @fires model.geolocation.position.unavailable
     * @fires model.geolocation.position.lost
     */
    function onGetCurrentPositionError() {
        commonEvents.dispatchEvent('model.geolocation.position.unavailable');
        checkingCounter += 1;
        if (checkingCounter === GEO_CHECKING_COUNTER) {
            commonEvents.dispatchEvent('model.geolocation.position.lost');
        }
        setTimeout(getGeoPosition, GEO_CHECKING_INTERVAL);
    }

    /**
     * Uses Geolocation API in order to obtain information
     * about changes of the current position.
     *
     * @private
     */
    function getGeoPosition() {
        try {
            geolocation.getCurrentPosition(
                onGetCurrentPositionSuccess,
                onGetCurrentPositionError,
                {timeout: GEO_CHECKING_INTERVAL}
            );
        } catch (error) {
            console.warn('Couldn\'t get geolocation position.', error);
        }
    }

    /**
     * Returns current position.
     *
     * @memberof app.model.geolocation
     * @public
     * @returns {object}
     */
    modelGeolocation.getCurrentPosition = function getCurrentPosition() {
        return {
            latitude: currentPosition.coords.latitude,
            longitude: currentPosition.coords.longitude
        };
    };

    /**
     * Sets destination position.
     *
     * @memberof app.model.geolocation
     * @public
     * @param {object} position
     * @fires model.geolocation.destination.position.changed
     */
    modelGeolocation.setDestinationPosition =
        function setDestinationPosition(position) {
            if (position) {
                destinationPosition = position;
            } else {
                destinationPosition = {};
            }
            commonEvents.dispatchEvent(
                'model.geolocation.destination.position.changed'
            );
        };

    /**
     * Sets destination latitude.
     *
     * @memberof app.model.geolocation
     * @public
     * @param {number} latitude
     * @fires model.geolocation.destination.position.changed
     */
    modelGeolocation.setDestinationLatitude =
        function setDestinationLatitude(latitude) {
            if (latitude) {
                destinationPosition.latitude = latitude;
            } else {
                // latitude is set to undefined
                delete destinationPosition.latitude;
            }
            commonEvents.dispatchEvent(
                'model.geolocation.destination.position.changed'
            );
        };

    /**
     * Sets destination longitude.
     *
     * @memberof app.model.geolocation
     * @public
     * @param {number} longitude
     * @fires model.geolocation.destination.position.changed
     */
    modelGeolocation.setDestinationLongitude =
        function setDestinationLongitude(longitude) {
            if (longitude) {
                destinationPosition.longitude = longitude;
            } else {
                // longitude is set to undefined
                delete destinationPosition.longitude;
            }
            commonEvents.dispatchEvent(
                'model.geolocation.destination.position.changed'
            );
        };

    /**
     * Returns destination position.
     *
     * @memberof app.model.geolocation
     * @public
     * @returns {object}
     */
    modelGeolocation.getDestinationPosition =
        function getDestinationPosition() {
            return destinationPosition;
        };

    /**
     * Returns destination latitude.
     *
     * @memberof app.model.geolocation
     * @public
     * @returns number
     */
    modelGeolocation.getDestinationLatitude =
        function getDestinationLatitude() {
            return destinationPosition.latitude;
        };

    /**
     * Returns destination longitude.
     *
     * @memberof app.model.geolocation
     * @public
     * @returns number
     */
    modelGeolocation.getDestinationLongitude =
        function getDestinationLongitude() {
            return destinationPosition.longitude;
        };

    /**
     * Initializes the geolocation model module.
     *
     * @memberof app.model.geolocation
     * @public
     * @fires model.geolocation.available
     * @fires model.geolocation.unavailable
     */
    modelGeolocation.init = function init() {
        if (navigator.geolocation) {
            geolocation = navigator.geolocation;
            commonEvents.dispatchEvent('model.geolocation.available');
            getGeoPosition();
        } else {
            commonEvents.dispatchEvent('model.geolocation.unavailable');
        }
    };

})(window.app);
