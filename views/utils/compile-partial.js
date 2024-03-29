'use strict';
var hbs = require('hbs')
  , log = require('npmlog')
  , config = require('../../config')
  , compiledPartials = {};

function compilePartial(name) {
  var partial = hbs.handlebars.partials[name];

  log.verbose('compile-partial', 'compiling partial', name);

  if (!partial) {
    log.error('compile-partial', 'Partial [%s] was not found', name);
    return function () { return '<p> partial ' + name + ' not found</p>'; };
  }
  return compiledPartials[name] = hbs.handlebars.compile(partial);
}

module.exports = function compiledPartial(name) {
  return (config.mode !== 'dev' && compiledPartials[name]) || compilePartial(name);
};

