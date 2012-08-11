var request = require('request')
  , marked = require('marked')
  , apiurl ='https://api.github.com'
  , fs = require('fs')
  ;

function getRepos() {
  request.get(apiurl + '/users/thlorenz/repos', function (err, res, body) {
    var repos = JSON.parse(body)
      , infos = repos.map(function (repo) {
          return { name: repo.name, url: repo.url, htmlUrl: repo.html_url };
        });

      return infos;
  });
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

//getReadmeAllGithub();
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
