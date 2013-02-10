'use strict';
var log = require('npmlog')
  , colors = require('ansicolors');

function renderMethod(m) {
  m = m.toUpperCase();
  switch(m) {
    case 'GET': return colors.green(m);
    case 'POST': return colors.blue('POS');
    case 'PUT': return colors.brightBlue(m);
    case 'DELETE': return colors.red('DEL');
  }
}

module.exports = function logRequest(req, res, next) {
  log.http('request', renderMethod(req.method), req.url);
  next();
};

