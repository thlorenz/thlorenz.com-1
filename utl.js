var crypto = require('crypto')
  , path = require('path')
  ;


/**
 * Lots of these are taken from https://github.com/senchalabs/connect
 */


/**
 * From:  https://github.com/senchalabs/connect/blob/master/lib/utils.js
 *
 * Return md5 hash of the given string and optional encoding,
 * defaulting to hex.
 *
 *     utils.md5('wahoo');
 *     // => "e493298061761236c96b02ea6aa8a2ad"
 *
 * @param {String} str
 * @param {String} encoding
 * @return {String}
 * @api private
 */

exports.md5 = function(str, encoding){
  return crypto
    .createHash('md5')
    .update(str)
    .digest(encoding || 'hex');
};

exports.removeExtension = function (filename) {
  return filename.substr(0, filename.length - path.extname(filename).length);
};
