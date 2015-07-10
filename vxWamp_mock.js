var vxWamp_mock = (function() {
    'use strict';

    var _subscriptions = {};

    function _addSubscription(topic, callback) {
        if (!_subscriptions[topic]) {
            _subscriptions[topic] = [];
        }
        _subscriptions[topic].push(callback);
    }

    function $WampProvider_mock() {

        this.init = function(initOptions) {
            vxWamp_mock.initOptions = initOptions;
        };

        this.$get = ['$rootScope', function($rootScope) {

            //Mocking $wamp.open, $wamp.subscribe, etc
            return {
                open: function() {
                    $rootScope.$broadcast('$wamp.open', {
                        session: {}, details: {}
                    });
                    $rootScope.$apply();
                },
                subscribe: function(topic, callback) {
                    _addSubscription(topic, callback);
                },
                publish: function() {
                    throw new Error('vxWamp_mock does not yet mock the publish method');
                }
            };

        }];

    }

    /**
     * A fake vxWamp module, which injects a fake $wamp provider
     */
    var vxWamp_mock = angular.module('vxWamp_mock', []).provider('$wamp', $WampProvider_mock);

    /**
     * The options initialized by $wampProvider.init()
     * @type {Object}
     */
    vxWamp_mock.initOptions = null;

    /**
     * Receive data from an imaginary socket server.
     * An error will be thrown if there are no subscriptions for the topic.
     *
     * @static
     * @method receive
     * @param {String} the topic to receive on
     * @param {*} the data to receive on the topic
     */
    vxWamp_mock.receive = function _mockReceive(topic, data) {
        if (!_subscriptions[topic]) {
            throw new Error('Received data on topic \"' + topic + '\" with no subscribers');
        } else {
            _subscriptions[topic].forEach(function(callback) {
                callback(data);
            });
        }
    };

    /**
     * Reset the module to a clean state, with no subscriptions.
     *
     * @static
     * @method reset
     */
    vxWamp_mock.reset = function _reset() {
        _subscriptions = {};
    };

    return vxWamp_mock;
})();
