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

/*global window, tau, setTimeout, document*/

/**
 * Application waiting page module.
 * It is responsible for waiting page layout and logic.
 *
 * @module app.ui.waiting
 * @requires {@link app.ui.destination}
 * @namespace app.ui.waiting
 * @memberof app.ui
 */

// make sure that "app" namespace is created
window.app = window.app || {};

(function defineAppUiWaiting(app) {
    'use strict';

    /**
     * Page Id.
     *
     * @private
     * @const {string}
     */
    var PAGE_ID = 'waiting',

        /**
         * Lost connection message string.
         *
         * @private
         * @const {string}
         */
        LOST_CONNECTION_MESSAGE = 'LOST\nCONNECTION',

        /**
         * Waiting for GPS data message string.
         *
         * @private
         * @const {string}
         */
        WAITING_FOR_GPS_DATA_MESSAGE = 'WAITING FOR\nGPS DATA',

        /**
         * Lost CSS class.
         *
         * @private
         * @const {string}
         */
        LOST_CLASS = 'lost',

        /**
         * Lost connection timeout.
         *
         * @private
         * @const {number}
         */
        LOST_CONNECTION_TIMEOUT = 3000,

        /**
         * UiWaiting module reference.
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
         * Page element.
         *
         * @private
         * @type {HTMLElement}
         */
        page = null,

        /**
         * Waiting message element.
         *
         * @private
         * @type {HTMLElement}
         */
        waitingMessage = null,

        /**
         * Stores information about the reason of displaying the waiting page.
         *
         * @type {boolean}
         */
        isConnectionLost = false;

    // create namespace for the module
    app.ui = app.ui || {};
    app.ui.waiting = app.ui.waiting || {};
    uiWaiting = app.ui.waiting;

    /**
     * Handles model.geolocation.position.available event.
     *
     * @private
     */
    function onModelGeolocationPositionAvailable() {
        if (tau.activePage.id === PAGE_ID) {
            if (isConnectionLost) {
                tau.back();
            } else {
                uiDestination.show();
            }
        }
    }

    /**
     * Sets waiting for GPS data message.
     *
     * @private
     */
    function setWaitingMessage() {
        waitingMessage.classList.remove(LOST_CLASS);
        waitingMessage.innerText = WAITING_FOR_GPS_DATA_MESSAGE;
    }

    /**
     * Sets lost connection message.
     *
     * @private
     */
    function setLostMessage() {
        waitingMessage.classList.add(LOST_CLASS);
        waitingMessage.innerText = LOST_CONNECTION_MESSAGE;
    }

    /**
     * Handles pagebeforeshow event.
     *
     * @private
     */
    function onPageBeforeShow() {
        setLostMessage();
        setTimeout(function onTimeout() {
            setWaitingMessage();
        }, LOST_CONNECTION_TIMEOUT);
    }

    /**
     * Registers event listeners.
     *
     * @private
     */
    function bindEvents() {
        page.addEventListener('pagebeforeshow', onPageBeforeShow);
        window.addEventListener(
            'model.geolocation.position.available',
            onModelGeolocationPositionAvailable
        );
    }

    /**
     * Shows the waiting page.
     *
     * @memberof app.ui.waiting
     * @public
     */
    uiWaiting.show = function show() {
        isConnectionLost = true;
        tau.changePage('#' + PAGE_ID);
    };

    /**
     * Initializes the ui waiting module.
     *
     * @memberof app.ui.waiting
     * @public
     */
    uiWaiting.init = function init() {
        uiDestination = app.ui.destination;
        page = document.getElementById(PAGE_ID);
        waitingMessage = page.querySelector('#waiting-message');
        setWaitingMessage();
        bindEvents();
    };

})(window.app);
