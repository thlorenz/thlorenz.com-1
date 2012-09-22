var config = require('./config');

function init (cb) {
  if (!config().optimizeJs) return cb();

  require('requirejs')
    .optimize(require('./static/js/main.build').config, function (res) {
      require('npmlog').info('requirejs', res);
      cb();
    });
}

module.exports = {
  init: init
};

