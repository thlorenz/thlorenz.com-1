var github = require('../github')
  , log = require('npmlog')
  ;

function notFound (res, err) {
  res.writeHead(404);
  res.end();
  if (err) log.error('github', err);
}

function get () {
  var req = this.req
    , res = this.res
    ;

  github.requestRepos(function (json) {
    var data = JSON.stringify(json)
      , repos = {
          headers: {
              'Content-Type'  : 'text/json' 
            , 'Content-Length' : data.length
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
    ;

  log.verbose('github', 'getting repo', repoName);
  
  github.requestReadmeByName(repoName, function (err, html) {
    if (err) notFound(res, err);
    else {
      var readme = {
          headers: {
              'Content-Type': 'text/html'
            , 'Content-Length': html.length
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
