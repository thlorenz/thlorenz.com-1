'use strict';
/*globals window*/

var $ = require('jquery')
  , navigation = require('./navigation');


function byStarsDescending (a, b) { 
  return a.stars > b.stars ? -1 : 1; 
}

function simpleRepoTmpl (repo) {
  return    '<li>' 
          +   '<a href="' + repo.url + '">' + repo.name + '</a>'
          +   '<span>' + repo.stars +'</span>'
          +   '<span>' + repo.forks + '</span>'
          +   '<p>' + repo.desc + '</p>'
          + '</li>'
          ;
}

function onGithubRepos ($githubRepos, res) {
  var repos = res.data
    , ownRepos = repos.filter(
        function (x) {
          return !x.fork;
      })
    , sortedRepos = ownRepos.map(
        function (x) {
            return { 
                name  :  x.name
              , url   :  x.html_url
              , desc  :  x.description
              , stars :  x.watchers_count
              , forks :  x.forks
            };
          }
        )
      .sort(byStarsDescending);
  
  var html = 
      '<ul class="nav nav-list github-repos">'
    + sortedRepos.map(simpleRepoTmpl).join('\n')
    + '</ul>';

  $githubRepos.html(html);
}


function loadRepos() {
  var $githubRepos = $('#github-repos');
  if (!$githubRepos.length) return;
  
  // jquery jsonp only seems to work via getJSON, i.e. the $.get API with dataType: jsonp doesn't
  $.getJSON(
      'https://api.github.com/users/thlorenz/repos?per_page=500&&callback=?'
    , null
    , function (res) { onGithubRepos($githubRepos, res); });
}

navigation.onnavigated(loadRepos);
loadRepos();
