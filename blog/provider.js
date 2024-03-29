'use strict';

var fs         =  require('fs')
  , path       =  require('path')
  , exec       =  require('child_process').exec
  , log        =  require('npmlog')
  , provider   =  require('dog').provider
  , CleanCSS   =  require('clean-css')
  , config     =  require('../config')
  , rssFeed    =  require('./rss-feed')
  , exists     =  fs.exists || path.exists
  , root       =  path.join(__dirname, '..')
  , blogRoot   =  path.join(root, 'thlorenz.com-blog')
  , blogStyles =  path.join(root, 'public', 'css', 'blog')
  , lastUpdate
  , postsNames
  , posts
  , postsMetadataSortedByCurrentness
  , firstPost
  , blogStyles
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

// TODO: styles stuff into separate module
function concatenateStyles (cb) {
  log.info('blog', 'init styles', 'started');
  provider.concatenateStyles(function (err, css) {
    if (err) { log.error('blog', 'init styles',  err); return cb(err); }
    cb(null, css);
  });
}

function copyStyles(styles, cb) {
  var tasks = styles.length
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

function initStyles (cb) {
  if (config.mode === 'dev') {
    return provider.getStylesFiles(function (err, styles) {
      if (err) return cb(err);
      copyStyles(styles, cb);
      });
  }

  // production mode
  concatenateStyles(function (err, css) {
    if (err) return cb(err);
    try {
      var minifiedCss = CleanCSS.process(css);
      fs.writeFile(path.join(blogStyles, 'blog.min.css'), minifiedCss, 'utf-8', function (err) {
        if (err) return cb(err);
        cb();
      });
      cb(null);
    } catch (e) {
      cb(e);
    }
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

function postsMetadata () {
  return Object.keys(posts)
    .map(function (key) { return posts[key].metadata; });
}

function getMetadataSortedByCurrentness() {
  function byCurrentness (a, b) { 
    return new Date(a.created) > new Date(b.created) ? -1 : 1; 
  }
  return postsMetadata().sort(byCurrentness);
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
    postsMetadataSortedByCurrentness = getMetadataSortedByCurrentness();
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

var update = exports.update = function (cb) {

  gitPull(function (err) {
    if (err) return cb(err);
    // don't copy styles if we already updated the blog before
    if (lastUpdate) return updateBlogPosts();

    provider.provideFrom(blogRoot);
    initStyles(updateBlogPosts);
  });

  function updateBlogPosts(err) {
    if (err) return cb(err);
    (lastUpdate ? updatePosts : initPosts)(cb);
  }
};

var getMetadata = exports.getMetadata = function (cb) {
  if (postsMetadataSortedByCurrentness) return cb(null, postsMetadataSortedByCurrentness);

  update(function (err) {
    cb(err, postsMetadataSortedByCurrentness);
  });
};

exports.getPost = function (postName) {
  // Assumes that getMetadata was called before and thus blog was initialized
  var post = (postName && posts[postName]) ? posts[postName] : firstPost;
  log.verbose('blog', 'returning for post: %s', postName);
  return post;
};

exports.getRssFeed = function (cb) {
  function feedPosts() {
    var postsArr = Object.keys(posts).map(function (k) { return posts[k]; });
    cb(rssFeed(postsArr));
  }

  // TODO: discovered here that dog's updated since seems to never return
  if (postsMetadataSortedByCurrentness) return feedPosts();

  // ensure that blog is initialized before accessing posts
  update(function (err) {
    if (err) {
      log.error('blog', 'updating blog when getting rss feed - returning empty feed', err);
      return cb(rssFeed([]));
    }
    if (!posts) {
      log.warn('blog', 'no posts after updating blog - returning empty feed');
      return cb(rssFeed([]));
    }
    feedPosts();
  });  
};
