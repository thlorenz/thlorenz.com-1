'use strict';

module.exports = {
    dev: {
      styles: [ 'bootstrap-responsive.css', 'bootstrap.css' ]
    , logLevel: 'verbose'
    }
  , prod: {
      styles: [ 'bootstrap-responsive.min.css', 'bootstrap.min.css' ]
    , logLevel: 'info'
    }
    // TODO: configurable via commandline and default to prod
  , mode: 'dev'
};
