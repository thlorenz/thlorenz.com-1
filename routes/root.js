var handlebars = require('handlebars')
  , models   =  require('../models')
  , log = require('npmlog')
  ;

function get() {
  var res = this.res;
 
  var html = handlebars.templates.index(models);
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(html);
}

module.exports = {
  get: get
};
