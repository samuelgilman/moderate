var path = require('path');
var assert = require('assert');
var moderate = require(path.resolve('./'));
var clock = require('sinon').useFakeTimers();

describe('Moderate', function() {

    describe('Tasks handling', function() {

        describe('Adding first task with expiry time of 5 seconds',
            function() {

                before(function() {

                    moderate.add({
                        mem: "Task 1",
                        ex: 5000
                    });

                });

                it('should have 1 active task', function() {

                    moderate.active(function(numOfActive) {

                        assert.equal(numOfActive, 1);

                    });

                });

            });

        describe('Adding second task with expiry time of 7 seconds',
            function() {

                before(function() {
                    moderate.add({
                        mem: "Task 2",
                        ex: 7000
                    });
                });

                it('should have 2 active tasks', function() {

                    moderate.active(function(numOfActive) {

                        assert.equal(numOfActive, 2);

                    });

                });

            });

        describe('Waiting 5.5 seconds for first task to expire (fake clock)',
            function() {

                before(function() {

                    clock.tick(5500);

                });

                it('should have 1 active tasks', function() {

                    moderate.active(function(numOfActive) {

                        assert.equal(numOfActive, 1);

                    });

                });

            });

        describe('Manually deleting second task', function() {

            before(function() {

                moderate.del("Task 2");

            });

            it('should have 0 active tasks', function() {

                moderate.active(function(numOfActive) {

                    assert.equal(numOfActive, 0);

                });

            });

        });

    });

});