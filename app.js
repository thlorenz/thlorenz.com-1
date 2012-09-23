#!/usr/bin/env node

var path       =  require('path')
  , fs         =  require('fs')
  , util       =  require('util')
  , http       =  require('http')
  , director   =  require('director')
  , handlebars =  require('handlebars')
  , hotplates  =  require('hotplates')
  , log        =  require('npmlog')
  , runnel     =  require('runnel')
  , routes     =  require('./routes')
  , config     =  require('./config')
  , blog       =  require('./blog')
  , styles     =  require('./styles')
  , requirejs  =  require('./requirejs') 

  , PORT    =  process.env.PORT || 3000
  , envName =  process.argv[2] || 'prod'
  , optcss  =  process.argv.indexOf('optcss') > 0
  , optjs   =  process.argv.indexOf('optjs') > 0
  ;

// Environments: debug, dev, prod
config.setEnv({ name: envName, forceOptimizeCss: optcss, forceOptimizeJs: optjs });

log.level = config().logLevel;
log.addLevel('verbose', 1000, { fg: 'blue' }, 'verb');
log.addLevel('silly', -Infinity, { fg: 'grey' }, 'sill');

function serveSite() {

  var router = new director.http.Router({
      '/'                         :  { get  :  routes.root.get          }
    , '/favicon.ico'              :  { get  :  routes.images.getfavicon }
    , '/css/:file'                :  { get  :  routes.css.get           }
    , '/images/:file'             :  { get  :  routes.images.get        }
    , '/js/:file'                 :  { get  :  routes.js.get            }
    , '/js/:dir/:file'            :  { get  :  routes.js.getFrom        }
    , '/github/index'             :  { get  :  routes.github.get        }
    , '/github/repo/:name'        :  { get  :  routes.github.getRepo    }
    , '/blog/index'               :  { get  :  routes.blog.get          }
    , '/blog/post/:post'          :  { get  :  routes.blog.getPost      }
    , '/assets/images/:file'      :  { get  :  routes.images.getForPost }

    , '/blog/assets/images/:file' :  { get  :  function (file) { routes.images.get(file, config().paths.blog.images); } }
    , '/blog/pushed'              :  { post :  routes.blog.pushed }
  });

  var server = http.createServer(function (req, res) {

    log.verbose('app','%s %s', req.method, req.url);
    log.silly('headers', req.headers);     

    router.dispatch(req, res, function (err) {
      if (err) {
        log.error('app', err);
        res.writeHead(404);
        res.end();
      }
    });
  });

  server.listen(PORT, function () {
    log.info('app', 'server listening on ', PORT);
  });
}

function initHotplates (initialized) {
  hotplates
    .preheat(
      { amd: true
      , handlebarsSrc: 'handlebars'
      , target: path.join(__dirname, 'static', 'js', 'handlebars-templates.js')
      }
    , function (err, data) {
        if (err) log.error(err);
        else log.verbose('app', 'precompiled templates'); 
    })
    .on('templateCompiled', function (fileInfo, name) { 
      log.verbose('app', 'compiled: \t%s as %s', fileInfo.path, name); 
    })
    .on('partialRegistered', function (fileInfo, name) { 
      log.verbose('app', 'registered:\t%s as %s', fileInfo.path, name); 
    })
    .heat(
      { templates:
        { root: config().paths.templates
        , directoryFilter: '!partials' 
        }
      , partials:
        { root: path.join(config().paths.templates, 'partials') }
      , watch: true
      }
    , initialized);
}

function initBlog (cb) {
  blog.init(function (err) {
    if (err) { cb(err); return; }
    cb(); 
  });
}

function handleError(err) {
  if (err) { 
    log.error('app', err); 
    process.exit(1);
  }
}

log.info('app', 'starting thlorenz.com');

// bring server up immediately to keep nodejitsu from complaining about slow startup
serveSite();

runnel (
    initBlog
  , initHotplates
  , styles.init
  , requirejs.init
  , handleError
);

