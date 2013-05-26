
"use strict"

var createPushbackStream = function(originalReadStream, pushbackBuffers) {
  var readStream = Object.create(originalReadStream)

  var reading = false
  var unoverrideMethods = function() {
    delete readStream.read
    delete readStream.closeRead
  }

  readStream.read = function(callback) {
    if(reading) throw new Error(
      'read called multiple times without waiting for callback')

    if(pushbackBuffers.length == 0) {
      unoverrideMethods()
      originalReadStream.read(callback)
    } else {
      reading = true
      process.nextTick(function() {
        reading = false
        callback(null, pushbackBuffers.shift())
      })
    }
  }

  readStream.closeRead = function(err) {
    originalReadStream.closeRead(err)
    unoverrideMethods()
  }

  return readStream
}

module.exports = {
  createPushbackStream: createPushbackStream
}