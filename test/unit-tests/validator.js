/**
 * Created by shyam on 31/05/16.
 */

"use strict";

let validator = require("../../validator");

describe("Running unit tests for validator", function  () {

    describe("Validating url", function () {
        it("Should return false - [empty url]", function() {
            let options = {
            };
            var result = validator.validateOptions(options);
            expect(result).to.be.false;
        })

        it("Should return false - [url length = 0]", function() {
            let options = {
                url:''
            };
            var result = validator.validateOptions(options);
            expect(result).to.be.false;
        })

        it("Should return true - [with a url]", function() {
            let options = {
                url: "http://www.google.com"
            };
            var result = validator.validateOptions(options);
            expect(result).to.be.true;
        })
    });

    describe("Validating depth",function () {
        it("Should return false - [depth =0 ]", function() {
            let options = {
                url: "http://www.google.com",
                depth:0
            };
            var result = validator.validateOptions(options);
            expect(result).to.be.false;
        })
        it("Should return false - [depth < 0 ]", function() {
            let options = {
                url: "http://www.google.com",
                depth:-1
            };
            var result = validator.validateOptions(options);
            expect(result).to.be.false;
        })

        it("Should return false - [depth = string ]", function() {
            let options = {
                url: "http://www.google.com",
                depth:"hi"
            };
            var result = validator.validateOptions(options);
            expect(result).to.be.false;
        })

        it("Should return true - [depth = valid number ]", function() {
            let options = {
                url: "http://www.google.com",
                depth:4
            };
            var result = validator.validateOptions(options);
            expect(result).to.be.true;
        })
    })

    
});