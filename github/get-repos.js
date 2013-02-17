'use strict';

var request = require('request')
  , log = require('npmlog')
  , moment = require('moment')
  , cache;


function byStarsDescending (a, b) { 
  return a.stars > b.stars ? -1 : 1; 
}

module.exports = function getRepos(cb) {
  var cachedReposAreGood = cache && new Date() < cache.goodUntil;

  if (cachedReposAreGood) {
    log.silly('github', 'serving from cache');
    return cb(null, cache.repos);
  }

  log.silly('github', 'querying github to refresh cache');

  request.get('https://api.github.com/users/thlorenz/repos?per_page=500', function (err, res, body) { 
    if (err) return cb(err);
    var repos;
    try {
      repos = JSON.parse(body);
    } catch (e) {
      log.error('github/get-repos', 'error: ', e);
      log.silly('github/get-repos', 'body', body);
      cb(e);
    }

    var ownRepos = repos.filter(
          function (x) {
            return !x.fork;
        })
      , sortedRepos = ownRepos.map(
          function (x) {
              return { 
                  name    :  x.name
                , url     :  x.html_url
                , desc    :  x.description
                , stars   :  x.watchers_count
                , forks   :  x.forks
                , starUrl :  x.html_url + '/stargazers'
                , forkUrl :  x.html_url + '/network'
              };
            }
          )
        .sort(byStarsDescending);

      cache = { goodUntil: moment(new Date()).add(1, 'day'), repos: sortedRepos };

      cb(null, sortedRepos);
  });
};
