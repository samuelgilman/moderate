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

    var moderate = require('moderate');
    var limit = 100; // concurrency 
    var ttl = (60 * 1000); // n ms to expiration
    var urls = []; // n urls

    setTimeout(function () {

      moderate.active(function (active) {

        if (active < limit) {

          moderate.add({
            mem: url,
            ttl: ttl
          });

          // make request
          // wait ... 
          // save

          moderate.del(url);
    
        }

      });
    
    }, 1000);

Instead of recursively calling the function when a page returns, moderate keeps track of how many callbacks are on the stack, albiet it's not that automatic because developers still have to manually specificy what to keep track of, but effectively this allows node to fly.
