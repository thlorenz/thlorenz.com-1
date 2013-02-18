'use strict';

var request = require('request')
  , log = require('npmlog')
  , moment = require('moment')
  , url = require('url')
  , cache;


function byStarsDescending (a, b) { 
  return a.stars > b.stars ? -1 : 1; 
}

function createRequest() {
  // use token to make authorized request, otherwise we'll run into exceeded API limit problem when hosted
  var req = {
      method: 'GET'
    , uri : url.format(
      { protocol: 'https'
      , hostname: 'api.github.com'
      , pathname: '/users/thlorenz/repos?per_page=500'
      })
    }
  , githubToken = process.env.GITHUB_TOKEN;

  if (!githubToken) return req;

  log.silly('github', 'creating request using token [%s]', githubToken);
  req.headers = { Authorization: 'bearer ' + githubToken };

  return req;
}

module.exports = function getRepos(cb) {
  var cachedReposAreGood = cache && new Date() < cache.goodUntil;

  if (cachedReposAreGood) {
    log.silly('github', 'serving from cache');
    return cb(null, cache.repos);
  }

  log.silly('github', 'querying github to refresh cache');

  request(createRequest(), function (err, res, body) {
    if (err) return cb(err);
    var repos;
    try {
      repos = JSON.parse(body);
      // didn't get any repos - we could try again or just bail
      if (!repos.filter) {
        log.error('github/get-repos', 'no repos returned', repos);
        repos = null;
        return cb(new Error('github.com seems to not be able to send any repos at this point'));
      }
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
