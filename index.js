var EventEmitter = require('events').EventEmitter;
var inherits = require('util').inherits;
var timestamp = require('monotonic-timestamp');
var through = require('through');
var Writable = require('stream').Writable;
var Readable = require('stream').Readable;

module.exports = enstore;

function enstore () {
  if (!(this instanceof enstore)) return new enstore();

  EventEmitter.call(this);

  this.store = [];
  this.ended = false;
}

inherits(enstore, EventEmitter);

enstore.prototype.createWriteStream = function (opts) {
  var self = this;
  var w = Writable(opts);
  w._write = function(chunk, _, done){
    chunk = {
      ts : timestamp(),
      chunk : chunk
    }
    self.store.push(chunk);
    self.emit('chunk', chunk);
    done();
  };
  w.on('finish', function(){
    self.ended = true;
    self.emit('end');
  });
  return w;
}

enstore.prototype.createReadStream = function (opts) {
  var self = this;
  var idx = 0;
  var r = Readable(opts);
  r._read = function(n){
    if (self.store[idx]) return r.push(self.store[idx++].chunk);
    if (self.ended) return r.push(null);

    var onchunk = function(chunk){
      self.removeListener('end', onend);
      idx++;
      r.push(chunk.chunk);
    }
    self.once('chunk', onchunk);

    var onend = function(){
      self.removeListener('chunk', onchunk);
      r.push(null);
    };
    self.once('end', onend);
  };
  return r;
}
