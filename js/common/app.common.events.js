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

/* global window*/

/**
 * Application common events module.
 * Provides common methods related to events triggering.
 *
 * @module app.common.events
 * @namespace app.common.events
 * @memberof app.common
 */

// make sure that "app" namespace is created
window.app = window.app || {};

// strict mode wrapper function
(function defineAppCommonEvents(app) {
    'use strict';

    /**
     * Events module reference.
     *
     * @memberof app.common
     * @private
     * @type {object}
     */
    var events = null;

    // create namespace for the module
    app.common = app.common || {};
    app.common.events = app.common.events || {};
    events = app.common.events;

    /**
     * Dispatches an event.
     *
     * @memberof app.common.events
     * @public
     * @param {string} eventName Event name.
     * @param {*} data Detailed data.
     */
    events.dispatchEvent = function dispatchEvent(eventName, data) {
        var customEvent = new window.CustomEvent(eventName, {
            detail: data
        });

        window.dispatchEvent(customEvent);
    };

})(window.app);
