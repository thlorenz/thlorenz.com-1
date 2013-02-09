'use strict';

var path    =  require('path')
  , express =  require('express')
  , hbs     =  require('hbs')
  , log     =  require('npmlog')
  , build   =  require('./build')
  , app     =  express()
  , PORT    =  3000;

app
  .set('view engine', 'hbs')
  .set('views', path.join(__dirname, 'views'))
  ;

app
  .get('/', function (req, res) {
    res.render('index');
  })
  .get('/public/js/build/bundle.js', function (req, res) {
    // TODO: useful for development, but before going to prod, we need to implement a caching strategy here
    var bundle = build(true);
    res.set('Content-Type', 'application/javascript');
    res.send(200, bundle);
  })
  // Fall back to static file server only after all our custom matches failed
  .use(express.static(path.join(__dirname, 'public')))
  ;

app.listen(PORT);
log.info('server', 'listening on ', PORT);
