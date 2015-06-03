/*
 *  Copyright 2015 Reverb Technologies, Inc.
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
/**
 * swaggersocket.js
 * https://github.com/swagger-api/swagger-socket/tree/master/modules/swaggersocket.js
 *
 * Requires
 * - atmosphere.js 2.2.8 https://github.com/Atmosphere/atmosphere-javascript/tree/master/modules/javascript
 *
 *
 */
(function() {
   "use strict";

    var root = this;
    var has_require = typeof require !== 'undefined';
    var atmosphere = root.atmosphere;

    if(typeof atmosphere === 'undefined') {
        if(has_require) {
            atmosphere = require('atmosphere-client');
        }
        else {
            throw new Error('swaggersocket requires atmosphere, see https://github.com/swagger-api/swagger-socket');
        }
    }



var swaggersocket = function() {
    return {

        version : "2.0.2-javascript",

        Options : {
            timeout : 300000,
            transport : 'websocket',
            maxRequest : 60,
            reconnect : true,
            maxStreamingLength : 10000000,
            method : 'POST',
            fallbackMethod : 'POST',
            fallbackTransport : 'long-polling',
            enableXDR : false,
            executeCallbackBeforeReconnect : false,
            withCredentials : false,
            trackMessageLength : false,
            messageDelimiter : '<->',
            connectTimeout : -1,
            reconnectInterval : 0,
            dropAtmosphereHeaders : true,
            readResponsesHeaders: false
        },

        _identity : 0,
        _logLevel : 'info',

        /**
         * Handshake object.
         * @private
         */
        _Handshake : function() {
            var _protocolVersion = "1.0", _protocolName = "SwaggerSocket", _dataFormat = "application/json", _method = "POST", _uuid = 0, _path = "/", _headers = null, _queryString = null, _self = {
                protocolVersion : function(protocolVersion) {
                    _protocolVersion = protocolVersion;
                    return this;
                },

                path : function(path) {
                    _path = path;
                    return this;
                },

                getPath : function() {
                    return path;
                },

                method : function(method) {
                    _method = method;
                    return this;
                },

                getMethod : function() {
                    return _method;
                },

                dataFormat : function(dataFormat) {
                    _dataFormat = dataFormat;
                    return this;
                },

                getDataFormat : function() {
                    return _dataFormat;
                },

                headers : function(headers) {
                    if (Object.prototype.toString.call(headers) == '[object Array]' || headers == null) {
                        _headers = headers;
                    } else {
                        _headers = [headers];
                    }
                    return this;
                },

                getHeaders : function() {
                    return _headers;
                },

                getQueryString : function() {
                    return _queryString;
                },

                queryString : function(queryString) {
                    if (Object.prototype.toString.call(queryString) == '[object Array]' || queryString == null) {
                        _queryString = queryString;
                    } else {
                        _queryString = [queryString];
                    }
                    return this;
                },

                toJSON : function() {
                    var s = "{ \"handshake\" : { \"protocolVersion\" : \""
                        + _protocolVersion
                        + "\",\"protocolName\" : \"" + _protocolName
                        + "\", \"uuid\" : \"" + _uuid
                        + "\", \"path\" : \"" + _path + "\"";

                    if (_dataFormat != null) {
                        s += ",\"dataFormat\" : \"" + _dataFormat + "\"";
                    }

                    if (_headers != null) {
                        s += ",\"headers\" : " + atmosphere.util.stringifyJSON(_headers);
                    }

                    if (_queryString != null) {
                        s += ",\"queryString\" : " + atmosphere.util.stringifyJSON(_queryString);
                    }

                    s += "}}";
                    return s;
                }
            };
            return _self;
        },

        /**
         * SwaggerSocket Request object.
         */
        Request : function() {
            var _uuid = atmosphere.util.now(), _headers = null, _queryString = null, _dataFormat = "application/json", _data = "", _listener = null, _method = "POST", _path = "/", _self = {

                uuid : function(uuid) {
                    _uuid = uuid;
                    return this;
                },

                getUUID : function() {
                    return _uuid;
                },

                path : function(path) {
                    _path = path;
                    return this;
                },

                getPath : function() {
                    return _path;
                },

                method : function(method) {
                    _method = method;
                    return this;
                },

                getMethod : function() {
                    return _method;
                },

                headers : function(headers) {
                    if (Object.prototype.toString.call(headers) == '[object Array]' || headers == null) {
                        _headers = headers;
                    } else {
                        _headers = [headers];
                    }
                    return this;
                },

                getHeaders : function() {
                    return _headers;
                },

                dataFormat : function(dataFormat) {
                    _dataFormat = dataFormat;
                    return this;
                },

                getDataFormat : function() {
                    return _dataFormat;
                },

                queryString : function(queryString) {
                    if (Object.prototype.toString.call(queryString) == '[object Array]' || queryString == null) {
                        _queryString = queryString;
                    } else {
                        _queryString = [queryString];
                    }
                    return this;
                },

                getQueryString : function() {
                    return _queryString;
                },

                data : function(data) {
                    _data = data;
                    return this;
                },

                getData : function() {
                    return _data;
                },

                listener : function(listener) {
                    _listener = listener;
                    return this;
                },

                getListener : function() {
                    return _listener;
                },

                /**
                 * The
                 * @param identity
                 */
                _toCompleteJSON : function(identity) {
                    return "{ \"identity\" : \"" + identity + "\","
                        + "\"requests\" : [ {"
                        + this._toJSON()
                        + "] }";
                },

                _toJSON : function() {
                    var s = "\"uuid\" : \"" + _uuid + "\","
                        + "\"method\" : \"" + _method + "\","
                        + "\"path\" : \"" + _path + "\"";

                    if (_dataFormat != null) {
                        s += ",\"dataFormat\" : \"" + _dataFormat + "\"";
                    }

                    if (_headers != null) {
                        s += ",\"headers\" : " + atmosphere.util.stringifyJSON(_headers);
                    }

                    if (_queryString != null) {
                        s += ",\"queryString\" : " + atmosphere.util.stringifyJSON(_queryString);
                    }

                    if (_dataFormat == null || _dataFormat.toLowerCase().indexOf("json") == -1 || _data == "") {
                        s += ",\"messageBody\" : \"" + _data + "\"}";
                    } else {
                        s += ",\"messageBody\" : " + _data + "}";
                    }
                    return s;
                }
            };
            return _self;
        },

        CloseMessage : function() {
            var _reason, _identity, _self = {

                reason:function (reason) {
                    _reason = reason;
                    return this;
                },

                identity:function (identity) {
                    _identity = identity;
                    return this;
                },

                toJSON : function() {
                    var s = "{ \"close\" : { \"reason\" : \""
                        + _reason
                        + "\",\"identity\" : \"" + _identity
                        + "\" }}"
                    return s;
                }
            };
            return _self;
        },

        /**
         * A SwaggerSocket Response object.
         */
        Response : function() {

            var _uuid = 0, _last = false, _request = null, _status = "200", _reasonPhrase = "OK", _path = '/', _headers = [], _data = "", _self = {

                uuid : function(uuid) {
                    _uuid = uuid;
                    return this;
                },

                getUUID : function() {
                    return _uuid;
                },

                last : function(last) {
                    _last = last;
                    return this;
                },

                isLast : function() {
                    return _last;
                },

                request : function(request) {
                    _request = request;
                    return this;
                },

                getRequest : function() {
                    return _request;
                },

                path : function(path) {
                    _path = path;
                    return this;
                },

                getPath : function() {
                    return _path;
                },

                statusCode : function(status) {
                    _status = status;
                    return this;
                },

                getStatusCode : function() {
                    return _status;
                },

                headers : function(headers) {
                    _headers = headers;
                    return this;
                },

                getHeaders : function() {
                    return _headers;
                },

                reasonPhrase : function(reasonPhrase) {
                    _reasonPhrase = reasonPhrase;
                    return this;
                },

                getReasonPhrase : function() {
                    return _reasonPhrase;
                },

                data : function(data) {
                    _data = data;
                    return this;
                },

                getData : function() {
                    return _data;
                }
            };
            return _self;
        },

        /**
         * A per Request event listener.
         */
        SwaggerSocketListener : function() {
            var onResponse = function(response) {
            }, onError = function(response) {
            }, onClose = function(response) {
            }, onOpen = function(response) {
            }, onResponses = function(response) {
            }, onTransportFailure = function(response) {
            }
        },

        /**
         * Represent a SwaggerSocket connection.
         */
        SwaggerSocket : function() {
            /**
             * The Atmosphere's Connections.
             * @private
             */
            var _socket;

            /**
             * HashMap of current live request.
             * @private
             */
            var _requestsMap = new HashMap();

            /**
             * Global callback. Used for logging.
             * @param response
             * @private
             */
            var _loggingCallback = function(response) {
                atmosphere.util.log("Status " + response.status);
                atmosphere.util.log("Transport " + response.transport);
                atmosphere.util.log("State " + response.state);
                atmosphere.util.log("Data " + response.responseBody);
            };

            /**
             *
             * @param requests
             * @private
             */
            var _construct = function(requests) {
                var jsonReq = "{ \"identity\" : \"" + swaggersocket._identity + "\"," + "\"requests\" : [ {";
                atmosphere.util.each(requests, function(index, req) {
                    _requestsMap.put(req.getUUID(), req);
                    jsonReq += (index == requests.length - 1) ? req._toJSON() : req._toJSON() + ",{";
                });
                jsonReq += "] }";
                return jsonReq;
            };

            var _self = {
                /**
                 * Open a SwaggerSocket connection to the server.
                 *
                 * You MUST wait for the Response before using the send method
                 * @param request
                 * @private
                 */
                open : function(request, cFunction, options) {

                    var _openFunction;

                    if (typeof(request) == "string") {
                        var path = request;
                        request = new swaggersocket.Request();
                        request.method("POST").path(path);
                    }

                    if (typeof(cFunction) == 'function') {
                        _openFunction = cFunction;
                    }
                    function _pushResponse(response, state, listener) {
                        // handshake has been done
                        if (state == "messageReceived") {
                            switch (Object.prototype.toString.call(response)) {
                            case "[object Array]":
                                if (typeof(listener.onResponses) != 'undefined') {
                                    try {
                                        listener.onResponses(response);
                                    } catch (err) {
                                        if (swaggersocket._logLevel == 'debug') {
                                            atmosphere.util.debug(err.type);
                                        }
                                    }
                                }
                                return;
                            default:
                                if (response.getStatusCode() < 400 && typeof(listener.onResponse) != 'undefined') {
                                    try {
                                        listener.onResponse(response);
                                    } catch (err) {
                                        if (swaggersocket._logLevel == 'debug') {
                                            atmosphere.util.debug(err.type);
                                        }
                                    }
                                } else if (typeof(listener.onError) != 'undefined') {
                                    try {
                                        listener.onError(response);
                                    } catch (err) {
                                        if (swaggersocket._logLevel == 'debug') {
                                            atmosphere.util.debug(err.type);
                                        }
                                    }
                                }
                                break;
                            }
                        }
                    };

                    // TODO : check request and options' type.
                    // TODO: Support debug level

                    var _handshake = new swaggersocket._Handshake()
                        .path(request.getPath())
                        .dataFormat(request.getDataFormat())
                        .headers(request.getHeaders())
                        .queryString(request.getQueryString())
                        .method(request.getMethod());

                    if (typeof(options) == 'undefined') {
                        options = swaggersocket.Options;
                    } else {
                        options = atmosphere.util.extend(options, swaggersocket.Options);
                    }

                    var _incompleteMessage = "";
                    _socket = atmosphere.subscribe(request.getPath(), _loggingCallback, atmosphere.request = {
                        logLevel : swaggersocket._logLevel,
                        headers : { "SwaggerSocket": "1.0"},
                        transport : options.transport,
                        method : request.getMethod(),
                        fallbackTransport : options.fallbackTransport,
                        fallbackMethod : options.fallbackMethod,
                        timeout : options.timeout,
                        maxRequest :options.maxRequest,
                        reconnect : options.reconnect,
                        maxStreamingLength : options.maxStreamingLength,
                        enableXDR : options.enableXDR,
                        executeCallbackBeforeReconnect : options.executeCallbackBeforeReconnect,
                        withCredentials : options.withCredentials,
                        trackMessageLength : true,
                        messageDelimiter : options.messageDelimiter,
                        connectTimeout : options.connectTimeout,
                        reconnectInterval : options.reconnectInterval,
                        dropAtmosphereHeaders : options.dropAtmosphereHeaders,
                        data: _handshake.toJSON(),

                        callback : function(response) {
                            try {
                                var data = _incompleteMessage + response.responseBody;
                                // A long-Polling response may comes in two chunk (two connections)
                                if (_incompleteMessage != "" ) {
                                    response.state = "messageReceived";
                                }
                                var messageData = response.state != "messageReceived" || data.indexOf('heartbeat-') == 0
                                    ? "" : JSON.parse(data.replace(/^\d+<->/, ''));
                                var listener = atmosphere.util.extend(request.getListener(), new swaggersocket.SwaggerSocketListener());
                                var r = new swaggersocket.Response();
                                // _incompleteMessage != "" means the server sent a maxed out buffer but still invalid JSON
                                if (response.state == "messageReceived" || response.state == "opening") {
                                    _incompleteMessage = "";
                                    if (messageData.status) {
                                        // handling the handshake response
                                        r.statusCode(messageData.status.statusCode).reasonPhrase(messageData.status.reasonPhrase);
                                        if (r.getStatusCode() == 200) {
                                            swaggersocket._identity = messageData.identity;
                                            if (typeof(listener.onOpen) != 'undefined') {
                                                listener.onOpen(r);
                                            }
                                        } else {
                                            if (typeof(listener.onError) != 'undefined') {
                                                listener.onError(r);
                                            }
                                        }
                                    } else if (messageData.heartbeat) {
                                        if (swaggersocket._logLevel == 'debug') {
                                            atmosphere.util.debug("heartbeat" + messageData.heartbeat);
                                        }
                                    } else if (messageData.responses) {
                                        var _responses = new Array();
                                        var i = 0;
                                        atmosphere.util.each(messageData.responses, function(index, res) {
                                            r.statusCode(res.statusCode).reasonPhrase(res.reasonPhrase).path(res.path).headers(res.headers).data(res.messageBody).uuid(res.uuid).last(res.last);

                                            /*
                                             We may run OOM here because we kept the Request object around.
                                             TODO: Need to find a way to fix that by either re-creating the request
                                             */

                                            r.request(_requestsMap.get(res.uuid));
                                            listener = atmosphere.util.extend(r.getRequest().getListener(), new swaggersocket.SwaggerSocketListener());

                                            _pushResponse(r, response.state, listener)
                                            _responses[i++] = r;
                                            r = new swaggersocket.Response();
                                        });
                                        _pushResponse(_responses, response.state, listener)
                                    }
                                } else if (response.state == 're-opening') {
                                    response.request.method = 'GET';
                                    response.request.data = '';
                                } else if (response.state == "closed" && typeof(listener.onClose) != 'undefined') {
                                    r.reasonPhrase("close").statusCode(503);
                                    try {
                                        listener.onClose(r);
                                    } catch (err) {
                                        if (swaggersocket._logLevel == 'debug') {
                                            atmosphere.util.debug(err.type);
                                        }
                                    }
                                } else if (response.state == "transportFailure") {
                                    if (typeof(listener.onTransportFailure) != 'undefined') {
                                        try{
                                            listener.onTransportFailure(response);
                                        } catch (err) {
                                            atmosphere.util.error(err.type);
                                        }
                                    }
                                } else if (response.state == "error" && typeof(listener.onError) != 'undefined') {
                                    r.statusCode(response.statusCode).reasonPhrase(response.reasonPhrase);
                                    try {
                                        listener.onError(r);
                                    } catch (err) {
                                        if (swaggersocket._logLevel == 'debug') {
                                            atmosphere.util.debug(err.type);
                                        }
                                    }
                                }
                            } catch (err) {
                                if (swaggersocket._logLevel == 'debug') {
                                    atmosphere.util.debug(err.type);
                                }
                                _incompleteMessage = _incompleteMessage + response.responseBody;
                            }
                        }
                    });
                    return this;
                },

                /**
                 * Send requests using the SwaggerSocket connection.
                 * @param request
                 */
                send : function(requests) {
                    if (typeof(swaggersocket._identity) == 'undefined') {
                        // requests may be a single request or an array
                        var listener = 
                            atmosphere.util.extend((requests.constructor.toString().indexOf("Array") < 0 
                                           ? requests : requests[0]).getListener, 
                                          new swaggersocket.SwaggerSocketListener());
                        var r = new swaggersocket.Response();
                        r.statusCode("503").reasonPhrase("The open operation hasn't completed yet. Make sure your SwaggerSocketListener#onOpen has been invoked first.");

                        if (typeof(listener.onError) != "undefined") {
                            listener.onError(r);
                        }
                        atmosphere.util.error("The open operation hasn't completed yet. Make sure your SwaggerSocketListener#onOpen has been invoked first.");
                        return;
                    }

                    /**
                     * Invoke the socket.
                     * @param request
                     * @private
                     */
                    function _send(data) {
                        _socket.push(atmosphere.request = {
                            logLevel : 'debug',
                            transport : 'long-polling',
                            headers : { "SwaggerSocket": "1.0"},
                            method : "POST",
                            fallbackTransport : 'long-polling',
                            data: data
                        });
                    };

                    switch (Object.prototype.toString.call(requests)) {
                        case "[object Array]":
                            _send(_construct(requests));
                            return;
                        default:
                            _requestsMap.put(requests.getUUID(), requests);
                            _send(requests._toCompleteJSON(swaggersocket._identity));
                    }
                    return this;
                },

                /**
                 * Close the underlying connection.
                 */
                close : function() {
                    if (typeof(_socket) != 'undefined') {
                        var r = new swaggersocket.CloseMessage();
                        r.reason("unload").identity(swaggersocket._identity);
                        _socket.push(atmosphere.request = {
                            logLevel : 'debug',
                            transport : 'long-polling',
                            headers : { "SwaggerSocket": "1.0"},
                            method : "POST",
                            fallbackTransport : 'long-polling',
                            data: r.toJSON()
                        });
                        _socket.close();
                    }
                    return this;
                }
            };
            return _self;
        }
    }
}();

/**
 * © Mojavelinux, Inc · Document Version: 1.1 · Last Modified: Sun Mar 29, 2009 · License: Creative Commons
 */
function HashMap() {
    this.length = 0;
    this.items = new Array();
    for (var i = 0; i < arguments.length; i += 2) {
        if (typeof(arguments[i + 1]) != 'undefined') {
            this.items[arguments[i]] = arguments[i + 1];
            this.length++;
        }
    }

    this.remove = function(in_key) {
        in_key = atmosphere.util.trim(in_key);
        var tmp_previous;
        if (typeof(this.items[in_key]) != 'undefined') {
            this.length--;
            var tmp_previous = this.items[in_key];
            delete this.items[in_key];
        }

        return tmp_previous;
    }

    this.get = function(in_key) {
        in_key = atmosphere.util.trim(in_key);
        return this.items[in_key];
    }

    this.put = function(in_key, in_value) {
        in_key = atmosphere.util.trim(in_key);
        var tmp_previous;
        if (typeof(in_value) != 'undefined') {
            if (typeof(this.items[in_key]) == 'undefined') {
                this.length++;
            }
            else {
                tmp_previous = this.items[in_key];
            }

            this.items[in_key] = in_value;
        }

        return tmp_previous;
    }

    this.containsKey = function(in_key) {
        in_key = atmosphere.util.trim(in_key);
        return typeof(this.items[in_key]) != 'undefined';
    }

    this.clear = function() {
        for (var i in this.items) {
            delete this.items[i];
        }

        this.length = 0;
    }
}


    if(typeof exports !== 'undefined') {
        if(typeof module !== 'undefined' && module.exports) {
            exports = module.exports = swaggersocket;
        }
        exports.swaggersocket = swaggersocket;
    } else {
        root.swaggersocket = swaggersocket;
    }

}).call(this);
