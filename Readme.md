emvici-reqres-tify
==================

emvici request/response prototype applier and middleware

based on [strongloop/express](https://github.com/strongloop/express/) req and res prototypes.


## Installation

```bash
npm install --save emvici-reqres-tify
```

## Usage

### Configuring middleware

You can simply plug it as a middleware using `.use` method.

#### Connect

```js
var connect = require( 'connect' ),
    app = connect();

app.use( require( 'emvici-reqres-tify' )() );

```

#### Express

This is based on [express](https://github.com/strongloop/express/), if you use it you won't need this! :)
