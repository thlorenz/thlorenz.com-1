var hotplates = require('hotplates')
  , models     =  require('../models')
  , log = require('npmlog')
  ;

function get(file) {
  var res = this.res;

  var html = hotplates.oven.index(models);
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(html);
}

module.exports = {
  get: get
};
