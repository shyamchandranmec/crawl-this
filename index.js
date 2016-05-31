#!/usr/bin/env node
/**
 * Created by shyam on 30/05/16.
 */

"use strict";
let program = require('commander');
let validator = require("./validator");
let Crawler = require("./crawler");
let urlx = require("url");
let chalk = require("chalk");

let url =  null;
let crawler = null;

program.version('0.1.0')
    .option('-d, --depth <depth>', 'Depth to search. Should be a number')
    .arguments('<url>')
    .action(function(urlParam) {
        url =  urlParam;
    })
    .parse(process.argv);

function init () {
    var options = {
        depth: program.depth,
        url: url
    };

    if (validator.validateOptions(options)) {
        /**
         * Print help if input is not valid
         */
        program.outputHelp();
        process.exit(-1)
    } else {
        /**
         * If depth is not mentioned the crawler continues until the process is killed
         */
        if(!options.depth) {
            options.depth =  "infinity";
        }
        crawler = new Crawler(options);
        crawler.crawl(options.url, options.depth).then(() => {
            exit(0);
        });

    }
    
    process.on("exit", function(code) {
        if(code != -1) {
            onFinish();
        }
    });

    process.on("SIGINT", function() {
        process.exit(2);
    })
}

function onFinish() {
    console.log(chalk.green(crawler.urlRepo.size +" Result(s) found"));
    process.exit();
}

init();


