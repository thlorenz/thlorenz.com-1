'use strict';

var browserify =  require('browserify')
  , shim       =  require('browserify-shim')
  , uglify     =  require('uglify-js')
  , log        =  require('npmlog')
  , optimizer  =  uglify.uglify
  ;

function minify(code) {
  var compressor = uglify.Compressor()
    , ast = uglify.parse(code);

  ast.figure_out_scope();
  ast.mangle_names();
  return ast.transform(compressor).print_to_string();
}

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

var createBundle = module.exports = function (debug, cb) {
  var inst = browserify();
  inst.transform(addSourceMaps);

  shim(inst, {
      jquery: { path: './public/js/jquery-1.8.1.min.js', exports: '$' }
  })
  .require(require.resolve('./public/js/navigation.js'), { entry: true })
  .bundle(function (err, src) {
    if (err) log.error('build', err);
    var bundled = debug ? src : minify(src);
    cb(err, src);
  });

};

if (module.parent) return;

// execute the below only when run from the command line
var path = require('path')
  , fs = require('fs')
  , bundlePath = path.join(__dirname, 'public', 'js', 'build', 'bundle.js');

createBundle(false, function (err, bundled) {
  if (err) return;
  fs.writeFileSync(bundlePath, bundled, 'utf-8');
});
