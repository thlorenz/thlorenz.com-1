'use strict';

var path    =  require('path')
  , express =  require('express')
  , hbs     =  require('hbs')
  , log     =  require('npmlog')
  , config  =  require('./config')
  , app     =  express()
  , blog    =  require('./blog/provider')
  , PORT    =  3000;

log.level = config[config.mode].logLevel;

// don't log all http requests when are logging on info
log.levels.http = log.levels.info - 500;

log.info('app', 'args', process.argv);
log.info('app', 'config', config[config.mode]);

require('./views/init')();

app
  .set('view engine', 'hbs')
  .set('views', path.join(__dirname, 'views'))
  .use(express.compress())
  .use(require('./middleware/init-locals'))
  .use(require('./middleware/log-request'))
  ;

require('./routes/index')(app);
require('./routes/bundle')(app);
require('./routes/favicon')(app);
require('./routes/blog')(app);
require('./routes/projects')(app);
require('./routes/about')(app);
require('./routes/sitemap')(app);

// Fall back to static file server only after all our custom matches failed
app.use(express.static(path.join(__dirname, 'public')));



var server = app.listen(PORT);
log.info('server', 'listening on', server.address());
