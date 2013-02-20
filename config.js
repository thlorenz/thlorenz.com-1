'use strict';

module.exports = {
    dev: {
      styles: [ 
          'bootstrap.css'
        , 'main.css'
        , 'blog/blog.css'
        , 'blog/code.css'
        , 'blog/code-fixes.css'
        , 'blog/peacock-tango.css'
      ]
    , logLevel: 'silly'
    , debug: true
    }
  , prod: {
      styles: [ 
          'bootstrap.min.css'
        , 'main.min.css'
        , 'blog/blog.min.css'
      ]
    , logLevel: 'info'
    , debug: false
    }
  , mode: (process.argv.length > 2 && process.argv[2] === '--dev') ? 'dev' : 'prod'
};
