var enstore = require('..');
var through = require('through');
var test = require('tape');

test('enstore', function (t) {
  t.plan(12);

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
    var rs = store.createReadStream();
    rs.on('end', function () {
      t.ok(true, name + ' ended');
    });
    rs.pipe(through(function (chunk) {
      t.equal(chunk, i++, name + ' chunk');
    }));
  }
});

