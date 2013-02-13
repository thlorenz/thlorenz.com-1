'use strict';
var hbs = require('hbs')
  , compilePartial = require('../utils/compile-partial')
  ;

hbs.registerHelper('exec', function (name, model) {
  var compiled = compilePartial(name);
  return compiled(model); 
});
