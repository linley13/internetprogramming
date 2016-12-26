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
 * Application navigation page module.
 * It is responsible for navigation page layout and logic.
 *
 * @module app.ui.navigation
 * @requires {@link app.common.calculations}
 * @requires {@link app.model.geolocation}
 * @requires {@link app.ui.waiting}
 * @requires {@link app.ui.destination}
 * @requires {@link app.ui.finish}
 * @namespace app.ui.navigation
 * @memberof app.ui
 */

// make sure that "app" namespace is created
window.app = window.app || {};

(function defineAppUiNavigation(app) {
    'use strict';

    /**
     * Page Id.
     *
     * @private
     * @const {string}
     */
    var PAGE_ID = 'navigation',

        /**
         * Navigation path angle.
         *
         * @private
         * @const {number}
         */
        PATH_ANGLE = 60,

        /**
         * Page element.
         *
         * @private
         * @type {HTMLElement}
         */
        page = null,

        /**
         * Arrow element.
         *
         * @private
         * @type {HTMLElement}
         */
        arrow = null,

        /**
         * Compass element.
         *
         * @private
         * @type {HTMLElement}
         */
        compass = null,

        /**
         * Map button element.
         *
         * @private
         * @type {HTMLElement}
         */
        mapBtn = null,

        /**
         * Manual button element.
         *
         * @private
         * @type {HTMLElement}
         */
        manualBtn = null,

        /**
         * Distance value element.
         *
         * @private
         * @type {HTMLElement}
         */
        distanceValue = null,

        /**
         * Distance unit element.
         *
         * @private
         * @type {HTMLElement}
         */
        distanceUnit = null,

        /**
         * Progress path element.
         *
         * @private
         * @type {HTMLElement}
         */
        progressPath = null,

        /**
         * Progress path mask element.
         *
         * @private
         * @type {HTMLElement}
         */
        progressPathMask = null,

        /**
         * Progress path indicator element.
         *
         * @private
         * @type {HTMLElement}
         */
        progressPathIndicator = null,

        /**
         * Common calculations module reference.
         *
         * @private
         * @type {object}
         */
        commonCalculations = null,

        /**
         * Geolocation model module reference.
         *
         * @private
         * @type {object}
         */
        modelGeolocation = null,

        /**
         * Compass model module reference.
         *
         * @private
         * @type {object}
         */
        modelCompass = null,

        /**
         * Ui waiting module reference.
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
         * UI finish module reference.
         *
         * @private
         * @type {object}
         */
        uiFinish = null,

        /**
         * UI navigation module reference.
         *
         * @private
         * @type {object}
         */
        uiNavigation = null,

        /**
         * Destination position object.
         *
         * @private
         * @type {object}
         */
        destinationPosition = null,

        /**
         * Total distance.
         *
         * @private
         * @type {number}
         */
        totalDistance = 0;

    // create namespace for the module
    app.ui = app.ui || {};
    app.ui.navigation = app.ui.navigation || {};
    uiNavigation = app.ui.navigation;

    /**
     * Updates arrow rotation.
     *
     * @private
     * @param {object} currentPosition
     */
    function updateArrowRotation(currentPosition) {
        var angle = commonCalculations.calculateAngle(
                currentPosition,
                destinationPosition
            ),
            rotation = angle + modelCompass.getRotation();

        arrow.style['-webkit-transform'] = 'rotate(' + rotation + 'deg)';
    }

    /**
     * Updates compass rotation.
     *
     * @private
     */
    function updateCompassRotation() {
        compass.style['-webkit-transform'] =
            'rotate(' + modelCompass.getRotation() + 'deg)';
    }

    /**
     * Updates distance value.
     *
     * @private
     * @param {object} currentPosition
     */
    function updateDistanceValue(currentPosition) {
        var distance = commonCalculations.calculateDistance(
            currentPosition, destinationPosition
        );

        distanceValue.innerText = distance.formatted;
        distanceUnit.innerText = distance.unit;
    }

    /**
     * Updates navigation path.
     *
     * @private
     * @param {object} currentPosition
     */
    function updateNavigationPath(currentPosition) {
        var distance = commonCalculations.calculateDistance(
                currentPosition, destinationPosition
            ).raw,
            angle = commonCalculations.calculatePathAngle(
                distance <= totalDistance ? distance : totalDistance,
                totalDistance,
                PATH_ANGLE
            );

        progressPath.style['-webkit-transform'] =
            'rotate(' + (-angle) + 'deg)';
        progressPathMask.style['-webkit-transform'] =
            'rotate(' + angle + 'deg)';
        progressPathIndicator.style['-webkit-transform'] =
            'rotate(' + (angle - PATH_ANGLE) + 'deg)';
    }

    /**
     * Updates UI.
     *
     * @private
     */
    function updateUI() {
        var currentPosition = modelGeolocation.getCurrentPosition();

        updateCompassRotation();
        updateArrowRotation(currentPosition);
        updateDistanceValue(currentPosition);
        updateNavigationPath(currentPosition);
    }

    /**
     * Handles pagebeforeshow event.
     *
     * @private
     */
    function onPageBeforeShow() {
        updateUI();
    }

    /**
     * Handles click event on map button.
     *
     * @private
     */
    function onMapBtnClick() {
        uiDestination.show({
            mapMode: true
        });
    }

    /**
     * Handles click event on manual button.
     *
     * @private
     */
    function onManualBtnClick() {
        uiDestination.show({
            mapMode: false
        });
    }

    /**
     * Handles model.geolocation.current.position.changed event.
     *
     * Updates navigation page ui
     * according to the values provided by the geolocation model module.
     *
     * @private
     */
    function onModelGeolocationCurrentPositionChanged() {
        if (tau.activePage.id === PAGE_ID) {
            updateUI();
        }
    }

    /**
     * Handles model.geolocation.destination.reached event.
     *
     * @private
     */
    function onModelGeolocationDestinationReached() {
        if (tau.activePage.id === PAGE_ID) {
            uiFinish.show();
        }
    }

    /**
     * Handles model.compass.rotation.changed event.
     *
     * @private
     */
    function onModelCompassRotationChanged() {
        if (tau.activePage.id === PAGE_ID) {
            updateCompassRotation();
            updateArrowRotation(modelGeolocation.getCurrentPosition());
        }
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
        page.addEventListener('pagebeforeshow', onPageBeforeShow);
        mapBtn.addEventListener('click', onMapBtnClick);
        manualBtn.addEventListener('click', onManualBtnClick);
        window.addEventListener(
            'model.geolocation.current.position.changed',
            onModelGeolocationCurrentPositionChanged
        );
        window.addEventListener(
            'model.geolocation.destination.reached',
            onModelGeolocationDestinationReached
        );
        window.addEventListener(
            'model.compass.rotation.changed',
            onModelCompassRotationChanged
        );
        window.addEventListener(
            'model.geolocation.position.lost',
            onModelGeolocationPositionLost
        );
    }

    /**
     * Shows the navigation page.
     *
     * @memberof app.ui.navigation
     * @public
     */
    uiNavigation.show = function show() {
        destinationPosition = modelGeolocation.getDestinationPosition();
        totalDistance = commonCalculations.calculateDistance(
            modelGeolocation.getCurrentPosition(),
            destinationPosition
        ).raw;
        tau.changePage('#' + PAGE_ID);
    };

    /**
     * Initializes the ui navigation module.
     *
     * @memberof app.ui.navigation
     * @public
     */
    uiNavigation.init = function init() {
        commonCalculations = app.common.calculations;
        modelGeolocation = app.model.geolocation;
        modelCompass = app.model.compass;
        uiWaiting = app.ui.waiting;
        uiDestination = app.ui.destination;
        uiFinish = app.ui.finish;
        page = document.getElementById(PAGE_ID);
        arrow = page.querySelector('#arrow');
        compass = page.querySelector('#compass');
        distanceValue = page.querySelector('#navigation-distance-value');
        distanceUnit = page.querySelector('#navigation-distance-unit');
        progressPath = page.querySelector('#progress-path');
        progressPathMask = page.querySelector('#progress-path-mask');
        progressPathIndicator = page.querySelector('#progress-path-indicator');
        mapBtn = page.querySelector('#navigation-map-btn');
        manualBtn = page.querySelector('#navigation-manual-btn');
        bindEvents();
    };

})(window.app);
