var github = require('../github')
  , log = require('npmlog')
  , utl = require('../utl')
  , config = require('../config')
  ;

function notFound (res, err) {
  res.writeHead(404);
  res.end();
  if (err) log.error('github', err);
}

function get () {
  var req = this.req
    , res = this.res
    , maxAge = config().caching.maxAge.github.index
    ;

  github.requestRepos(function (json) {
    var data = JSON.stringify(json)
      , repos = {
          headers: {
              'Content-Type'   :  'text/json'
            , 'Content-Length' :  data.length
            , 'ETag'           :  '"' + utl.md5(data) + '"'
            , 'Cache-Control'  :  'public, max-age=' + maxAge.toString()
            }
          , body: data
        };

    res.writeHead(200, repos.headers);
    res.end(repos.body);
  });
}

function getRepo (repoName) {
  var req = this.req
    , res = this.res
    , maxAge = config().caching.maxAge.github.repo
    ;

  log.verbose('github', 'getting repo', repoName);
  
  github.requestReadmeByName(repoName, function (err, html) {
    if (err) notFound(res, err);
    else {
      var readme = {
          headers: {
              'Content-Type'   :  'text/html'
            , 'Content-Length' :  html.length
            , 'ETag'           :  '"' + utl.md5(html) + '"'
            , 'Cache-Control'  :  'public, max-age=' + maxAge.toString()
          }
        ,  body: html
      };

      res.writeHead(200, readme.headers);
      res.end(readme.body);
    }
  });
}

module.exports = { 
    get     :  get
  , getRepo :  getRepo
};
