var path          =  require('path')
  , oneDay        =  86400
  , oneHour       =  3600
  , defaultMaxAge =  oneHour
  , envs          =  [ 'debug', 'dev', 'prod' ]
  , loglevels     =  [ 'silly', 'verbose', 'info' ]
  , blog          =  path.join(__dirname, 'thlorenz.com-blog')
  , staticp       =  path.join(__dirname, 'static')
  , css           =  path.join(staticp, 'css')
  , paths         =  {
      templates :  path.join(__dirname, 'templates')
    , stylus    :  path.join(__dirname, 'stylus')
    , css       :  css
    , images    :  path.join(staticp, 'images')
    , js        :  path.join(staticp, 'js')
    , blog      :  {
          root     :  blog
        , images   :  path.join(blog, 'assets', 'images')
        , blog_css :  path.join(css, 'blog.css')
      }
    }
  , caching = {
      maxAge: {
          github : {
              index: defaultMaxAge
            , repo: defaultMaxAge 
          }
        , blog : {
              index: defaultMaxAge
            , post: defaultMaxAge 
          }
        , image : oneDay
      }
    }
  , env = {
      name: 'dev'
    }
  ;
  
function envIndex (name) {
  return envs.indexOf(name);
}

function currentEnvIndex (name) {
  return envIndex(env.name);
}

function setEnv(env_) {
  env = env_;
}

function getConfig() {
  return {
      logLevel    :  env.loglevel         || loglevels[ currentEnvIndex() ]
    , optimizeCss :  env.forceOptimizeCss || currentEnvIndex() >= envIndex('prod')
    , optimizeJs  :  env.forceOptimizeJs  || currentEnvIndex() >= envIndex('prod')
    , paths       :  paths
    , caching     :  caching
    };
}

module.exports = getConfig;
module.exports.setEnv = setEnv;
