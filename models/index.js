var config = require('../config');

module.exports = function () {
  return {
      styles : config().optimizeCss ? require('./styles-min') : require('./styles')
  };
};
    
