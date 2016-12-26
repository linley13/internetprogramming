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

/*global console, window, tizen*/

/**
 * Application battery model module.
 * It is responsible for obtaining information about device battery state.
 *
 * @module app.model.battery
 * @requires {@link app.common.events}
 * @namespace app.model.battery
 * @memberof app.model
 */

// make sure that "app" namespace is created
window.app = window.app || {};

(function defineAppModelBattery(app) {
    'use strict';

    /**
     * Low battery threshold.
     *
     * @private
     * @const {number}
     */
    var LOW_BATTERY = 0.04,

        /**
         * Battery model module reference.
         *
         * @private
         * @type {object}
         */
        modelBattery = null,

        /**
         * Common events module reference.
         *
         * @private
         * @type {object}
         */
        commonEvents = app.common.events,

        /**
         * System information object.
         *
         * @private
         * @type {Systeminfo}
         */
        systeminfo = null;

    // create namespace for the module
    app.model = app.model || {};
    app.model.battery = app.model.battery || {};
    modelBattery = app.model.battery;

    /**
     * Adds low battery state listener.
     *
     * Triggers model.battery.low event if the battery state is low.
     *
     * @memberof app.model.battery
     * @public
     * @fires model.battery.low
     */
    modelBattery.listenBatteryLowState = function listenBatteryLowState() {
        try {
            systeminfo.addPropertyValueChangeListener(
                'BATTERY',
                function change(battery) {
                    if (!battery.isCharging && battery.level < LOW_BATTERY) {
                        commonEvents.dispatchEvent('model.battery.low');
                    }
                },
                null,
                function errorCallback(error) {
                    console.warn('Battery state listener was not set.', error);
                }
            );
        } catch (error) {
            console.warn('Battery state listener was not set.', error);
        }
    };

    /**
     * Checks low battery state.
     *
     * Triggers model.battery.checked event if the battery state is checked.
     * Additionally triggers model.battery.low event
     * if the battery state is low.
     *
     * @memberof app.model.battery
     * @public
     * @fires model.battery.low
     * @fires model.battery.checked
     */
    modelBattery.checkBatteryLowState = function checkBatteryLowState() {
        try {
            systeminfo.getPropertyValue(
                'BATTERY',
                function getValue(battery) {
                    if (!battery.isCharging && battery.level < LOW_BATTERY) {
                        commonEvents.dispatchEvent('model.battery.low');
                    }
                    commonEvents.dispatchEvent('model.battery.checked');
                },
                function errorCallback(error) {
                    console.warn('Couldn\'t get battery level value.', error);
                }
            );
        } catch (error) {
            console.warn('Couldn\'t get battery level value.', error);
        }
    };

    /**
     * Initializes the battery model module.
     *
     * @memberof app.model.battery
     * @public
     */
    modelBattery.init = function init() {
        if (typeof tizen === 'object' && typeof tizen.systeminfo === 'object') {
            systeminfo = tizen.systeminfo;
        } else {
            console.warn('tizen.systeminfo not available');
        }
    };

})(window.app);
