var EventEmitter = require('events').EventEmitter;
var inherits = require('util').inherits;
var through = require('through');
var timestamp = require('monotonic-timestamp');

module.exports = enstore;

function enstore () {
  if (!(this instanceof enstore)) return new enstore();

  EventEmitter.call(this);

  this.store = [];
  this.ended = false;
}

inherits(enstore, EventEmitter);

enstore.prototype.createWriteStream = function () {
  var self = this;

  return through(write, end);

  function write (chunk) {
    chunk = {
      ts : timestamp(),
      chunk : chunk
    }
    self.store.push(chunk);
    self.emit('chunk', chunk);
  }

  function end () {
    self.ended = true;
    self.emit('end');
  }
}

enstore.prototype.createReadStream = function () {
  var self = this;
  var lastChunkAt = null;

  var tr = through();
  var end = tr.end.bind(tr);
  function write (chunk) {
    tr.write(chunk.chunk);
  }
  
  setTimeout(function () {
    self.store.forEach(write);
    self.on('chunk', write);
    self.once('end', end);
    if (self.end) tr.end();
  });

  tr.once('end', function () {
    self.removeListener('chunk', write);
    self.removeListener('end', end);
  })

  return tr;
}
