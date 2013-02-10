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
