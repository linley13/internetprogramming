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

/*global window, tau, google, document*/

/**
 * Application destination page module.
 * It is responsible for destination page layout and logic.
 *
 * @module app.ui.destinaton
 * @requires {@link app.model.geolocation}
 * @requires {@link app.model.network}
 * @requires {@link app.ui.navigation}
 * @requires {@link app.ui.waiting}
 * @namespace app.ui.destinaton
 * @memberof app.ui
 */

// make sure that "app" namespace is created
window.app = window.app || {};

(function defineAppUiDestination(app) {
    'use strict';

    /**
     * Page Id.
     *
     * @private
     * @const {string}
     */
    var PAGE_ID = 'destination',

        /**
         * The URL string to the start google maps marker icon.
         *
         * @private
         * @const {string}
         */
        START_POINT_ICON = 'images/coordinates_start_point.png',

        /**
         * The URL string to the end google maps marker icon.
         *
         * @private
         * @const {string}
         */
        END_POINT_ICON = 'images/coordinates_end_point.png',

        /**
         * Marker icon width.
         *
         * @private
         * @const {number}
         */
        MARKER_ICON_WIDTH = 30,

        /**
         * Marker icon height.
         *
         * @private
         * @const {number}
         */
        MARKER_ICON_HEIGHT = 42,

        /**
         * Keyboard on CSS class name constant.
         *
         * @private
         * @const {string}
         */
        KEYBOARD_ON_CLASS = 'keyboard-on',

        /**
         * Invalid CSS class name constant.
         *
         * @private
         * @const {string}
         */
        INVALID_CLASS = 'invalid',

        /**
         * Focused CSS class name constant.
         *
         * @private
         * @const {string}
         */
        FOCUSED = 'focused',

        /**
         * RwgExp pattern for latitude value.
         *
         * @private
         * @const {RegExp}
         */
        LATITUDE_REGEXP = /-?\d{1,2}\.\d+/,

        /**
         * RwgExp pattern for longitude value.
         *
         * @private
         * @const {RegExp}
         */
        LONGITUDE_REGEXP = /-?\d{1,3}\.\d+/,

        /**
         * Placeholder text.
         *
         * @private
         * @const {string}
         */
        PLACEHOLDER_TEXT = 'Required',

        /**
         * Letter spacing for inputs (in pixels)
         * (letter spacing [em] * font size [px] / 2).
         *
         * @private
         * @const {number}
         */
        LETTER_SPACING = 0.26 * 30,

        /**
         * Input text dot width for 40px font size.
         *
         * @private
         * @const {number}
         */
        DOT_WIDTH = 7 + LETTER_SPACING,

        /**
         * Input text dash width for 40px font size.
         *
         * @private
         * @const {number}
         */
        DASH_WIDTH = 13 + LETTER_SPACING,

        /**
         * Input text number width for 40px font size.
         *
         * @private
         * @const {number}
         */
        NUMBER_WIDTH = 17 + LETTER_SPACING,

        /**
         * Page element.
         *
         * @private
         * @type {HTMLElement}
         */
        page = null,

        /**
         * Map element.
         *
         * @private
         * @type {HTMLElement}
         */
        map = null,

        /**
         * Content element.
         *
         * @private
         * @type {HTMLElement}
         */
        content = null,

        /**
         * Destination mode button.
         *
         * @private
         * @type {HTMLElement}
         */
        modeBtn = null,

        /**
         * Destination start button.
         *
         * @private
         * @type {HTMLElement}
         */
        startBtn = null,

        /**
         * Latitude start element value.
         *
         * @private
         * @type {HTMLElement}
         */
        latitudeStart = null,

        /**
         * Longitude start element value.
         *
         * @private
         * @type {HTMLElement}
         */
        longitudeStart = null,

        /**
         * Latitude destination element value.
         *
         * @private
         * @type {HTMLElement}
         */
        latitudeDestination = null,

        /**
         * Longitude destination element value.
         *
         * @private
         * @type {HTMLElement}
         */
        longitudeDestination = null,

        /**
         * Latitude destination dot element.
         *
         * @private
         * @type {HTMLElement}
         */
        latitudeDestinationDot = null,

        /**
         * Longitude destination dot element.
         *
         * @private
         * @type {HTMLElement}
         */
        longitudeDestinationDot = null,

        /**
         * Latitude destination label element.
         *
         * @private
         * @type {HTMLElement}
         */
        latitudeDestinationLabel = null,

        /**
         * Longitude destination label element.
         *
         * @private
         * @type {HTMLElement}
         */
        longitudeDestinationLabel = null,

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
         * UI destination module reference.
         *
         * @private
         * @type {object}
         */
        uiNavigation = null,

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
         * The reference to the google.maps.Map object.
         *
         * @private
         * @type {object}
         */
        mapReference = null,

        /**
         * The reference to the google.maps.Marker object.
         *
         * @private
         * @type {object}
         */
        mapStartMarker = null,

        /**
         * The reference to the google.maps.Marker object.
         *
         * @private
         * @type {object}
         */
        mapDestinationMarker = null,

        /**
         * Indicates if the map mode should be activated.
         *
         * @private
         * @type {boolean}
         */
        isMapMode = false;

    // create namespace for the module
    app.ui = app.ui || {};
    app.ui.destination = app.ui.destination || {};
    uiDestination = app.ui.destination;

    /**
     * Disables start navigation button.
     *
     * @private
     */
    function disableStartBtn() {
        tau.widget.Button(startBtn).disable();
    }

    /**
     * Enables start navigation button.
     *
     * @private
     */
    function enableStartBtn() {
        tau.widget.Button(startBtn).enable();
    }

    /**
     * Performs action when the destination marker becomes visible
     * or its position changes.
     *
     * @private
     */
    function onDestinationMarkerPositionChanged() {
        var position = mapDestinationMarker.getPosition();

        modelGeolocation.setDestinationPosition({
            latitude: position.lat(),
            longitude: position.lng()
        });
    }

    /**
     * Adds destination marker to the map.
     *
     * @private
     * @param {object} position
     */
    function addDestinationMarker(position) {
        mapDestinationMarker = new google.maps.Marker({
            position: position,
            map: mapReference,
            title: 'Destination position',
            icon: new google.maps.MarkerImage(
                END_POINT_ICON,
                new google.maps.Size(MARKER_ICON_WIDTH, MARKER_ICON_HEIGHT),
                new google.maps.Point(0, 0),
                new google.maps.Point(15, 42),
                new google.maps.Size(MARKER_ICON_WIDTH, MARKER_ICON_HEIGHT)
            ),
            draggable: true
        });

        google.maps.event.addListener(
            mapDestinationMarker,
            'mouseup',
            onDestinationMarkerPositionChanged
        );

        mapDestinationMarker.setVisible(true);
    }

    /**
     * Sets destination marker position.
     *
     * @private
     * @param {object} position
     */
    function setDestinationMarker(position) {
        var mapDestinationPosition = new google.maps.LatLng(
            position.latitude,
            position.longitude
        );

        if (!mapDestinationMarker) {
            addDestinationMarker(mapDestinationPosition);
        } else {
            mapDestinationMarker.setPosition(mapDestinationPosition);
        }
    }

    /**
     * Updates destination marker position.
     *
     * @private
     * @param {object} position
     */
    function updateDestinationMarker(position) {
        if (position.latitude && position.longitude) {
            setDestinationMarker(position);
        } else {
            removeDestinationMarker();
        }
    }

    /**
     * Updates start marker position and manual start coordinates.
     *
     * @private
     */
    function updateStartPosition() {
        var currentPosition = modelGeolocation.getCurrentPosition(),
            latitude = currentPosition.latitude,
            longitude = currentPosition.longitude;

        if (modelNetwork.isGoogleService() && mapStartMarker) {
            mapStartMarker.setPosition(new google.maps.LatLng(
                latitude,
                longitude
            ));
        }

        latitudeStart.innerText = latitude;
        longitudeStart.innerText = longitude;
    }

    /**
     * Updates destination marker position and manual destination coordinates.
     *
     * @private
     */
    function updateDestinationPosition() {
        var position = modelGeolocation.getDestinationPosition(),
            latitude = position.latitude,
            longitude = position.longitude;

        updateDestinationMarker(position);

        if (isMapMode) {
            latitudeDestination.value = latitude ? latitude.toFixed(6) : '';
            longitudeDestination.value = longitude ? longitude.toFixed(6) : '';

            if (isLatitudeValid(latitude)) {
                latitudeDestination.classList.remove(INVALID_CLASS);
                latitudeDestinationLabel.classList.remove(INVALID_CLASS);
            } else {
                latitudeDestination.classList.add(INVALID_CLASS);
                latitudeDestinationLabel.classList.add(INVALID_CLASS);
            }

            if (isLongitudeValid(longitude)) {
                longitudeDestination.classList.remove(INVALID_CLASS);
                longitudeDestinationLabel.classList.remove(INVALID_CLASS);
            } else {
                longitudeDestination.classList.add(INVALID_CLASS);
                longitudeDestinationLabel.classList.add(INVALID_CLASS);
            }
        }

        if (latitude && longitude) {
            enableStartBtn();
        } else {
            disableStartBtn();
        }
    }

    /**
     * Removes destination marker.
     *
     * @private
     */
    function removeDestinationMarker() {
        if (mapDestinationMarker) {
            mapDestinationMarker.setMap(null);
            mapDestinationMarker = null;
        }
    }

    /**
     * Handles click event on google.maps.Map object.
     *
     * Updates destination position in the model.
     *
     * @private
     * @param {Event} e
     */
    function onGoogleMapClick(e) {
        var latLng = e.latLng;

        modelGeolocation.setDestinationPosition({
            latitude: latLng.lat(),
            longitude: latLng.lng()
        });
    }

    /**
     * Shows manual selector.
     *
     * @private
     */
    function switchToManual() {
        page.classList.remove('map');
    }

    /**
     * Displays google map.
     *
     * @private
     */
    function switchToMap() {
        var currentPosition = null,
            mapStartPosition = null,
            mapOptions = null;

        if (!mapReference) {
            currentPosition = modelGeolocation.getCurrentPosition();
            mapStartPosition = new google.maps.LatLng(
                currentPosition.latitude,
                currentPosition.longitude
            );
            mapOptions = {
                zoom: 10,
                center: mapStartPosition,
                zoomControl: false,
                mapTypeControl: false,
                scaleControl: false,
                streetViewControl: false,
                rotateControl: false,
                fullscreenControl: false
            };
            mapReference = new google.maps.Map(map, mapOptions);
            mapStartMarker = new google.maps.Marker({
                position: mapStartPosition,
                map: mapReference,
                title: 'Start position',
                icon: new google.maps.MarkerImage(
                    START_POINT_ICON,
                    new google.maps.Size(MARKER_ICON_WIDTH, MARKER_ICON_HEIGHT),
                    new google.maps.Point(0, 0),
                    new google.maps.Point(15, 42),
                    new google.maps.Size(MARKER_ICON_WIDTH, MARKER_ICON_HEIGHT)
                )
            });

            google.maps.event.addListener(
                mapReference,
                'click',
                onGoogleMapClick
            );
        }

        page.classList.add('map');
    }

    /**
     * Handles pagebeforeshow event.
     *
     * @private
     */
    function onPageBeforeShow() {
        updateStartPosition();
        updateDestinationPosition();
        if (isMapMode) {
            switchToMap();
        } else {
            switchToManual();
        }
    }

    /**
     * Handles click event on mode button.
     *
     * @private
     */
    function onModeBtnClick() {
        if (isMapMode) {
            switchToManual();
        } else {
            switchToMap();
        }
        isMapMode = !isMapMode;
    }

    /**
     * Handles click event on start navigation button.
     *
     * @private
     */
    function onStartBtnClick() {
        uiNavigation.show();
    }

    /**
     * Handles model.geolocation.current.position.changed event.
     *
     * Updates position of the start marker on the google map
     * according to the values provided by the geolocation model module.
     *
     * @private
     */
    function onModelGeolocationCurrentPositionChanged() {
        if (tau.activePage.id === PAGE_ID) {
            updateStartPosition();
        }
    }

    /**
     * Handles model.geolocation.destination.position.changed event.
     *
     * Updates position of the destination marker on the google map
     * according to the values provided by the geolocation model module.
     *
     * @private
     */
    function onModelGeolocationDestinationPositionChanged() {
        if (tau.activePage.id === PAGE_ID) {
            updateDestinationPosition();
        }
    }

    /**
     * Handles softkeyboardchange event.
     *
     * @private
     * @param {Event} e
     */
    function onSoftKeyboardChange(e) {
        if (e.state === 'on') {
            content.classList.add(KEYBOARD_ON_CLASS);
        } else {
            content.classList.remove(KEYBOARD_ON_CLASS);
        }
    }

    /**
     * Validates destination latitude.
     * Returns true when the latitude value is valid, false otherwise.
     *
     * @private
     * @param {string} value
     * @returns {boolean}
     */
    function isLatitudeValid(value) {
        if (Math.abs(parseFloat(value)) > 90) {
            return false;
        } else {
            return LATITUDE_REGEXP.test(value);
        }
    }

    /**
     * Validates destination longitude.
     * Returns true when the longitude value is valid, false otherwise.
     *
     * @private
     * @param {string} value
     * @returns {boolean}
     */
    function isLongitudeValid(value) {
        if (Math.abs(parseFloat(value)) > 180) {
            return false;
        } else {
            return LONGITUDE_REGEXP.test(value);
        }
    }

    /**
     * Handles input event on latitude destination element.
     *
     * Validates destination latitude and sets its value to the model.
     *
     * @private
     * @param {Event} e
     */
    function onLatitudeDestinationInput(e) {
        var value = e.target.value;

        if (isLatitudeValid(value)) {
            modelGeolocation.setDestinationLatitude(value);
            latitudeDestination.classList.remove(INVALID_CLASS);
            latitudeDestinationLabel.classList.remove(INVALID_CLASS);
        } else {
            modelGeolocation.setDestinationLatitude();
            latitudeDestination.classList.add(INVALID_CLASS);
            latitudeDestinationLabel.classList.add(INVALID_CLASS);
        }

        updateCaretPosition(latitudeDestination, latitudeDestinationDot);
    }

    /**
     * Handles input event on longitude destination element.
     *
     * Validates destination longitude and sete its value to the model.
     *
     * @private
     * @param {Event} e
     */
    function onLongitudeDestinationInput(e) {
        var value = e.target.value;

        if (isLongitudeValid(value)) {
            modelGeolocation.setDestinationLongitude(value);
            longitudeDestination.classList.remove(INVALID_CLASS);
            longitudeDestinationLabel.classList.remove(INVALID_CLASS);
        } else {
            modelGeolocation.setDestinationLongitude();
            longitudeDestination.classList.add(INVALID_CLASS);
            longitudeDestinationLabel.classList.add(INVALID_CLASS);
        }

        updateCaretPosition(longitudeDestination, longitudeDestinationDot);
    }

    /**
     * Handles click event on latitude destination element.
     *
     * @private
     */
    function onLatitudeDestinationClick() {
        updateCaretPosition(latitudeDestination, latitudeDestinationDot);
    }

    /**
     * Handles click event on longitude destination element.
     *
     * @private
     */
    function onLongitudeDestinationClick() {
        updateCaretPosition(longitudeDestination, longitudeDestinationDot);
    }

    /**
     * Updates dot caret position of given input element.
     *
     * @param {HTMlElement} input
     * @param {HTMLElement} caret
     */
    function updateCaretPosition(input, caret) {
        var value = input.value,
            selectionPosition = input.selectionStart,
            caretPosition = 0,
            relativePosition = 0,
            textWidth = 0,
            i = 0,
            charAt = '';

        for (i = 0; i < value.length; i += 1) {
            charAt = value.charAt(i);
            if (charAt === '.') {
                if (i < selectionPosition) {
                    caretPosition += DOT_WIDTH;
                }
                textWidth += DOT_WIDTH;
            } else if (charAt === '-') {
                if (i < selectionPosition) {
                    caretPosition += DASH_WIDTH;
                }
                textWidth += DASH_WIDTH;
            } else {
                if (i < selectionPosition) {
                    caretPosition += NUMBER_WIDTH;
                }
                textWidth += NUMBER_WIDTH;
            }
        }

        relativePosition =
            (window.innerWidth - textWidth) / 2 + caretPosition - 5;

        caret.style.left = relativePosition - LETTER_SPACING / 2 + 'px';
    }

    /**
     * Handles focus event on latitude destination element.
     *
     * Clears latitude placeholder.
     *
     * @private
     */
    function onLatitudeDestinationFocus() {
        latitudeDestination.placeholder = '';
        latitudeDestinationDot.classList.add(FOCUSED);
    }

    /**
     * Handles focus event on longitude destination element.
     *
     * Clears longitude placeholder.
     *
     * @private
     */
    function onLongitudeDestinationFocus() {
        longitudeDestination.placeholder = '';
        longitudeDestinationDot.classList.add(FOCUSED);
    }

    /**
     * Handles blur event on latitude destination element.
     *
     * Sets latitude placeholder.
     * Updates destination marker.
     *
     * @private
     */
    function onLatitudeDestinationBlur() {
        latitudeDestination.placeholder = PLACEHOLDER_TEXT;
        latitudeDestinationDot.classList.remove(FOCUSED);
        updateDestinationMarker({
            latitude: modelGeolocation.getDestinationLatitude(),
            longitude: modelGeolocation.getDestinationLongitude()
        });
    }

    /**
     * Handles blur event on longitude destination element.
     *
     * Sets longitude placeholder.
     * Updates destination marker.
     *
     * @private
     */
    function onLongitudeDestinationBlur() {
        longitudeDestination.placeholder = PLACEHOLDER_TEXT;
        longitudeDestinationDot.classList.remove(FOCUSED);
        updateDestinationMarker({
            latitude: modelGeolocation.getDestinationLatitude(),
            longitude: modelGeolocation.getDestinationLongitude()
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
        page.addEventListener('pagebeforeshow', onPageBeforeShow);
        modeBtn.addEventListener('click', onModeBtnClick);
        startBtn.addEventListener('click', onStartBtnClick);
        latitudeDestination.addEventListener(
            'click',
            onLatitudeDestinationClick
        );
        longitudeDestination.addEventListener(
            'click',
            onLongitudeDestinationClick
        );
        latitudeDestination.addEventListener(
            'input',
            onLatitudeDestinationInput
        );
        longitudeDestination.addEventListener(
            'input',
            onLongitudeDestinationInput
        );
        latitudeDestination.addEventListener(
            'focus',
            onLatitudeDestinationFocus
        );
        longitudeDestination.addEventListener(
            'focus',
            onLongitudeDestinationFocus
        );
        latitudeDestination.addEventListener(
            'blur',
            onLatitudeDestinationBlur
        );
        longitudeDestination.addEventListener(
            'blur',
            onLongitudeDestinationBlur
        );
        window.addEventListener(
            'model.geolocation.current.position.changed',
            onModelGeolocationCurrentPositionChanged
        );
        window.addEventListener(
            'model.geolocation.destination.position.changed',
            onModelGeolocationDestinationPositionChanged
        );
        window.addEventListener(
            'model.geolocation.position.lost',
            onModelGeolocationPositionLost
        );
        window.addEventListener('softkeyboardchange', onSoftKeyboardChange);
    }

    /**
     * Shows the destination page.
     *
     * @memberof app.ui.destination
     * @public
     * @param {object} data
     */
    uiDestination.show = function show(data) {
        var isGoogleService = modelNetwork.isGoogleService();

        if (data && isGoogleService) {
            isMapMode = data.mapMode;
        } else if (isMapMode && !isGoogleService) {
            isMapMode = false;
        } else {
            isMapMode = isGoogleService;
        }
        tau.changePage('#' + PAGE_ID);
    };

    /**
     * Checks if map mode is active.
     * Returns true if it is active, false otherwise.
     *
     * @memberof app.ui.destination
     * @public
     * @returns {boolean}
     */
    uiDestination.isMapModeActive = function isMapModeActive() {
        return isMapMode;
    };

    /**
     * Initializes the ui destination module.
     *
     * @memberof app.ui.destination
     * @public
     */
    uiDestination.init = function init() {
        modelGeolocation = app.model.geolocation;
        modelNetwork = app.model.network;
        uiNavigation = app.ui.navigation;
        uiWaiting = app.ui.waiting;
        page = document.getElementById(PAGE_ID);
        content = page.querySelector('.ui-content');
        modeBtn = page.querySelector('#destination-mode-btn');
        startBtn = page.querySelector('#destination-start-btn');
        map = page.querySelector('#map');
        latitudeStart = page.querySelector('#latitude-start');
        longitudeStart = page.querySelector('#longitude-start');
        latitudeDestination = page.querySelector('#latitude-destination');
        longitudeDestination = page.querySelector('#longitude-destination');
        latitudeDestinationDot =
            page.querySelector('#latitude-destination-dot');
        longitudeDestinationDot =
            page.querySelector('#longitude-destination-dot');
        latitudeDestinationLabel =
            page.querySelector('#latitude-destination-label');
        longitudeDestinationLabel =
            page.querySelector('#longitude-destination-label');
        disableStartBtn();
        bindEvents();
    };

})(window.app);
