module.exports = {

  keys: {},

  set: [],

  add: function (params) {

    var that = this;
    var mem = params.mem;
    var ex = params.ex;

    that.setex({
      mem: mem,
      ex: ex
    });

    that.sadd(mem);

  },

  active: function (next) {

    var that = this;
    var mems = that.set;
   
    if (!mems.length) {

      next(0);

    } else {

      that.getActive({

        total: 0,
        index: 0,
        mems: mems

      }, function (active) {

        next(active);

      });

    }

  },

  getActive: function (params, next) {
  
    var that = this;
    var total = params.total;
    var index = params.index;
    var mems = params.mems;
    var mem = mems[index];

    if (mem) {
      
      var inc = 0;
      var value = that.get(mem);

      if (value) {
        inc += 1;
      } else {
        that.del(mem);
      }

      that.getActive({
        total: (total + inc),
        index: (index + 1),
        mems: mems 
      }, next);

    } else {

      next(total);

    }

  },

  setex: function (params) {

    var that = this;
    var keys = that.keys;
    var mem = params.mem;
    var ex = params.ex;
    var date = new Date();
    var time = date.getTime();
    
    time += ex;
    keys[mem] = time;

  },

  get: function (mem) {

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

  sadd: function (mem) {

    var that = this;
    var set = that.set;
    var sismember = that.sismember(mem);
  
    if (!sismember) {
      set.push(mem);
    }   

  },

  del: function (mem) {

    var that = this;
    var keys = that.keys;
    
    delete keys[mem];
    that.srem(mem);  

  },

  sismember: function (mem) {

    var that = this;
    var set = that.set;
    var index = set.indexOf(mem);

    return (index !== -1);

  },

  srem: function (mem) {

    var that = this;
    var set = that.set;
    var index = set.indexOf(mem);

    if (index !== -1) {
      set.splice(index, 1);
    }

  }

};
