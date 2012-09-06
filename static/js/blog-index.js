define(['jquery', 'handlebars', 'event-emitter', 'element'], 
function($, Handlebars, EventEmitter, el) {
  var self = this
    , emitter = new EventEmitter()
    , $navigation = $('article > nav')
    ;


  function fetchPosts (cb) {
    $.ajax({
        url: 'blog/index'
      , dataType: 'json'
    })
    .error(function (err) {
      console.log('Error ', err);  

      cb([]);
    })
    .success(function (data) {
      posts = _(data)
        .sortBy(function (x) {
          return -x.created;
        });

      cb(posts);
    });
  }

  function init() {
    fetchPosts(function (posts) {
      var html = _(posts)
        .map(function (post) {
          return Handlebars.partials['blog-nav'](post);
        })
        .join('\n');

      el.sidebarList
        .empty()
        .append(html);
    });
  }

  return {
      init: init
    , events: emitter
  };
});
