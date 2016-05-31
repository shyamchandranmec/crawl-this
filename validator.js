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
            return false;
        if (options.depth <= 0)
            return false;
    } else if (options.depth == 0)
        return false;
    


    /**
     * URL is mandatory
     */
    if (!options.url)
        return false;
    if (options.url.length == 0)
        return false;

    return true;
};  
