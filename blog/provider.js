'use strict';

var fs         =  require('fs')
  , path       =  require('path')
  , exec       =  require('child_process').exec
  , log        =  require('npmlog')
  , provider   =  require('dog').provider
  , exists     =  fs.exists || path.exists
  , root       =  path.join(__dirname, '..')
  , blogRoot   =  path.join(root, 'thlorenz.com-blog')
  , lastUpdate
  , postsNames
  , posts
  , firstPost
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

  fs.exists(blogRoot, function (exists) {
    if (exists) { cb(); return; }

    log.info('blog', 'git clone', 'started');
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

function lastCreatedPost() {
  var record = new Date(0)
    , lastCreated = null;

  Object.keys(posts).forEach(function (k) {
    var post = posts[k]
      , d = new Date(post.metadata.created);
    if (d > record) {
      record = d;
      lastCreated = post;
    }
  });

  return lastCreated;
}

function handlePostUpdate (metadata) {
    metadata.forEach(function (meta) {
      postsNames.push(meta.name);
      posts[meta.name] = meta;
      log.verbose('blog', 'Providing: %s\n', meta.name, meta.metadata);
    });

    log.info('blog', 'updated posts, now have:', postsNames);

    firstPost = lastCreatedPost(); 
    lastUpdate = new Date();
}

function initPosts (cb) {
  log.info('blog', 'init posts', 'started');

  posts = {};
  postsNames = [];
  
  provider.provideAll(function (err, metadata) {
    if (err) { log.error('blog', err); return cb(err); }
    handlePostUpdate(metadata);
    cb();
  });
}

function updatePosts (cb) {
  log.info('blog', 'updating posts since', lastUpdate);

  provider.provideUpdatedSince(lastUpdate, function (err, metadata) {
    if (err) { log.error('blog', err); return cb(err); }
    handlePostUpdate(metadata);
    cb();
  });
}

exports.update = function (cb) {

  gitPull(function (err) {
    if (err) return cb(err);
    // don't copy styles if we already updated the blog before
    if (lastUpdate) return updateBlogPosts();

    provider
      .provideFrom(blogRoot)
      .getStylesFiles(function (err, styles) {
        copyStyles(styles, updateBlogPosts);
      });
  });

  function updateBlogPosts(err) {
    if (err) return cb(err);
    (lastUpdate ? updatePosts : initPosts)(cb);
  }
};

exports.getMetadata = function () {
  return Object.keys(posts).map(function (key) { return posts[key].metadata; });
};

exports.getPost = function (postName) {
  var post = (postName && posts[postName]) ? posts[postName] : firstPost;
  log.info('blog', 'returning for post: %s', post);
  return post;
};
