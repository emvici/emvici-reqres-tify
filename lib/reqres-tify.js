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
    Response = require( './response' ),

    debug = require( 'debug' )( 'emvici-reqres-tify' );

var ReqResTify = module.exports = function ReqResTify( settings ) {

    this.settings = Util.is.Object( settings ) ? Util.extend( {}, defaultSettings, settings ) : {};

    // Create prototypes
    this.Request = { __proto__: Request, reqrestify: this },
    this.Response = { __proto__: Response, reqrestify: this };

    // setup locals
    this.locals = Object.create( null );

    return this;
};

ReqResTify.defaultSettings = {
    'trust proxy': false,

};

ReqResTify.prototype.handle = function ( req, res, next ) {

    // Expose them to each other
    req.res = res;
    res.req = req;

    // pass next to req
    req.next = next;

    // Apply this instance protos
    req.__proto__ = this.Request;
    res.__proto__ = this.Response;

    // Setup locals on res
    res.locals = res.locals || Object.create( this.locals );

    // Go go go ...
    next();

};

/* Settings */

ReqResTify.prototype.get = function ( setting ) {
    return this.settings[setting];
}

/**
* Assign `setting` to `val`, or return `setting`'s value.
*
*    app.set('foo', 'bar');
*    app.get('foo');
*    // => "bar"
*
* Mounted servers inherit their parent server's settings.
*
* @param {String} setting
* @param {*} [val]
* @return {Server} for chaining
* @api public
*/

ReqResTify.prototype.set = function ( setting, val ) {
    // set value
    this.settings[setting] = val;

    // trigger matched settings
    switch (setting) {
        case 'etag':
            debug('compile etag %s', val);
            this.set('etag fn', compileETag(val));
        break;
        case 'query parser':
            debug('compile query parser %s', val);
            this.set('query parser fn', compileQueryParser(val));
        break;
        case 'trust proxy':
            debug('compile trust proxy %s', val);
            this.set('trust proxy fn', compileTrust(val));
        break;
    }

    return this;
};
