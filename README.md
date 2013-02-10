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

Loading the `bundle.js` script in the head is not the best idea since it blocks the page from loading, so we will fix
that later once we create a `scripts` partial.

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

At this point we are ready to build out the website.

You can [browse the code at this stage](https://github.com/thlorenz/thlorenz.com/tree/449c8c9616ecb13dae10fba9ad2d2af4557716fb).

## Creating proper routes

Pull all `app.get` invocations into separate modules inside a `routes` folder.

This simplifies `app.js` and results in a clear project structure, [browse code after the change](https://github.com/thlorenz/thlorenz.com/tree/b88e696017edc652845787dfa22e7085c72ddb30).

## Using partials

Create head partial that takes styles via the passed context.

```html
<meta charset=utf-8 />
<title>thlorenz.com</title>
<meta http-equiv="content-type" content="text/html" />

{{#each styles}}
  <link rel="stylesheet" href="/css/{{ this }}" type="text/css" media="screen" charset="utf-8"0>
{{/each}}
```

The styles get resolved via a config that we implement as follows:

```js
'use strict';

module.exports = {
    dev: {
      styles: [ 'bootstrap-responsive.css', 'bootstrap.css' ]
    }
  , prod: {
      styles: [ 'bootstrap-responsive.min.css', 'bootstrap.min.css' ]
    }
    // TODO: configurable via commandline and default to prod
  , mode: 'dev'
};
```

They are injected into the partial via a small change to our `index.js` route which now looks as follows:

```js
'use strict';
var config = require('../config');

module.exports = function (app) {
  app.get('/', function (req, res) {
    res.locals = config[config.mode];
    res.render('index');
  });
};
```

We register our partials via a simple script that runs on server startup:

```js
'use strict';

var hbs         =  require('hbs')
  , path        =  require('path')
  , fs          =  require('fs')
  , partialsDir =  path.join(__dirname, 'partials');

function getPartialName(filepath) {
  var filename = path.basename(filepath)
    , extension = path.extname(filename);

  return filename.slice(0, -extension.length);
}

module.exports = function initViews() {
  // All functions are sync since this needs to finish before server starts up, i.e. blocking is desired

   fs
    .readdirSync(partialsDir)
    .filter(function (f) { return path.extname(f) === '.hbs'; })
    .forEach(function (p) {
      var content = fs.readFileSync(path.join(partialsDir, p), 'utf-8')
        , partialName = getPartialName(p);
      
      hbs.registerPartial(getPartialName(p), content);
    });
};
```

Since there is not much going on on our page at this point our `index.hbs` becomes rather simple:

```html
<!DOCTYPE html>
<html>
<head>
  {{> head }}
</head>
<body>
  <h1>thlorenz.com</h1>
</body>
</html>
```

For more details [browse the code at that stage](https://github.com/thlorenz/thlorenz.com/tree/7a18542a360c4b3cdb3bc60118f92f4e849ccce0).


## Adding request logging

While developing, we want to log all server requests.

We will use different colors for the different request methods, so lets: `npm -S i ansicolors`.

Here is our log-request middleware:

```js
'use strict';
var log = require('npmlog')
  , colors = require('ansicolors');

function renderMethod(m) {
  m = m.toUpperCase();
  switch(m) {
    case 'GET': return colors.green(m);
    case 'POST': return colors.blue('POS');
    case 'PUT': return colors.brightBlue(m);
    case 'DELETE': return colors.red('DEL');
  }
}

module.exports = function logRequest(req, res, next) {
  log.http('request', renderMethod(req.method), req.url);
  next();
};
```

We'll use it in our app as follows:

```js
app
  .set('view engine', 'hbs')
  .set('views', path.join(__dirname, 'views'))
  .use(require('./middleware/log-request'))
```

[browse code at this stage](https://github.com/thlorenz/thlorenz.com/tree/2fc64a50f6fa71f96465a3fb7966d64029b8fe41)

