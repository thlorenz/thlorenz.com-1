var config     =  require('./config')
  , fs         =  require('fs')
  , path       =  require('path')
  , exec       =  require('child_process').exec
  , log        =  require('npmlog')
  , runnel     =  require('runnel')
  , provider   =  require('dog').provider
  , styles     =  require('./styles')
  , exists     =  fs.exists || path.exists
  , root       =  config().paths.blog.root
  , lastUpdate
  , postsNames
  , posts
  , firstPost
  ;

function gitClone (cb) {
  log.info('blog', 'git clone', 'started');

  fs.exists(root, function (exists) {
    if (exists) { cb(); return; }

    exec('git clone git://github.com/thlorenz/thlorenz.com-blog.git', function (err, res) {
      if (err) { log.error('blog', 'git clone', err); cb(err); return; }
      
      log.info('blog', 'git clone', res); 
      cb();
    });
  });
}

function gitPull (cb) {
  log.info('blog', 'git pull', 'started');

  exec('cd ' + root + ' && git pull origin master', function (err, res) {
    if (err) { log.error('blog', 'git pull', err); cb(err); return; }
    
    log.info('blog', 'git pull', res); 
    cb();
  });
}

function initStyles (cb) {
  log.info('blog', 'init styles', 'started');
  provider.concatenateStyles(function (err, css) {
    if (err) { log.error('blog', 'init styles',  err); return cb(err); }

    styles.loadCss(css, 'blog.css', cb);
  });
}

function handlePostUpdate (metadata) {
    metadata.forEach(function (meta) {
      postsNames.push(meta.name);
      posts[meta.name] = meta;
      log.verbose('blog', 'Providing: %s\n', meta.name, meta.metadata);
    });

    log.info('blog', 'updated posts, now have:', postsNames);

    // TODO: get newest post here (e.g., sort by date first)
    firstPost = metadata[0];
    lastUpdate = new Date();
}

function initPosts (cb) {
  log.info('blog', 'init posts', 'started');

  posts = {};
  postsNames = [];
  
  provider.provideAll(function (err, metadata) {
    if (err) { log.error('blog', err); cb(err); return; }
    handlePostUpdate(metadata);
    cb();
  });
}

function updatePosts (cb) {
  log.info('blog', 'updating posts since', lastUpdate);

  provider.provideUpdatedSince(lastUpdate, function (err, metadata) {
    if (err) { log.error('blog', err); cb(err); return; }
    handlePostUpdate(metadata);
    cb();
  });
}

function syncRefresh (sync, refreshPosts, refreshed) {
  runnel(
      sync
    , initStyles
    , refreshPosts
    , refreshed
  );
}

function init (initialized) {
  provider.provideFrom(config().paths.blog.root);
  syncRefresh(gitClone, initPosts, initialized);
}

function update (updated) {
  syncRefresh(gitPull, updatePosts, updated);
}

function getMetadata () {
  return Object.keys(posts).map(function (key) { return posts[key].metadata; });
}

function getPost (postName) {
  post = (postName && posts[postName]) ? posts[postName] : firstPost;
  log.info('blog', 'returning for post: %s', post);
  return post;
}

module.exports = {
    init        :  init
  , update      :  update
  , getMetadata :  getMetadata
  , getPost     :  getPost
};

