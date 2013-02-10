'use strict';

var path    =  require('path')
  , express =  require('express')
  , hbs     =  require('hbs')
  , log     =  require('npmlog')
  , config  =  require('./config')
  , app     =  express()
  , PORT    =  3000;

log.level = config[config.mode].logLevel;

require('./views/init')();

app
  .set('view engine', 'hbs')
  .set('views', path.join(__dirname, 'views'))
  .use(require('./middleware/log-request'))
  ;

require('./routes/index')(app);
require('./routes/bundle')(app);
require('./routes/favicon')(app);

// Fall back to static file server only after all our custom matches failed
app.use(express.static(path.join(__dirname, 'public')));

var server = app.listen(PORT);
log.info('server', 'listening on', server.address());
