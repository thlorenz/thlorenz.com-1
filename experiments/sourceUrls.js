'use strict';

// Not properly working at this point
var through = require('through')
  , path       = require('path')
  , format = require('util').format;

function wrap(content, id) {
  return JSON.stringify(format('Function("%s\n//@ sourceURL=%s")', content, id));
}

function addSourceMaps(file) {
  var content = ''
    , id = path.basename(file);
  
  return through(
      function write(buf) {
        content += buf;
      }
    , function end() {
        var sourceMapped = wrap(content, id);

        if (id === 'navigation.js') console.log(content);
        this.queue(sourceMapped);
        this.queue(null);
      }
  );

}

