var path          =  require('path')
  , oneDay        =  86400
  , oneHour       =  3600
  , defaultMaxAge =  oneHour
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
      devEnvironment: 'dev'
    }
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
