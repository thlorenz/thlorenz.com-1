define(['jquery', 'underscore', 'handlebars', 'event-emitter'], function($, _, Handlebars, EventEmitter) {
  var self = this
    , emitter = new EventEmitter()
    , $navigation = $('article > nav')
    , repos
    ;

  function fetchRepos() {
    $.ajax({
        url: 'github/index'
      , dataType: 'json'
    })
    .error(function (err) {
      console.log('Error ', err);  
      repos = [];
    })
    .success(function (data) {
      repos = _(data.value)
        .sortBy(function (x) {
          return -x.watchers;
        });
    });
  }

  function init() {
    if (!repos || !repos.length) fetchRepos();

    console.log(repos);
  }

  return {
      init: init
    , events: emitter
  };
});
