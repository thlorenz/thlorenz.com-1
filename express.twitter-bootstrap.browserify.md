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

`npm -S i npm log`


# Building app

## Getting up and running 

### app.js

```js
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

### 
