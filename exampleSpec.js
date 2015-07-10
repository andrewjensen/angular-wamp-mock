/* global vxWamp_mock */
describe('Pokemon controller', function() {
    'use strict';

    var controller, $controller, $scope, $rootScope, $wamp;

    var expected_topic = 'pokemon_refresh.999';

    var socket_events = [
        '{"topic": "pokemon_refresh", "send_to_stomp_manager_time_stamp": 1435015086, "user_id": 999, "destination_id": 999}' // jshint ignore:line
    ];

    function createController() {
        $scope = $rootScope.$new();
        controller = $controller('PokemonController', {
            $scope: $scope
        });
    }

    beforeEach(function() {
        //We mock the vxWamp module so we can mock the $wamp provider.
        //We load the MOCK wamp module, then set it in the $provide service.
        //Notice that we load the app module first.
        module('app');
        module('vxWamp_mock');
        module(function($provide) {
            $provide.value('vxWamp', vxWamp_mock);
        });
    });

    beforeEach(inject(function(_$controller_, _$rootScope_, _$wamp_) {
        $controller = _$controller_;
        $rootScope = _$rootScope_;
        $wamp = _$wamp_;
    }));

    afterEach(function() {
        $scope = null;
        controller = null;
    });

    describe('when initialized', function() {

        it('should connect to the socket server', function() {
            spyOn($wamp, 'open');

            createController();
            expect($wamp.open).toHaveBeenCalled();
        });

        it('should subscribe to pokemon refresh events', function() {
            spyOn($wamp, 'subscribe').and.callFake(function(topic, callback) {
                expect(topic).toEqual(expected_topic);
                expect(typeof callback).toBe('function');
            });

            createController();

            expect($wamp.subscribe).toHaveBeenCalled();
        });

    });

    describe('on socket updates', function() {

        it('should update the scope', function() {
            createController();

            vxWamp_mock.receive(expected_topic, socket_events);

            //Expect things to happen
        });

    });

});
