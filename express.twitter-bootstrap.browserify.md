# Installing Dependencies

## Express

`npm -S i express`

## Templating

We will use handlebars templates and in order to integrate with express:

`npm -S i hbs`

## Twitter Bootstrap

```sh
wget http://twitter.github.com/bootstrap/assets/bootstrap.zip
7z x bootstrap.zip && rm bootstrap.zip && mv bootstrap public  
cd public/js && wget http://code.jquery.com/jquery-1.8.1.min.js && cd ../..
```
We install jquery here since twitter bootstrap depends on it.

## Browserify

`npm -S i browserify`

Since we want to be able to `require` non-commonJS modules, we will need to shim them.

`npm -S i browserify-shim`

## Logger

`npm -S i npmlog`


# Building app

## Getting up and running 

### app.js

We'll serve the bundle from memory, so we add a bundle route to our app (see second app.get).

```js
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
```

### Views

`mkdir views`
`vim views/index.hbs`

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset=utf-8 />
  <title>thlorenz.com</title>
  <link rel="stylesheet" type="text/css" media="screen" href="css/bootstrap-responsive.css" />
  <link rel="stylesheet" type="text/css" media="screen" href="css/bootstrap.css" />
  <script type="text/javascript" src="public/js/build/bundle.js"></script>
</head>
<body>
  <h1>thlorenz.com</h1>
</body>
</html>
```

### build.js

Create bundle.js target folder

`mkdir public/js/build`

```js
'use strict';

var browserify =  require('browserify')
  , shim       =  require('browserify-shim')
  , bootstrap  =  'bootstrap' // use bootstrap.min in prod
  ;

var createBundle = module.exports = function (debug) {
  var bundled = browserify({ debug: debug })
    .use(shim({ alias: 'jquery', path: './public/js/jquery-1.8.1.min.js', exports: '$' }))
    .use(shim({ 
        alias   :  bootstrap
      , path    :  './public/js/' + bootstrap + '.js'
      , exports :  null
      , depends :  { jquery : '$' }
    }))
    .addEntry('./public/js/entry.js')
    .bundle()
    ;

  return bundled;
};

if (module.parent) return;

// execute the below only when run from the command line
var path = require('path')
  , fs = require('fs')
  , bundlePath = path.join(__dirname, 'public', 'js', 'build', 'bundle.js');

fs.writeFileSync(bundlePath, createBundle(true), 'utf-8');
```

### entry.js

At this point our entry file just requires bootstrap in order to initialize it.

Later on we'll add a require to any javascript file that we need in the browser, so it will be included in the bundle.

```js
'use strict';

require('bootstrap');
```



