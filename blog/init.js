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

  exec('cd ' + blogRoot + ' && git pull origin master', function (err, res) {
    if (err) { log.error('blog', 'git pull', err); cb(err); return; }
    
    log.info('blog', 'git pull', res); 
    cb();
  });
}

gitClone(gitPull.bind(null, function () { console.log('pulled'); }));
