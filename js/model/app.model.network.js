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

/*global window, console, tizen*/

/**
 * Application network model module.
 * It is responsible for providing information about user location.
 *
 * @module app.model.network
 * @requires {@link app.common.events}
 * @namespace app.model.network
 * @memberof app.model
 */

// make sure that "app" namespace is created
window.app = window.app || {};

(function defineAppModelNetwork(app) {
    'use strict';

    /**
     * The list of the names of the available networks.
     *
     * @private
     * @const {string[]}
     */
    var NETWORKS = ['2G', '2.5G', '3G', '4G', 'WIFI', 'ETHERNET', 'UNKNOWN'],

        /**
         * Network model module reference.
         *
         * @private
         * @type {object}
         */
        modelNetwork = null,

        /**
         * Common events module reference.
         *
         * @private
         * @type {object}
         */
        commonEvents = app.common.events,

        /**
         * Systeminfo API object.
         *
         * @private
         * @type {object}
         */
        systeminfo = null,

        /**
         * Stores information about available network type.
         *
         * @private
         * @type {string}
         */
        networkType = 'NONE';

    // create namespace for the module
    app.model = app.model || {};
    app.model.network = app.model.network || {};
    modelNetwork = app.model.network;

    /**
     * Performs action when the type of the network changes.
     *
     * @private
     * @param {SystemInfoNetwork} network
     * @fires model.network.type.changed
     */
    function onNetworkTypeChange(network) {
        networkType = network.networkType;
        commonEvents.dispatchEvent('model.network.type.changed');
    }

    /**
     * Performs action when the type of the network is obtained.
     *
     * @private
     * @param {SystemInfoNetwork} network
     * @fires model.network.initialized
     */
    function onGetNetworkTypeSuccess(network) {
        networkType = network.networkType;
        commonEvents.dispatchEvent('model.network.initialized');
    }

    /**
     * Sets network value change listener.
     *
     * @private
     */
    function setNetworkValueChangeListener() {
        try {
            systeminfo.addPropertyValueChangeListener(
                'NETWORK',
                onNetworkTypeChange
            );
        } catch (error) {
            console.warn('Network change listener was not set.', error);
        }
    }

    /**
     * Checks available network type.
     *
     * @private
     */
    function checkNetworkType() {
        try {
            systeminfo.getPropertyValue(
                'NETWORK',
                onGetNetworkTypeSuccess,
                function onGetPropertyValueError(error) {
                    console.warn('Couldn\'t get network type value.', error);
                }
            );
        } catch (error) {
            console.warn('Couldn\'t get network type value.', error);
        }
    }

    /**
     * Checks whether the network type has different value than 'NONE'
     * and whether the google service is available.
     *
     * @memberof app.model.network
     * @public
     * @returns {boolean}
     */
    modelNetwork.isGoogleService = function isGoogleService() {
        return NETWORKS.indexOf(networkType) !== -1 && !!window.google;
    };

    /**
     * Checks whether the network type has different value than 'NONE'.
     *
     * @memberof app.model.network
     * @public
     * @returns {boolean}
     */
    modelNetwork.isNetworkAvailable = function isNetworkAvailable() {
        return NETWORKS.indexOf(networkType) !== -1;
    };

    /**
     * Returns available network type;
     *
     * @memberof app.model.network
     * @public
     * @returns {string}
     */
    modelNetwork.getNetworkType = function getNetworkType() {
        return networkType;
    };

    /**
     * Initializes the network model module.
     *
     * @memberof app.model.network
     * @public
     */
    modelNetwork.init = function init() {
        if (typeof tizen === 'object' && typeof tizen.systeminfo === 'object') {
            systeminfo = tizen.systeminfo;
            setNetworkValueChangeListener();
            checkNetworkType();
        } else {
            console.warn('tizen.systeminfo not available');
        }
    };

})(window.app);
