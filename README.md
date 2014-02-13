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

#### add

    moderate.add({
        mem: /* task member key */,
        ex: /* task estimated expiry time in msecs */
    });

`add` receives a `param` object with two keys:

1. `mem`: Task member key which is used to identify the task.
2. `ex`: an estimate for the maximum time (in msecs) required to perform
   this task.  
   Usefull for cases in which there is some I/O error, and the associated
   task event handler is never called. Then the task is automatically
   discarded, eventhough we did not properly inform 'Moderate' of its
   completion with `del`.

#### active

    moderate.active(function(NumOfActiveTasks) {
        // decide if to continue with your task
        // based on the current number of active
        // tasks.
    });

`active` receives a callback function as a parameter, and sends it
the number of currently active tasks. The callback function then should
decide, based upon that number, if to continue with the task.

#### del

    moderate.del(mem);

`del` signals 'Moderate' that the task member `mem` is no longer active.