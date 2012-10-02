var request      =  require('request')
  , marked       =  require('marked')
  , log          =  require('npmlog')
  , apiurl       =  'https://api.github.com'
  , fs           =  require('fs')
  , cache        =  require('./cache')
  , repos        =  {}
  , mostPopular  
  , articleRegex =  /<article +class="markdown-body.*".*>(.|[\n\r])+?<\/article>/m
  ;

function hashRepos (infos) {
  repos = {};
  infos.forEach(function (info) {
    repos[info.name] = info;
    if (!mostPopular || mostPopular.watchers < info.watchers)
      mostPopular = info;
  });
}

function requestRepos(cb) {
  var cached = cache.get('github.repos');

  if (cached) { 
    cb(null, cached.value); 
  } else {
    request.get(apiurl + '/users/thlorenz/repos', function (err, res, body) {
    // fs.readFile('./tmp/github-repos.json', 'utf-8', function (err, body) {
      if (err) { cb(err); return; }
      
      var repos = JSON.parse(body)
        , infos = repos
            .filter(function (repo) {
              return !repo.fork;
            })
            .map(function (repo) {
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
      cache.put('github.repos', infos, 60);

      cb(null, infos);
    });
  }
}

function requestMostPopular (cb) {
  if (mostPopular) { 
    requestReadmeByName(mostPopular.name, cb); 
    return; 
  }

  requestRepos(function (err, infos) {

    if (err) { cb(err); return; }

    log.verbose('github', 'most popular', mostPopular);
    if (mostPopular) {
      requestReadmeByName(mostPopular.name, cb); 
      return; 
    }

    if (infos && infos.length > 0) {
      requestReadmeByName(infos[0].name, cb);
      return;
    }
    cb(new Error('No repos available'));
  });
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
    requestRepos(function (err, infos) {
      if (err) { cb(err); return; }
      
      repo = repos[name];  

      if (!repo) {
        cb(new Error('No readme found for ' + name));
      } else { 
        processRepo();
      }
    });
  } else {
    processRepo();
  }
}

module.exports = { 
    requestRepos        :  requestRepos
  , requestMostPopular  :  requestMostPopular
  , requestReadmeByUrl  :  requestReadmeByUrl
  , requestReadmeByName :  requestReadmeByName
};
