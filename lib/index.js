var FastMap = require("collections/fast-map");

module.exports = {

    // each task has an expiry time which we need to keep.
    // we will use the Fast-Map data structure, which is an efficient,
    // unordered, hash map implementation.
    // Keys are the tasks, values are expiry times.
    _members: new FastMap(),

    add: function(params) {

        /**
         * Add a new task member.
         * params.mem - task key ('member')
         * params.ex - task estimated expiry time in msecs.
         */

        var that = this;
        var mem = JSON.stringify(params.mem);
        var ex = params.ex;
        var members = that._members;

        members.set(mem, 0);

        that._setExpiryTime({
            mem: mem,
            ex: ex
        });

    },

    active: function(next) {

        /**
         * Call the 'next' callback function with
         * the number of active tasks as a parameter.
         * 'next' is in the form:
         * function next(NumOfActiveTasks){ ... }
         */

        var that = this;
        var members = that._members;

        that._purgeInactive();

        next(members.toArray().length);

    },

    del: function(mem) {

        /**
         * Remove a task member to indicate it's no longer active.
         */

        var that = this;
        var members = that._members;
        mem = JSON.stringify(mem);

        members.delete(mem);

    },

    _purgeInactive: function() {

        var that = this;
        var members = that._members;
        var now = (new Date).getTime();

        // traverse the members map and delete any
        // expired members
        members.forEach(function(ex, mem) {

            if (ex <= now) {
                members.delete(mem);
            }

        });

    },

    _setExpiryTime: function(params) {

        var that = this;
        var members = that._members;
        var mem = params.mem;
        var ex = params.ex;
        var time = (new Date()).getTime();

        time += ex;
        members.set(mem, time);

    },

    // *** THE FOLLOWING ARE CONVENIENCE METHODS FOR TESTING ***

    _clear: function() {

        var that = this;
        var members = that._members;

        members.forEach(function(ex, mem) {

            members.delete(mem);

        });

    },

    _addBulk: function(oMembers){

        // oMembers - other members. assumed to be of type fast-map

        var that = this;
        var members = that._members;

        members.addEach(oMembers);

    }

};
