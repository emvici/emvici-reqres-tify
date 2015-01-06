/**
* Initialization middleware, exposing the
* request and response to eachother, as well
* as defaulting the X-Powered-By header field.
*
* @param {Function} app
* @return {Function}
* @api private
*/

var Util = require( 'findhit-util' ),
    Request = require( './request' ),
    Response = require( './response' );

var ReqResIfy = module.exports = function ReqResIfy( options ) {

    this.options = Util.is.Object( options ) ? Util.extend( {}, options ) : {};

    // Create prototypes
    this.Request = { __proto__: Request, reqresify: this },
    this.Response = { __proto__: Response, reqresify: this };

};

ReqResIfy.prototype.handle = function ( req, res, next ) {

    // Expose them to each other
    req.res = res;
    res.req = req;

    // Apply this instance protos
    req.__proto__ = this.Request;
    res.__proto__ = this.Response;

    // Go go go ...
    next();

};
