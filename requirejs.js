var requirejs   =  require('requirejs')
  , fs          =  require('fs')
  , log         =  require('npmlog')
  , buildConfig =  require('./static/js/main.build').config
  , config      =  require('./config')
  ;

function init (cb) {
  if (!config().optimizeJs) return cb();

  requirejs.optimize(buildConfig, function (res) {
    log.info('requirejs', res);
    cb();
  });
}

module.exports = {
  init: init
};

