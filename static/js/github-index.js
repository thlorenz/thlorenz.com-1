define(['jquery', 'underscore', 'handlebars', 'event-emitter', 'element'], 
function($, _, Handlebars, EventEmitter, el) {
  var self = this
    , emitter = new EventEmitter()
    ;

  function fetchRepos(cb) {
    $.ajax({
        url: 'github/index'
      , dataType: 'json'
    })
    .error(function (err) {
      console.log('Error ', err);  
      cb([]);
    })
    .success(function (data) {
      repos = _(data)
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
          el.sidebarList.append($item);
        });
    });
  }

  return {
      init: init
    , events: emitter
  };
});
