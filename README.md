# Moderate

A Node.js module to manage concurrency.

## What is it

This module aims to help Node.js applications untilize their full non blocking potential by adding callbacks to the stack at a non blocking pace but with moderation to prevent stackoverflows.

### Install

<pre>
npp install moderate
</pre>


### Use 

The example below is a crawler. It picks links off a queue, crawls, and then saves them.

    var request = require('request');
    var moderate = require('moderate');
    var limit = 100; 
    var ttl = (60 * 1000); 
    var urls = []; 
    var interval = 3000;
    var timeout = 5000;

    function ready () {

      process();

      setTimeout(function () {
        ready();
      }, interval);

    }

    function process () {

      moderate.active(function (active) {

        if (active < limit) {

          moderate.add({
            mem: url,
            ttl: ttl
          });

          // recursively add to the stack
          // until your limit is greater than
          // the active number of members 

          ready(); 

          request({

            uri: uri,
            timeout: timeout 

          }, function (err, stuff){

            // process
            // save    

            // after you have procesed you stuff
            // free up the stack by deleting the
            // member from moderate. If for some
            // reason this never gets called the
            // members will expire eventuall based
            // on the ttl you passed when added 

            moderate.del(url):

          });

        }

      });

    };

    process();
  

Instead of recursively calling a function when a page returns, moderate keeps track of how many callbacks are on the stack, albiet it's not that automatic because developers still have to manually specificy what to keep track of, but effectively this allows node to fly.
