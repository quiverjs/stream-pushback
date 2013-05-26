
"use strict"

var streamPushback = require('../lib/stream-pushback')
var should = require('should')
var streamConvert = require('quiver-stream-convert')

var testBuffers = ['foo', 'bar']
var pushbackBuffers = ['before1', 'before2']

describe('stream pushback test', function() {
  it('should emit pushed back buffers first', function(callback) {
    var readStream = streamConvert.buffersToStream(testBuffers)
    var pushbackStream = streamPushback.pushbackStream(readStream, pushbackBuffers)
    streamConvert.streamToBuffers(pushbackStream, function(err, buffers) {
      if(err) throw err

      buffers.length.should.equal(4)
      buffers[0].should.equal('before1')
      buffers[1].should.equal('before2')
      buffers[2].should.equal('foo')
      buffers[3].should.equal('bar')

      callback()
    })
  })
})