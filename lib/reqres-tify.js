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

    compileTrust = require('./utils').compileTrust,
    compileQueryParser = require('./utils').compileQueryParser,
    compileETag = require('./utils').compileETag,

    debug = require( 'debug' )( 'emvici-reqres-tify' );

var ReqResTify = module.exports = function ReqResTify( settings ) {
  var reqrestify = this;

  settings =
    Util.extend({}, ReqResTify.defaultSettings, Util.is.Object( settings ) ? settings : {});

  this.settings = {};

  Util.each( settings, function ( value, key ) {
    reqrestify.set( key, value );
  });

  // Create prototypes
  this.Request = Object.create( Request );
  this.Response = Object.create( Response );

  this.Request.reqrestify =
  this.Response.reqrestify =
      this;

  // setup locals
  this.locals = Object.create( null );

  return this;
};

ReqResTify.defaultSettings = {
    'trust proxy': false
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

/**
 * Check if `setting` is enabled (truthy).
 *
 *    app.enabled('foo')
 *    // => false
 *
 *    app.enable('foo')
 *    app.enabled('foo')
 *    // => true
 *
 * @param {String} setting
 * @return {Boolean}
 * @api public
 */

ReqResTify.prototype.enabled = function(setting){
  return !!this.set(setting);
};

/**
 * Check if `setting` is disabled.
 *
 *    app.disabled('foo')
 *    // => true
 *
 *    app.enable('foo')
 *    app.disabled('foo')
 *    // => false
 *
 * @param {String} setting
 * @return {Boolean}
 * @api public
 */

ReqResTify.prototype.disabled = function(setting){
  return !this.set(setting);
};

/**
 * Enable `setting`.
 *
 * @param {String} setting
 * @return {app} for chaining
 * @api public
 */

ReqResTify.prototype.enable = function(setting){
  return this.set(setting, true);
};

/**
 * Disable `setting`.
 *
 * @param {String} setting
 * @return {app} for chaining
 * @api public
 */

ReqResTify.prototype.disable = function(setting){
  return this.set(setting, false);
};

ReqResTify.prototype.get = function ( setting ) {
    return this.settings[setting];
};

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

  if ( arguments.length === 1 ) {
    return this.settings[setting];
  }

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
