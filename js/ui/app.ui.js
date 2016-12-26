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

/*global window, document, tau*/

/**
 * Application ui module.
 * It is responsible for the application ui initialization.
 *
 * @module app.ui
 * @requires {@link app.model.geolocation}
 * @requires {@link app.model.network}
 * @requires {@link app.ui.waiting}
 * @requires {@link app.ui.destination}
 * @requires {@link app.ui.navigation}
 * @requires {@link app.ui.finish}
 * @namespace app.ui
 * @memberof app
 */

// make sure that "app" namespace is created
window.app = window.app || {};

(function defineAppUi(app) {
    'use strict';

    /**
     * Google maps API key.
     *
     * @private
     * @const {string}
     */
    var API_KEY = '',

        /**
         * UI module reference.
         *
         * @private
         * @type {object}
         */
        ui = null,

        /**
         * Geolocation model module reference.
         *
         * @private
         * @type {object}
         */
        modelGeolocation = null,

        /**
         * Network model module reference.
         *
         * @private
         * @type {object}
         */
        modelNetwork = null,

        /**
         * Compass model module reference.
         *
         * @private
         * @type {object}
         */
        modelCompass = null,

        /**
         * UI waiting module reference.
         *
         * @private
         * @type {object}
         */
        uiWaiting = null,

        /**
         * UI destination module reference.
         *
         * @private
         * @type {object}
         */
        uiDestination = null,

        /**
         * UI navigation module reference.
         *
         * @private
         * @type {object}
         */
        uiNavigation = null,

        /**
         * Ui finish module reference.
         *
         * @private
         * @type {object}
         */
        uiFinish = null,

        /**
         * Close popup element.
         *
         * @private
         * @type {HTMLElement}
         */
        closePopup = null,

        /**
         * Close popup yes button element.
         *
         * @private
         * @type {HTMLElement}
         */
        closePopupYesBtn = null;

    // create namespace for the module
    app.ui = app.ui || {};
    ui = app.ui;

    /**
     * Adds script element to the body element,
     * which is responsible for access to the google maps API.
     *
     * @private
     */
    function addGoogleServiceScriptElement() {
        var script = null;

        if (!document.getElementById('google-service') &&
                modelNetwork.isNetworkAvailable()) {
            script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = 'http://maps.google.com/maps/api/js?key=' + API_KEY;
            script.id = 'google-service';
            document.body.appendChild(script);
        }
    }

    /**
     * Handles model.network.initialized event.
     *
     * @private
     */
    function onModelNetworkInitialized() {
        addGoogleServiceScriptElement();
        modelGeolocation.init();
    }

    /**
     * Handles model.network.type.changed event.
     *
     * @private
     */
    function onModelNetworkTypeChanged() {
        addGoogleServiceScriptElement();
    }

    /**
     * Handles click event on close popup yes button click.
     *
     * @private
     */
    function onClosePopupYesBtnClick() {
        app.exit();
    }

    /**
     * Registers event listeners.
     *
     * @private
     */
    function bindEvents() {
        closePopupYesBtn.addEventListener('click', onClosePopupYesBtnClick);
        window.addEventListener(
            'model.network.initialized',
            onModelNetworkInitialized
        );
        window.addEventListener(
            'model.network.type.changed',
            onModelNetworkTypeChanged
        );
    }

    /**
     * Toggles close popup.
     *
     * @memberof app.ui
     * @public
     */
    ui.toggleClosePopup = function toggleClosePopup() {
        if (closePopup.classList.contains('ui-popup-active')) {
            tau.closePopup(closePopup);
        } else {
            tau.openPopup(closePopup);
        }
    };

    /**
     * Initializes the ui module.
     *
     * @memberof app.ui
     * @public
     */
    ui.init = function init() {
        modelGeolocation = app.model.geolocation;
        modelNetwork = app.model.network;
        modelCompass = app.model.compass;
        uiWaiting = app.ui.waiting;
        uiDestination = app.ui.destination;
        uiNavigation = app.ui.navigation;
        uiFinish = app.ui.finish;
        closePopup = document.getElementById('close-popup');
        closePopupYesBtn = closePopup.querySelector('#close-popup-yes-btn');
        bindEvents();
        uiWaiting.init();
        uiDestination.init();
        uiNavigation.init();
        uiFinish.init();
        modelNetwork.init();
        modelCompass.init();
    };

})(window.app);
