'use strict';

var request = require('request')
  , log = require('npmlog')
  , moment = require('moment')
  , url = require('url')
  , requestAllPages = require('request-all-pages')
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

  var githubToken = process.env.GITHUB_TOKEN;
  if (!githubToken) {
    log.warn('github/get-repos', 'no github token, returning');
    cb();
  }

  var requestOpts = {
      uri: 'https://api.github.com/users/thlorenz/repos'
    , json: true
    , body: {}
    , headers: { 
        Authorization: 'bearer ' + githubToken
      , 'user-agent': 'request-all-pages' 
      } 
    };

  requestAllPages(requestOpts, { startPage: 1, pagesPer: 100 }, function (err, pages) {
    if (err) return cb(err);

    var repos
    try {
      repos = pages
        .reduce(
          function (acc, page) { return acc.concat(page.body) }
        , []);

      // didn't get any repos - we could try again or just bail
      if (!repos.filter) {
        log.error('github/get-repos', 'no repos returned', repos);
        repos = null;
        return cb(new Error('github.com seems to not be able to send any repos at this point'));
      }
    } catch (e) {
      log.error('github/get-repos', 'error: ', e);
      log.silly('github/get-repos', 'repos', repos);
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
