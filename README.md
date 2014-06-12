# enstore

In-memory persistence for streams. Enables you to replay streams, even if they're not finished yet.

*Need real persistence? Check out [level-store](https://github.com/juliangruber/level-store) for a fast and flexible
streaming storage engine based on LevelDB.*

[![browser support](https://ci.testling.com/juliangruber/enstore.png)](https://ci.testling.com/juliangruber/enstore)

## Usage

```js
var enstore = require('enstore');

// create a new store
var store = enstore();

// store a someStream in it
someStream.pipe(store.createWriteStream());

// pipe everything someStream emitted to someWhereElse
// doesn't matter if someStream already finished
store.createReadStream().pipe(someWhereElse);
```

## Example: Cache for browserify

This basically can be done for any streaming resource, like `fs.createReadStream()` or `request()`, that you
want to cache in memory.

```js
var http = require('http');
var browserify = require('browserify');
var enstore = require('enstore');

// fill the cache
var cache = enstore();
browserify('app.js').bundle().pipe(cache.createWriteStream());

http.createServer(function (req, res) {
  if (req.url == '/bundle.js') {
    // stream the bundle to the client
    res.writeHead(200, { 'Content-Type' : 'application/javascript' });
    store.createReadStream().pipe(res);
  }
});
```

To recreate / flush the cache just overwrite the `cache` variable with a new `enstore` instance.

## API

### enstore()

Returns a new store.

### enstore#createWriteStream()

Writable stream that stores written data in the internal store.

### enstore#createReadStream()

Readable stream that emits both what is already stored and what comes in over
`createWriteStream()` until `end` is emitted.

## Installation

With [npm](http://npmjs.org) do

```bash
$ npm install enstore
```

For the client, bundle with [browserify](https://github.com/substack/node-browserify).

## License

(MIT)
