/**
 * This is an example for a web crawler, which, given a list of urls, saves
 * the code of each of the corresponding pages. It is an example for a
 * repetitive task (can have millions of pages) which can be very I/O
 * intensive.
 *
 * The task at hand is I/O bound (limited network bandwidth and speed).
 * Each I/O task is associated with a callback function to handle the
 * received data (the I/O event handler).
 * We can't just send requests to an unlimited number of pages, as that
 * would overload the network and possibly create too many events to be
 * handled by the event loop.
 *
 * So we have to limit the number of cuncurent page crawls.
 *
 * We could, alternatively, just crawl one page at a time, but that would be
 * to inefficient.
 *
 * We use 'Moderate' to control the number of concurent I/O tasks;
 * In this example - crawling web pages.
 *
 * More on the subject of I/O event handling:
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/EventLoop
 */

var request = require('request');
var moderate = require('../'); //require moderate (package in parent dir)

var limit = 100; // Number of concurent page requests.
var ttl = (60 * 1000); // If a URL is not crawled within 60 secs, discard it.
var urls = ['http://www.google.com']; // A (theoretically) huge pool of urls.
var interval = 3000; // check for new urls in 'urls' every n msec.
var timeout = 5000; //HTTP request timeout

function run() {

    /**
     * Call 'process' every 'interval' msecs.
     * New urls might be added to the 'urls' pool, so we need to
     * process it periodically.
     */

    process();

    setTimeout(function() {

        run();

    }, interval);

}

function process() {

    /**
     * Process new urls from the 'urls' pool.
     * With 'Moderate' we can ensure we only process new urls if we do not
     * exceed the limit of active I/O tasks (HTTP requests).
     */

    moderate.active(function(numOfActiveTasks) {

        // moderate.active calls this anonymous function with the number
        // of currently active tasks as a parameter.
        // We can use it to control the number of tasks we process
        // concurently.

        if (numOfActiveTasks < limit) {

            // get the next url to process from the pool:
            var url = urls.pop();

            if (url) {

                // inform moderate of a new active task associated with this
                // url. also provide a ttl as an estimate for the maximum time
                // required to perform this task. the ttl is usefull for cases
                // in which there is some I/O error, and the associated task
                // event handler is never called. Then the task it automatically
                // discarded, eventhough we did not properly inform 'Moderate'
                // of its completion.
                moderate.add({
                    mem: url, // task member
                    ex: ttl // expiry time
                });

                // recursively add tasks until the limit of active members
                // is reached.
                process();

                // perform the current I/O task - send an HTTP request for
                // the current url.
                request({

                    uri: url,
                    timeout: timeout

                }, function(err, res, body) {

                    // when the I/O is done, handle the result with this
                    // callback.
                    console.log(body);

                    // after the result data was processed inform moderate the
                    // task is completed by calling the 'del' method.
                    // If for some reason this never gets called the task will
                    // expire eventuall based on the ttl passed when added.
                    moderate.del(url);

                });

            }

        }

    });

};

run();