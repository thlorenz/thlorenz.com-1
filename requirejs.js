var requirejs   =  require('requirejs')
  , fs          =  require('fs')
  , log         =  require('npmlog')
  , buildConfig =  require('./static/js/main.build').config
  ;

function init (cb) {
  requirejs.optimize(buildConfig, function (res) {
    log.info('requirejs', res);
    cb();
  });
}

module.exports = {
  init: init
};

