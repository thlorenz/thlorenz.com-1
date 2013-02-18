'use strict';

module.exports = {
    dev: {
      styles: [ 
          'bootstrap-responsive.css'
        , 'bootstrap.css'
        , 'main.css'
        , 'blog/blog.css'
        , 'blog/code.css'
        , 'blog/code-fixes.css'
      ]
    , logLevel: 'silly'
    , debug: true
    }
  , prod: {
      styles: [ 
          'bootstrap-responsive.min.css'
        , 'bootstrap.min.css'
        , 'main.css'
        , 'blog/blog.css'
        , 'blog/code.css'
        , 'blog/code-fixes.css'
      ]
    , logLevel: 'info'
    , debug: false
    }
    // TODO: configurable via commandline and default to prod
  , mode: (process.argv.length > 2 && process.argv[2] === '--dev') ? 'dev' : 'prod'
};
