var path = require('path')
  , oneDay = 86400
  , oneHour = 3600
  , defaultMaxAge = oneHour
  , paths = {
      stylus    :  path.join(__dirname, 'stylus')
    , css       :  path.join(__dirname, 'static', 'css')
    , templates :  path.join(__dirname, 'templates')
    , images    :  path.join(__dirname, 'static', 'images')
    , js        :  path.join(__dirname, 'static', 'js')
    }
  , caching = {
      maxAge: {
          github : {
              index: defaultMaxAge
            , repo: defaultMaxAge 
          }
        , image : oneDay
      }
    }
  , env
  ;
  

function setEnv(envArg) {
  env = envArg;
}

function getProps() {
  var isDev = env.devEnvironment === 'dev';

  var def = {
      isDev: isDev
    , logLevel: env.loglevel || (isDev ? 'verbose' : 'info')
    , paths: paths  
    , caching: caching
    };

  return def;
}

getProps.setEnv = setEnv;

module.exports = getProps;
