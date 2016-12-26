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

/*global window*/

/**
 * Application compass model module.
 * It is responsible for obtaining information about device orientation.
 *
 * @module app.model.compass
 * @requires {@link app.common.events}
 * @requires {@link app.common.calculations}
 * @namespace app.model.compass
 * @memberof app.model
 */

// make sure that "app" namespace is created
window.app = window.app || {};

(function defineAppModelCompass(app) {
    'use strict';

    /**
     * Compass model module reference.
     *
     * @private
     * @type {object}
     */
    var modelCompass = null,

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
         * Compass rotation.
         *
         * @private
         * @type {number}
         */
        rotation = null;

    // create namespace for the module
    app.model = app.model || {};
    app.model.compass = app.model.compass || {};
    modelCompass = app.model.compass;

    /**
     * Handles deviceorientation event.
     * It calculates the rotation of the model compass.
     *
     * @private
     * @param {Event} e
     * @fires model.compass.rotation.changed
     */
    function onDeviceOrientation(e) {
        var angle = e.alpha,
            lastAngle = commonCalculations.angleFromRotation(rotation),
            deltaAngle = 0;

        // Check if the angle has changed since the last measurement.
        if (isNaN(angle) || angle === lastAngle) {
            return;
        }

        deltaAngle = lastAngle - angle;
        if (deltaAngle > 180) {
            rotation -= 360 - deltaAngle;
        } else if (deltaAngle < -180) {
            rotation += 360 + deltaAngle;
        } else {
            rotation += deltaAngle;
        }

        commonEvents.dispatchEvent('model.compass.rotation.changed');
    }

    /**
     * Starts compass.
     *
     * @private
     */
    function startCompass() {
        window.addEventListener(
            'deviceorientation',
            onDeviceOrientation,
            false
        );
    }

    /**
     * Returns compass rotation.
     *
     * @memberof app.model.compass
     * @public
     * @returns {number}
     */
    modelCompass.getRotation = function getRotation() {
        return rotation;
    };

    /**
     * Initializes the compass model module.
     *
     * @memberOf app.model.compass
     * @public
     */
    modelCompass.init = function init() {
        startCompass();
    };

})(window.app);
