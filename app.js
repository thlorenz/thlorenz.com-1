'use strict';

var path    =  require('path')
  , express =  require('express')
  , hbs     =  require('hbs')
  , log     =  require('npmlog')
  , app     =  express()
  , PORT    =  3000;

require('./views/init')();

app
  .set('view engine', 'hbs')
  .set('views', path.join(__dirname, 'views'))
  ;

require('./routes/index')(app);
require('./routes/bundle')(app);

// Fall back to static file server only after all our custom matches failed
app.use(express.static(path.join(__dirname, 'public')));

var server = app.listen(PORT);
log.info('server', 'listening on', server.address());
