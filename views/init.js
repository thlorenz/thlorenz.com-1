'use strict';

var hbs         =  require('hbs')
  , path        =  require('path')
  , fs          =  require('fs')
  , partialsDir =  path.join(__dirname, 'partials');

function getPartialName(filepath) {
  var filename = path.basename(filepath)
    , extension = path.extname(filename);

  return filename.slice(0, -extension.length);
}

module.exports = function initViews() {
  // All functions are sync since this needs to finish before server starts up, i.e. blocking is desired

   fs
    .readdirSync(partialsDir)
    .filter(function (f) { return path.extname(f) === '.hbs'; })
    .forEach(function (p) {
      var content = fs.readFileSync(path.join(partialsDir, p), 'utf-8')
        , partialName = getPartialName(p);
      
      hbs.registerPartial(getPartialName(p), content);
    });
};
