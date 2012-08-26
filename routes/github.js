var github = require('../github');

function get (path) {
  var req = this.req
    , res = this.res
    ;

  if (path === 'index') {
    github.getRepos(function (json) {
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
}

module.exports = { get: get };
