'use strict';

var request = require('request');

function byStarsDescending (a, b) { 
  return a.stars > b.stars ? -1 : 1; 
}

module.exports = function getRepos(cb) {
  request.get('https://api.github.com/users/thlorenz/repos?per_page=500', function (err, res, body) { 
    if (err) return cb(err);
    var repos = JSON.parse(body)
      , ownRepos = repos.filter(
          function (x) {
            return !x.fork;
        })
      , sortedRepos = ownRepos.map(
          function (x) {
              return { 
                  name  :  x.name
                , url   :  x.html_url
                , desc  :  x.description
                , stars :  x.watchers_count
                , forks :  x.forks
              };
            }
          )
        .sort(byStarsDescending);
      cb(null, sortedRepos);
  });
};
