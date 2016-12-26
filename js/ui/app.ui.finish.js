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

/*global window, tau, document*/

/**
 * Application finish page module.
 * It is responsible for finish page layout and logic.
 *
 * @module app.ui.finish
 * @requires {@link app.model.geolocation}
 * @requires {@link app.ui.destination}
 * @requires {@link app.ui.waiting}
 * @namespace app.ui.finish
 * @memberof app.ui
 */

// make sure that "app" namespace is created
window.app = window.app || {};

(function defineAppUiFinish(app) {
    'use strict';

    /**
     * Page Id.
     *
     * @private
     * @const {string}
     */
    var PAGE_ID = 'finish',

        /**
         * Page element.
         *
         * @private
         * @type {HTMLElement}
         */
        page = null,

        /**
         * Close button element.
         *
         * @private
         * @type {HTMLElement}
         */
        closeBtn = null,

        /**
         * New destination button element.
         *
         * @private
         * @type {HTMLElement}
         */
        newDestinationBtn = null,

        /**
         * Geolocation model module reference.
         *
         * @private
         * @type {object}
         */
        modelGeolocation = null,

        /**
         * Ui destination module reference.
         *
         * @private
         * @type {object}
         */
        uiDestination = null,

        /**
         * Ui waiting module reference.
         *
         * @private
         * @type {object}
         */
        uiWaiting = null,

        /**
         * Ui module reference.
         *
         * @private
         * @type {object}
         */
        ui = null,

        /**
         * UiFinish module reference.
         *
         * @private
         * @type {object}
         */
        uiFinish = null;

    // create namespace for the module
    app.ui = app.ui || {};
    app.ui.finish = app.ui.finish || {};
    uiFinish = app.ui.finish;

    /**
     * Handles click event on close button.
     *
     * @private
     */
    function onCloseBtnClick() {
        ui.toggleClosePopup();
    }

    /**
     * Handles click event on new destination button.
     *
     * Resets destination position in geolocation model
     * and displays destination page.
     *
     * @private
     */
    function onNewDestinationBtnClick() {
        modelGeolocation.setDestinationPosition();
        uiDestination.show({
            mapMode: uiDestination.isMapModeActive()
        });
    }

    /**
     * Handles model.geolocation.position.lost event.
     *
     * @private
     */
    function onModelGeolocationPositionLost() {
        if (tau.activePage.id === PAGE_ID) {
            uiWaiting.show();
        }
    }

    /**
     * Registers event listeners.
     *
     * @private
     */
    function bindEvents() {
        closeBtn.addEventListener('click', onCloseBtnClick);
        newDestinationBtn.addEventListener('click', onNewDestinationBtnClick);
        window.addEventListener(
            'model.geolocation.position.lost',
            onModelGeolocationPositionLost
        );
    }

    /**
     * Shows the finish page.
     *
     * @memberof app.ui.finish
     * @public
     */
    uiFinish.show = function show() {
        tau.changePage('#' + PAGE_ID);
    };

    /**
     * Initializes the ui finish module.
     *
     * @memberOf app.ui.finish
     * @public
     */
    uiFinish.init = function init() {
        modelGeolocation = app.model.geolocation;
        ui = app.ui;
        uiDestination = app.ui.destination;
        uiWaiting = app.ui.waiting;
        page = document.getElementById(PAGE_ID);
        closeBtn = page.querySelector('#finish-close-btn');
        newDestinationBtn = page.querySelector('#finish-new-destination-btn');
        bindEvents();
    };

})(window.app);
