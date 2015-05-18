var connect = require( 'connect' ),
    reqrestify = require( '../' ),
    Router = require( 'emvici-router' );

module.exports = function ( opts ) {
    var app = connect(),
        router = app._router = Router({
            throw404: false,
        });

    app.Router = Router;
    app.router = router;
    app.reqrestify = reqrestify( opts );

    for( var i in app.reqrestify ) {
      var method = app.reqrestify[ i ];

      if (
        typeof method !== 'function' ||
        [ 'handle' ].indexOf( i ) !== -1
      ) {
        continue;
      }

      app[ i ] = method.bind( app.reqrestify );
    };

    app.use( app.reqrestify );
    app.use( app.router );

    return app;
};
