var path = require('path')
  , env;

function setEnv(envArg) {
  env = envArg;
}

function getProps() {
  var isDev = env.devEnvironment === 'dev';

  var def = {
      isDev: isDev
    , logLevel: env.loglevel || (isDev ? 'silly' : 'info')
    , paths: {
        stylus    :  path.join(__dirname, 'stylus')
      , css       :  path.join(__dirname, 'static', 'css')
      , templates :  path.join(__dirname, 'templates')
      , images    :  path.join(__dirname, 'static', 'images')
      }
  };
  return def;
}

getProps.setEnv = setEnv;

module.exports = getProps;
