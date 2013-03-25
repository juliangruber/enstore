# enstore

In-memory persistence for streams. Enables you to replay streams, even if they're not finished yet.

*Need real persistence? Check out [level-store](https://github.com/juliangruber/level-store) for a fast and flexible
streaming storage engine based on LevelDB.*

## Usage

```js
var enstore = require('enstore');

// create a new store
var store = enstore();

// store a someStream in it
someStream.pipe(store.createWriteStream());

// pipe everything someStream emitted to someWhereElse
// doesn't matter if someStream already finished
store.createWriteStream().pipe(someWhereElse);
```

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

## License

(MIT)
