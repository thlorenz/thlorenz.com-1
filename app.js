'use strict';

var path    =  require('path') 
  , express =  require('express')
  , hbs     =  require('hbs')
  , log     =  require('npmlog')
  , app     =  express()
  , PORT    =  3000;

app
  .set('view engine', 'hbs')
  .set('views', path.join(__dirname, 'views'))
  .use(express.static(path.join(__dirname, 'public')))
  ;

app.get('/', function (req, res) {
  res.render('index');
});

app.listen(PORT);
log.info('server', 'listening on ', PORT);
