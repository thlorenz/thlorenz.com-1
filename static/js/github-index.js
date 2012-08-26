define(['jquery', 'underscore', 'handlebars', 'event-emitter'], function($, _, Handlebars, EventEmitter) {
  var self = this
    , emitter = new EventEmitter()
    , $nav= $('article > nav > ul')
    , repos
    ;

  function fetchRepos(cb) {
    if (!repos || !repos.length) cb(repos);
    $.ajax({
        url: 'github/index'
      , dataType: 'json'
    })
    .error(function (err) {
      console.log('Error ', err);  
      cb([]);
    })
    .success(function (data) {
      repos = _(data.value)
        .sortBy(function (x) {
          return -x.watchers;
        });
      cb(repos);
    });
  }

  function init() {
    fetchRepos(function (repos) {
      _(repos).chain()
        .map(function (repo) {
          var html = Handlebars.partials['github-nav'](repo);
          return $(html);
        })
        .forEach(function ($item) {
          $nav.append($item);
        });
    });
  }

  return {
      init: init
    , events: emitter
  };
});
