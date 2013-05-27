
"use strict"

var streamPushback = require('../lib/stream-pushback')
var should = require('should')
var streamConvert = require('quiver-stream-convert')


describe('stream pushback test', function() {
  it('should emit pushed back buffers first', function(callback) {
    var testBuffers = ['foo', 'bar']
    var pushbackBuffers = ['before1', 'before2']

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

  it('nested stream pushback test', function(callback) {
    var testBuffers = ['sixth', 'seventh']
    var readStream = streamConvert.buffersToStream(testBuffers)

    readStream = streamPushback.pushbackStream(readStream, ['fourth', 'fifth'])
    readStream = streamPushback.pushbackStream(readStream, ['third'])
    readStream = streamPushback.pushbackStream(readStream, ['first', 'second'])

    streamConvert.streamToBuffers(readStream, function(err, buffers) {
      if(err) throw err

      buffers.length.should.equal(7)
      buffers[0].should.equal('first')
      buffers[1].should.equal('second')
      buffers[2].should.equal('third')
      buffers[3].should.equal('fourth')
      buffers[4].should.equal('fifth')
      buffers[5].should.equal('sixth')
      buffers[6].should.equal('seventh')

      callback()
    })
  })
})