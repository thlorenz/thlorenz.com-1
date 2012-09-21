define(['jquery', 'underscore', 'handlebars', 'element'], 
function($, _, Handlebars, el) {
  var self = this;

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
      var html = _(repos)
        .map(function (repo) {
          return Handlebars.partials['github-nav'](repo);
        })
        .join('\n');

        el.sidebarList
          .empty()
          .append(html);
    });
  }

  return {
      init: init
  };
});
