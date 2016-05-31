/**
 * Created by shyam on 31/05/16.
 */

"use strict";

let Crawler = require("../../crawler");

describe("Testing crawler behaviours", function () {

    describe("Test crawler initialisation", function () {
        it("Depth should be infinity if not mentioned", function () {
            let options = {
                url: "http://github.com",
            };
            let crawler = new Crawler(options);
            expect(crawler.depth).to.equal("infinity");

        })

        it("Depth should be same as mentioned", function () {
            let options = {
                url: "http://github.com",
                depth: 2
            };
            let crawler = new Crawler(options);
            expect(crawler.depth).to.equal(options.depth);
        })

    })
    
    describe("Testing _getNewDepth", function () {

        it("Should return new depth [ newDepth = currentDepth -1]", function () {
            let options = {
                url: "http://github.com",
                depth: 4
            };
            let crawler = new Crawler(options);
            let currentDepth = 3;
            var result = crawler._getNewDepth(crawler.depth, currentDepth);
            expect(result).to.equal(currentDepth - 1);
        })

        it("Should always return 1 [ empty initial depth]", function () {
            let options = {
                url: "http://github.com"
            };
            let crawler = new Crawler(options);
            let currentDepth = 3;
            var result = crawler._getNewDepth(crawler.depth, currentDepth);
            expect(result).to.equal(1);
        })
        
    })

    describe("Testing _addToRepo", function () {

        it("Should return true [ Adding new value to repo]", function () {
            let options = {
                url: "http://github.com",
                depth: 4
            };
            let crawler = new Crawler(options);
            let sizeOfRepo = crawler.urlRepo.size;
            var result = crawler._addToRepo(options.url);
            expect(result).to.equal(true);
            expect(crawler.urlRepo.size).to.equal(sizeOfRepo+1);

        })

        it("Should return false [ Adding same value to repo]", function () {
            let options = {
                url: "http://github.com",
                depth: 4
            };
            let crawler = new Crawler(options);
            crawler._addToRepo(options.url);
            let sizeOfRepo = crawler.urlRepo.size;
            crawler._addToRepo(options.url);
            crawler._addToRepo(options.url);
            let result = crawler._addToRepo(options.url);
            expect(result).to.equal(false);
            expect(crawler.urlRepo.size).to.equal(sizeOfRepo);
        })
    })

    describe("Testing _checkValidURL", function () {

        it("Should return true [ valid url]", function () {
            let options = {
                url: "http://github.com",
                depth: 4
            };
            let crawler = new Crawler(options);
            var result = crawler._checkValidURL(options.url);
            expect(result).to.equal(true);
        })

        it("Should return false [ url begins with #]", function () {
            let options = {
                url: "#github.com",
                depth: 4
            };
            let crawler = new Crawler(options);
            var result = crawler._checkValidURL(options.url);
            expect(result).to.equal(false);
        })
        it("Should return false [ url with zero length]", function () {
            let options = {
                url: "",
                depth: 4
            };
            let crawler = new Crawler(options);
            var result = crawler._checkValidURL(options.url);
            expect(result).to.equal(false);
        })
        it("Should return false [ url = undefined]", function () {
            let options = {
                depth: 4
            };
            let crawler = new Crawler(options);
            var result = crawler._checkValidURL(options.url);
            expect(result).to.equal(false);
        })

        it("Should return false [ url with javascript handler]", function () {
            let options = {
                url: "javascript:void()",
                depth: 4
            };
            let crawler = new Crawler(options);
            var result = crawler._checkValidURL(options.url);
            expect(result).to.equal(false);
        })

        it("Should return false [ url with mailto handler]", function () {
            let options = {
                url: "mailto:",
                depth: 4
            };
            let crawler = new Crawler(options);
            var result = crawler._checkValidURL(options.url);
            expect(result).to.equal(false);
        })
    })
    
    describe("Testing _findLinks", function () {
        it("Should return links with same length as number of anchor tags", function (done) {
            let options = {
                url: "http://github.com",
                depth: 4
            };
            let crawler = new Crawler(options);
            let links = [
                "http://github.com",
                "http://google.com",
                "http://fb.com",
                "http://stackoverflow.com"
            ];
            var html = "<body>";
            links.map(function (link) {
                let anchorTag = `<a href = "${link}"></a>`
                html += anchorTag
            });
            html += '</body>';
            crawler._findLinks(html, options.url).then((result) => {
                expect(result.length).equal(links.length);
                done();
            })
        })
    })
    
})