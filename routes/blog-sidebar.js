'use strict';

var moment = require('moment');

module.exports = function adapt(blogMetadata, postName) {
  return blogMetadata.map(function (x) {
    var d = moment(x.created);
    return { 
        title   :  x.title
      , name    :  x.name
      , created :  d.format('dddd, MMMM Do YYYY')
      , active  :  x.name === postName
    };
  });
};
