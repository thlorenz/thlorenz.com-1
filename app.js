var path       =  require('path')
  , util = require('util')
  , http       =  require('http')
  , director   =  require('director')
  , handlebars =  require('handlebars')
  , hotplates  =  require('hotplates')
  , log        =  require('npmlog')
  , routes     =  require('./routes')
  , config     =  require('./config')
  ;

config.setEnv({ devEnvironment: 'dev' });
log.level = config().logLevel;
log.addLevel('verbose', 1000, { fg: 'blue' }, 'verb');
log.addLevel('silly', -Infinity, { fg: 'grey' }, 'sill');

function serveSite() {
  var router = new director.http.Router({
      '/'            :  { get :  routes.root.get          }
    , '/favicon.ico' :  { get :  routes.images.getfavicon }
    , '/css/:file'   :  { get :  routes.css.get           }
    , '/images/:file':  { get :  routes.images.get        }
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

  server.listen(3000, function () {
    log.info('app', 'server listening on ', 3000);
  });
}

hotplates
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
  , serveSite);

