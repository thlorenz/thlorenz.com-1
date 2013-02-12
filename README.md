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

## Clone

We'll need this later to pass around a copy of our config.

`npm -S i clone`

## Nodemon

For development we use nodemon in order to restart the server automatically on every edit. Our `npm start` script will
make use of `nodemon` later on:

`npm -D i nodemon`

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

## Adding a rendering strategy

We add more partials (an `x_nav` and an `x_content` for each of our content types, blog, github and about'

Then we add a handlebars helper to make rendering these consistent:

```js
'use strict';
var hbs = require('hbs')
  , log = require('npmlog')
  , config = require('../../config')
  , compiledPartials = {};

function compilePartial(name) {
  var partial = hbs.handlebars.partials[name];

  log.verbose('compile-partial', 'compiling partial', name);

  if (!partial) {
    log.error('compile-partial', 'Partial [%s] was not found', name);
    return function () { return '<p> partial ' + name + ' not found</p>'; };
  }
  return compiledPartials[name] = hbs.handlebars.compile(partial);
}

hbs.registerHelper('compile', function (name, model) {
  var compiled = (config.mode !== 'dev' && compiledPartials[name]) || compilePartial(name);
  return compiled(model); 
});
```

It takes care of compiling partials it sees for the first time (unless in dev mode where we want to recompile them
always to see effects of our edits).

We use this inside our index file like this:

```html
<section class="row">
    <nav class="sidebar offset1 span3">
      <ul class="nav">
        {{{ compile sidebar model.sidebar }}}
      </ul>
    </nav>
    <article class="span5">
      {{{ compile content model.content }}}
    </article>
  </div>
</section>
```

This allows us to simply specify partial names and models in our routes like in our blog route:

```js
'use strict';

module.exports = function (app) {
  app.get('/blog', function (req, res) {
    res.locals.sidebar = 'blog_nav';
    res.locals.content = 'blog_content';
    res.render('index');
  });
};
```

The next step is to initialize sidebar and content data in our model, which is initialized in a middleware inside
`init-locals.js`:

```js
'use strict';

var config = require('../config')
  , clone = require('clone');

module.exports = function initLocals(req, res, next) {
  // clone here to prevent config to be affected by additions/changes to res.locals inside routes
  res.locals = clone(config[config.mode], false);
  res.locals.model = { sidebar: { }, content: { }};
  next();
};
```

The code now [looks like this](https://github.com/thlorenz/thlorenz.com/tree/d0710545dc52ccdbd2b2122989af42c68e35a622).

## Using pushstate to improve user experience

In order to avoid refreshing the entire page every time the user looks at another blog post, we will load the post's
html via json and replace only part of the page with it. We will use the [history api]
(https://developer.mozilla.org/en-US/docs/DOM/Manipulating_the_browser_history) in order to update the url and keep back
and forward buttons working as usual.

The first step is to introduce manual navigation handling:

```js
'use strict';
/*global window */

var $ = require('jquery')
  , $sidebar
  , $content
  ;

function update(sidebar, content) {
  if (sidebar && sidebar !== $sidebar.html()) $sidebar.html(sidebar);
  if (content && content !== $content.html()) $content.html(content);
}

function render(history, url, res) {
  update(res.sidebar, res.content);
  history.pushState({sidebar: res.sidebar, content: res.content }, null, url);
}  

$(function () {
  var history = window.history;
  // TODO: bail if history api is not supported

  window.onpopstate = function (args) { 
    var state = args.state;
    if (!state) return;
    update(state.sidebar, state.content); 
  };

  $sidebar = $('.main .sidebar > ul');
  $content = $('.main .content');

  $('.main .sidebar')
    .on('click', 'a', function (event) {
      var url = event.target.href;
      $.ajax({
          url: url
        , dataType: 'json'
        })
        .success(function (res) { render(history, url, res); })
        .error(function () { console.log('error', arguments); })
        ;
      return false;
    });
});
```

Every time a link in the sidebar is clicked, we perform an xhr request instead to obtain a json object that of the
following shape: `{ sidebar: 'html string', content: 'html string' }.

If either property is present, we swap out the related html in the dom as well as pushing this object to the browser's
history: `history.pushstate(..)`. When the backbutton is pressed, `window.onpopstate` fires, which includes the pushed
state as one of the passed arguments. We then use this information to update the dom to the previous state without needing 
to request anything from the server.

The nice thing is that for browsers that don't support the history api, we will just not override the anchor clicks and
the links will be handled as usual with the only downside that the entire page is refreshed. However, our page is fully
functional in those browsers as well. Additionally this should help search engines to find all content of our page.

But how does the server know when to send just rendered html (i.e. when we directly navigate to `http://.../blog/post1`)
and when to send json (i.e. when we make an xhr request to the exact same url)?

The short answer is [**Accept Header**](http://shiflett.org/blog/2011/may/the-accept-header). We let express do the
grunt work for us in figuring out which data type the browser prefers to receive via the [`req.accepts` method](http://expressjs.com/api.html#req.accepts).
Depending on the result, we send either the rendered html of the entire page, or just a json which includes the html
snippets of the parts of the page that need replacing.

```js
'use strict';
var log = require('npmlog');

module.exports = function (app) {
  app

    [..]

    .get('/blog/:post', function (req, res) {
      log.verbose('blog', 'getting post', req.params.post);

      var prefersHtml = req.accepts('html, json') === 'html';
      
      res.locals.sidebar = 'blog_nav';
      res.locals.content = 'blog_content';

      res.locals.model.content.title = req.params.post;

      if (prefersHtml) return res.render('index');

      res.json(json(res.locals.model, res.locals.sidebar, res.locals.content));
    });
};

var compilePartial = require('../views/utils/compile-partial');

function json(model, sidebarTmpl, contentTmpl) {
  var data = {};
  if (sidebarTmpl) data.sidebar = compilePartial(sidebarTmpl)(model.sidebar);
  if (contentTmpl) data.content = compilePartial(contentTmpl)(model.content);
  return data;
}
```

Obviously more optimizations are possible, i.e. we don't need to replace the sidebar if just the blog post changed, but
for now we'll keep it simple.

In order to understand this better, you can [browse the code at this stage](https://github.com/thlorenz/thlorenz.com/tree/25d3c290d63e7b0b9d28b2641af4fd423d1c9b3f).
