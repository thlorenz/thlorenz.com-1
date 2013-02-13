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
    , logLevel: 'verbose'
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
    }
    // TODO: configurable via commandline and default to prod
  , mode: 'dev'
};
