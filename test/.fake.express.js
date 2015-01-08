var connect = require( 'connect' ),
    reqrestify = require( '../' ),
    Router = require( 'emvici-router' );

module.exports = function () {
    var app = connect(),
        router = app._router = Router({
            throw404: false,
        });

    app.Router = Router;
    app.use( reqrestify() );
    app.use( router );

    return app;
};
