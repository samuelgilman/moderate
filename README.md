# Moderate

A Node.js module to manage concurrency of I/O intensive tasks.

## What is it

This module aims to help Node.js applications untilize their full non blocking
potential when dealing with I/O intensive tasks. 
In applications with a large number of such tasks, management of the callback
event handlers queue is required in order to prevent overloading.
'Moderate' helps adding callbacks to the queue at a non blocking pace, but with
moderation to prevent overflows.

### Install

`npp install moderate`

### Use

See the documented `test/example.js`.

#### Add

  #!Javascript
  moderate.add({
    mem: /* task member key */,
    ex: /* task estimated expiry time in msecs */
  });

