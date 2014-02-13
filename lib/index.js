var FastMap = require("collections/fast-map");

module.exports = {

    // each task has an expiry time which we need to keep.
    // we will use the Fast-Map data structure, which is an efficient,
    // unordered, hash map implementation.
    // Keys are the tasks, values are expiry times.
    members: new FastMap(),

    add: function(params) {

        /**
         * Add a new task member.
         * params.mem - task key ('member')
         * params.ex - task estimated expiry time in msecs.
         */

        var that = this;
        var mem = params.mem;
        var ex = params.ex;

        that.members.set(mem, 0);

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
        var mems = that.set;

        that._purgeInactive();

        next(mems.length);

    },

    _purgeInactive: function() {

        var that = this;
        var members = that.members;
        var now = date.getTime();

        // traverse the members map and delete any
        // expired members
        members.forEach(function(ex, mem) {
            
            if (ex <= now){
                members.delete(mem);
            }

        });

    },

    _setExpiryTime: function(params) {

        var that = this;
        var members = that.members;
        var mem = params.mem;
        var ex = params.ex;
        var date = new Date();
        var time = date.getTime();

        time += ex;
        members.set(mem, time);

    },

    get: function(mem) {

        var that = this;
        var keys = that.keys;
        var date = new Date();
        var time = date.getTime();
        var ex = keys[mem];

        if (ex && ex > time) {

            return ex;

        } else {

            that.del(mem);
            return false;

        }


    },

    sadd: function(mem) {

        var that = this;
        var set = that.set;
        var sismember = that.sismember(mem);

        if (!sismember) {
            set.push(mem);
        }

    },

    del: function(mem) {

        var that = this;
        var keys = that.keys;

        delete keys[mem];
        that.srem(mem);

    },

    sismember: function(mem) {

        var that = this;
        var set = that.set;
        var index = set.indexOf(mem);

        return (index !== -1);

    },

    srem: function(mem) {

        var that = this;
        var set = that.set;
        var index = set.indexOf(mem);

        if (index !== -1) {
            set.splice(index, 1);
        }

    }

};