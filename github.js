var request = require('request')
  , marked = require('marked')
  , apiurl ='https://api.github.com'
  , fs = require('fs')
  , cache = require('./cache')
  ;

function getRepos(cb) {
  var cached = cache.get('github.repos');
  if (cached) cb(cached); 
  else {
    request.get(apiurl + '/users/thlorenz/repos', function (err, res, body) {
      var repos = JSON.parse(body)
        , infos = repos.map(function (repo) {
            return { 
                name        :  repo.name
              , url         :  repo.url
              , htmlUrl     :  repo.html_url
              , watchers    :  repo.watchers_count
              , forks       :  repo.forksCount
              , pushedAt    :  repo.pushed_at
              , description :  repo.description
            };
          });

      cache.put('github.repos', infos, 60);
      cb(infos);
    });
  }
}

function getReadmeMarked () {
  request.get('https://raw.github.com/thlorenz/proxyquire/master/README.md', function (err, res, body) {
    var html = marked.parse(body);
    console.log(html);
  });
}

function getReadmeAllGithub () {
  request.get('https://github.com/thlorenz/proxyquire/blob/master/README.md', function (err, res, body) {
    console.log(article);
  });
}


getRepos(function (repos) {
  console.log(repos);  
});


/*
///<article>.+?<\/article>/
var body = fs.readFileSync('./t.html').toString()
  //, regex = /<article +class="markdown-body.*".+?>.+?<\/article>/
  , regex = /<article +class="markdown-body.*".*>(.|[\n\r])+?<\/article>/m
  , matchData = body.match(regex);
if (matchData) {
  var article = matchData[0];
  fs.writeFileSync('./article.html', article);
} else {
  console.log('nope');
}
*/
