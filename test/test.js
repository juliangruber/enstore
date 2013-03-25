var enstore = require('..');
var through = require('through');
var test = require('tap').test;

test('enstore', function (t) {
  t.plan(9);

  var store = enstore();
  read('initial');

  var src = through();
  src.pipe(store.createWriteStream());

  var i = 0;
  (function write () {
    src.write(i++);

    if (i == 2) {
      read('streaming');
    }
    
    if (i == 3) {
      src.end();
      return read('after');
    }

    setTimeout(write, 1);
  })();

  function read (name) {
    var i = 0;
    store.createReadStream().pipe(through(function (chunk) {
      t.equal(chunk, i++, name);
    }));
  }
});

