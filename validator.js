/**
 * Created by shyam on 30/05/16.
 */

"use strict";

exports.validateOptions = function (options) {
    /**
     * Depth is optional
     */
    if (options.depth) {
        if (isNaN(parseInt(options.depth)))
            return true;

        if (options.depth <= 0)
            return true;
    }
    /**
     * URL is mandatory
     */
    if(!options.url)
        return true;
    if(options.url.length == 0)
        return true;
};  
