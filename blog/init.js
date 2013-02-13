'use strict';

var fs         =  require('fs')
  , path       =  require('path')
  , exec       =  require('child_process').exec
  , log        =  require('npmlog')
  , provider   =  require('dog').provider
  , exists     =  fs.exists || path.exists
  , root       =  path.join(__dirname, '..')
  , blogRoot   =  path.join(root, 'thlorenz.com-blog')
  ;
/**
 * Copies srcFile to tgtFile without checking if paths are valid
 * 
 * @name copyFile
 * @function
 * @param srcFile {String}
 * @param tgtFile {String}
 * @param cb {Function} called when file is completely copied or an error occurs
 */
function copyFile(srcFile, tgtFile, cb) {
  var readStream = fs.createReadStream(srcFile)
    , writeStream = fs.createWriteStream(tgtFile); 

  writeStream
    .on('close', cb)
    .on('error', cb); 

  readStream
    .on('error', cb);

  readStream.pipe(writeStream);
}

function gitClone (cb) {
  log.info('blog', 'git clone', 'started');

  fs.exists(blogRoot, function (exists) {
    if (exists) { cb(); return; }

    exec('cd ' + root + ' && git clone git://github.com/thlorenz/thlorenz.com-blog.git', function (err, res) {
      if (err) { log.error('blog', 'git clone', err); cb(err); return; }
      
      log.info('blog', 'git clone', res); 
      cb();
    });
  });
}

function gitPull (cb) {
  log.info('blog', 'git pull', 'started');

  gitClone(function (err) {
    if (err) return cb(err);

    exec('cd ' + blogRoot + ' && git pull origin master', function (err, res) {
      if (err) { log.error('blog', 'git pull', err); cb(err); return; }
      
      log.info('blog', 'git pull', res); 
      cb();
    });
  });
}

function initStyles (cb) {
  log.info('blog', 'init styles', 'started');
  provider.concatenateStyles(function (err, css) {
    if (err) { log.error('blog', 'init styles',  err); return cb(err); }

    cb(null, css);
  });
}

function copyStyles(styles, cb) {
  var blogStyles = path.join(root, 'public', 'css', 'blog')
    , tasks = styles.length
    , abort = false;

  styles.forEach(function (style) {
    var fileName = path.basename(style);
    if (abort) return;
    copyFile(style, path.join(blogStyles, fileName), function (err, res) {
      if (abort) return;
      if (err) { abort = true; return cb(err); }
      if (!--tasks) return cb(); 
    });
  });
}

function init(cb) {

  gitPull(function (err) {
    if (err) return cb(err);

    provider
      .provideFrom(blogRoot)
      .getStylesFiles(function (err, styles) {
        copyStyles(styles, onStylesCopied);
      });
  });

  function onStylesCopied(err) {
    cb(err);
  }
}

init(function (err) { console.log('inited', err); });

