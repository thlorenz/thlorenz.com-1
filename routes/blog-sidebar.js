'use strict';

var moment = require('moment');

module.exports = function adapt(blogMetadata, postName) {
  return blogMetadata.map(function (x) {
    var created = moment(x.created)
      , updated = moment(x.updated);
    return { 
        title   :  x.title
      , name    :  x.name
      , created :  created.format('dddd, MMMM Do YYYY')
      , updated :  updated.format('YYYY-MM-DD') // w3c time format (for sitemap)
      , active  :  x.name === postName
    };
  });
};
