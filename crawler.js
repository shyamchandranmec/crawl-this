/**
 * Created by shyam on 30/05/16.
 */

"use strict";
let cheerio = require("cheerio");
let request = require("request");
let s = require("string");
var urlx = require("url");
var chalk = require("chalk");

function Crawler (options) {
    this.urlRepo = new Set();
    if (!options.depth) {
        this.depth = "infinity";
    } else {
        this.depth = options.depth;
    }
    this.url = options.url;
}

Crawler.prototype.crawl = function (url, depth) {
    let self = this;
    return new Promise((resolve) => {
        if (!self._addToRepo(url)) {
            return resolve();
        }
        if (depth == 0) {
            return resolve();
        }
        return self._fetchUrlContents(url)
            .then((response) => {
                return self._findLinks(response.html, response.url);
            }).then((linksCollection) => {
                let promises = [];
                linksCollection.map(function (link) {
                    let newDepth = self._getNewDepth(self.depth, depth);
                    promises.push(self.crawl(link, newDepth))
                });
                Promise.all(promises).then(function () {
                    return resolve();
                }, function (err) {
                    resolve();
                });

            })
    });
};

/**
 * If no depth was mentioned then new depth is always 1
 * else depth is decremented for each sub crawl
 * @param initialDepth - The depth mentioned as the command line argument
 * @param currentDepth - The current value of depth in the crawl method
 * @returns {int}
 * @private
 */
Crawler.prototype._getNewDepth = function (initialDepth, currentDepth) {
    let newDepth;
    if (initialDepth === 'infinity') {
        newDepth = 1;
    } else {
        newDepth = currentDepth - 1;
    }
    return newDepth;
};

/**
 * Adds a value to the set
 * @param repo - An instance of Set
 * @param value - Value to be added to the set
 * @returns {boolean}
 * @private
 */
Crawler.prototype._addToRepo = function (value) {
    if (this.urlRepo.has(value)) {
        return false;
    } else {
        console.log(chalk.yellow(value));
        this.urlRepo.add(value);
        return true;
    }
};

/**
 * Checks if a url is valid
 * @param url
 * @returns {boolean}
 * @private
 */
Crawler.prototype._checkValidURL = function (url) {
    if (!url)
        return false;
    if (url.length == 0)
        return false;
    if (s(url).startsWith("#"))
        return false;
    if (s(url).startsWith("javascript:"))
        return false;
    if (s(url).startsWith("mailto:"))
        return false;

    return true;
};

/**
 * Joins the base url and sub part to form a full url
 * @param baseURL
 * @param link
 * @returns {*}
 * Returns all the links in the page which is inside <a href>
 * @private
 */
Crawler.prototype._createProperURL = function (baseURL, link) {
    link = urlx.resolve(baseURL, link);
    return link;
};

Crawler.prototype._findLinks = function (html, url) {
    var self = this;
    return new Promise((resolve, reject) => {
        let $ = cheerio.load(html);
        let links = [];
        $("a").each(function (index, element) {
            let link = $(element).attr("href");
            if (self._checkValidURL(link)) {
                link = self._createProperURL(url, link);
                links.push(link);
            }
        });
        return resolve(links);
    });
};

/**
 * Fetches the content of the url
 * @param url
 * @returns {Promise} -
 * Promise resolves an object with values url and html;
 * url will always be present
 * If fetch was successful html is set to the content of the page
 * else html is set to empty string
 * @private
 */
Crawler.prototype._fetchUrlContents = function (url) {
    var self = this;
    return new Promise((resolve, reject) => {
        let response = {
            url: url
        };
        request({method: 'GET', uri: url, timeout: 10000}, function (err, res, html) {
            if (!err) {
                if (res.statusCode == 200) {
                    response.html = html;
                    return resolve(response);
                } else {
                    console.log(chalk.red("Skipping url ", url, " :Response status:", res.statusCode));
                    response.html = "";
                }
            } else {
                console.log(chalk.red("Error fetching url :", url, "-", err.message));
                response.html = "";
                /**
                 * Remove from the repo if its an invalid url
                 */
                if(s(err.message).startsWith("Invalid URI")) {
                    self.urlRepo.delete(url);
                }
                return resolve(response)
            }
        })
    })
};


module.exports = Crawler;
