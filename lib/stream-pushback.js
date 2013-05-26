
"use strict"

var createPushbackStream = function(readStream, pushbackBuffers) {
  var reading = false
  var originalRead = readStream.read
  var originalCloseRead = readStream.closeRead

  var unoverrideMethods = function() {
    readStream.read = originalRead
    readStream.closeRead = originalCloseRead
  }

  readStream.read = function(callback) {
    if(reading) throw new Error(
      'read called multiple times without waiting for callback')

    if(pushbackBuffers.length == 0) {
      unoverrideMethods()
      originalRead(callback)
    } else {
      reading = true
      process.nextTick(function() {
        reading = false
        callback(null, pushbackBuffers.shift())
      })
    }
  }

  readStream.closeRead = function(err) {
    originalCloseRead(err)
    unoverrideMethods()
  }

  return readStream
}

module.exports = {
  createPushbackStream: createPushbackStream
}