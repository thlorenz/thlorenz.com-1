var path       =  require('path')
  , fs         =  require('fs')
  , util       =  require('util')
  , http       =  require('http')
  , director   =  require('director')
  , handlebars =  require('handlebars')
  , hotplates  =  require('hotplates')
  , log        =  require('npmlog')
  , routes     =  require('./routes')
  , config     =  require('./config')
  , blog       =  require('./blog')
  , PORT       =  process.env.PORT || 3000
  ;


config.setEnv({ 
    devEnvironment: 'dev' 
//   , loglevel: 'silly'
});

log.level = config().logLevel;
log.addLevel('verbose', 1000, { fg: 'blue' }, 'verb');
log.addLevel('silly', -Infinity, { fg: 'grey' }, 'sill');

function serveSite() {

  var router = new director.http.Router({
      '/'                 :  { get :  routes.root.get          }
    , '/favicon.ico'      :  { get :  routes.images.getfavicon }
    , '/css/:file'        :  { get :  routes.css.get           }
    , '/images/:file'     :  { get :  routes.images.get        }
    , '/js/:file'         :  { get :  routes.js.get            }
    , '/js/:dir/:file'    :  { get :  routes.js.getFrom        }
    , '/github/index'     :  { get :  routes.github.get        }
    , '/github/repo/:name':  { get :  routes.github.getRepo    }
    , '/blog/index'       :  { get :  routes.blog.get          }
    , '/blog/post/:post'  :  { get :  routes.blog.getPost      }

    , '/blog/assets/images/:file': { get: function (file) { routes.images.get(file, config().paths.blog.images); } }
    , '/blog/pushed'      :  { post: routes.blog.pushed }
  });

  var server = http.createServer(function (req, res) {

    log.info('app','%s %s', req.method, req.url);
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

initBlog(function (err) {
  if (err) { log.error('app', err); return; }
  log.info('app', 'blog initialized');

  initHotplates(serveSite);
});
