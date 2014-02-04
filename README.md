# Moderate

A Node.js module to manage concurrency.

## What is it

This module aims to help Node.js applications untilize their full non blocking potential by adding callbacks to the stack at a non blocking pace but with moderation to prevent stackoverflows.

### Install

<pre>
npp install moderate
</pre>


### Example application

Say you have a crawler. This crawl takes links, gets the html, and the stores it to some db. This is the only thing the crawler does. 

<pre>

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

      // request url
      // ... 
      // save

      moderate.del(url);

    }
  
  });

}, 1000);

</pre>

