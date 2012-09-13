var config     =  require('./config')
  , fs         =  require('fs')
  , exec       =  require('child_process').exec
  , log        =  require('npmlog')
  , provider   =  require('dog').provider
  , root       =  config().paths.blog.root
  , postsNames
  , posts
  , firstPost
  ;

function init(initialized) {
  provider.provideFrom(config().paths.blog.root);

  gitPull();

  function gitPull () {
    log.info('blog', 'git pull', 'started');

    exec('cd ' + root + ' && git pull origin master', function (err, res) {
      if (err) { log.error('blog', 'git pull', err); initialized(err); return; }
      
      log.info('blog', 'git pull', res); 
      initStyles();
    });
  }

  function initStyles () {
    log.info('blog', 'init styles', 'started');
    provider.concatenateStyles(function (err, css) {

      if (err) { log.error('blog', 'init styles',  err); initialized(err); return; }

      fs.writeFile(config().paths.blog.blog_css, css, 'utf8', function (err) {
        if (err) { log.error('blog', 'init styles',  err); initialized(err); return; }
        log.info('blog', 'initialized styles');

        initPosts();
      });
    });
  }

  function initPosts () {
    log.info('blog', 'init posts', 'started');

    provider.getAllPosts(function (err, postnames) {
      if (err) { log.error('blog-server', err); }
      postsNames = postnames;
      
      provider.provideAll(function (err, metadata) {
        if (err) { log.error('blog', err); initialized(err); return; }
        posts = {};

        metadata.forEach(function (meta) {
          posts[meta.name] = meta;
          log.verbose('blog', 'Providing: %s\n', meta.name, meta.metadata);
        });
        log.info('blog', 'initialized posts', postsNames);

        // TODO: get newest post here (e.g., sort by date first)
        firstPost = metadata[0];
        log.verbose('blog', 'first post is %s', firstPost.name);

        initialized();
      });
    });
  }
}

function getMetadata () {
  return Object.keys(posts)
    .map(function (key) {
      return posts[key].metadata;
    });
}

function getPost (postName) {
  post = (postName && posts[postName]) ? posts[postName] : firstPost;
  log.info('blog', 'returning for post: %s', post);
  return post;
}

module.exports = {
    init        :  init
  , getMetadata :  getMetadata
  , getPost     :  getPost
};

