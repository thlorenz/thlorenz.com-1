var request      =  require('request')
  , marked       =  require('marked')
  , log          =  require('npmlog')
  , apiurl       =  'https://api.github.com'
  , fs           =  require('fs')
  , cache        =  require('./cache')
  , repos        =  {}
  , articleRegex =  /<article +class="markdown-body.*".*>(.|[\n\r])+?<\/article>/m
  ;

function hashRepos (infos) {
  repos = {};
  infos.forEach(function (info) {
    repos[info.name] = info;
  });
}

function requestRepos(cb) {
  var cached = cache.get('github.repos');

  if (cached) { 
    cb(cached.value); 
  } else {
    // request.get(apiurl + '/users/thlorenz/repos', function (err, res, body) {
    fs.readFile('./tmp/github-repos.json', 'utf-8', function (err, body) {
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

      hashRepos(infos);
      cb(infos);
      cache.put('github.repos', infos, 60);
    });
  }
}

function requestReadmeByUrl (repoUrl, cb) {
  var cached = cache.get(repoUrl);
  if (cached) { 
    cb(null, cached.value); 
  } else {
    request.get(repoUrl, function (err, res, body) {
      var html = marked.parse(body)
        , matchData = body.match(articleRegex)
        ;

      if (!matchData) cb(new Error('No readme found'));
      else {
        var article = matchData[0];

        cb(null, article);
        cache.put(repoUrl, article, 60);
      }
    });
  }
}

function requestReadmeByName (name, cb) {
  var repo = repos[name];

  function processRepo() {
    requestReadmeByUrl(repo.htmlUrl, cb);
  }

  if (!repo) {

    requestRepos(function () {
      repo = repos[name];  
      if (!repo) cb(new Error('No readme found'));
      else processRepo();
    });

  } else {
    processRepo();
  }
    
}

module.exports = { 
    requestRepos: requestRepos
  , requestReadmeByUrl: requestReadmeByUrl
  , requestReadmeByName: requestReadmeByName
};
