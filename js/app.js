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

/*global document, tizen, console, window*/

/**
 * Main application module.
 * Provides a namespace for other application modules.
 * Handles application life cycle.
 *
 * @module app
 * @requires {@link app.model.battery}
 * @requires {@link app.ui}
 * @namespace app
 */

// make sure that "app" namespace is created
window.app = window.app || {};

(function defineApp(app) {
    'use strict';

    /**
     * Battery model module reference.
     *
     * @private
     * @type {object}
     */
    var modelBattery = app.model.battery,

        /**
         * UI module reference.
         *
         * @private
         * @type {object}
         */
        ui = app.ui;

    /**
     * Closes application.
     *
     * @memberof app
     * @public
     */
    app.exit = function exit() {
        try {
            tizen.application.getCurrentApplication().exit();
        } catch (error) {
            console.warn('Application exit failed.', error.message);
        }
    };

    /**
     * Handles tizenhwkey event.
     *
     * Closes application if the back device button is pressed.
     *
     * @private
     * @param {Event} e
     */
    function onHwKeyEvent(e) {
        if (e.keyName === 'back') {
            ui.toggleClosePopup();
        }
    }

    /**
     * Handles model.battery.low event.
     *
     * Closes application.
     *
     * @private
     */
    function onBatteryLow() {
        app.exit();
    }

    /**
     * Handles model.battery.checked event.
     *
     * Initializes application UI.
     *
     * @private
     */
    function onBatteryChecked() {
        ui.init();
    }

    /**
     * Registers event listeners.
     *
     * @private
     */
    function bindEvents() {
        document.addEventListener('tizenhwkey', onHwKeyEvent);
        window.addEventListener('model.battery.low', onBatteryLow);
        window.addEventListener('model.battery.checked', onBatteryChecked);
    }

    /**
     * Initializes app module.
     *
     * Calls a method responsible for event listeners registering.
     * Starts the battery model initialization.
     *
     * @memberof app
     * @public
     */
    app.init = function init() {
        modelBattery.init();
        bindEvents();
        modelBattery.listenBatteryLowState();
        modelBattery.checkBatteryLowState();
    };

    window.addEventListener('load', app.init);

})(window.app);
