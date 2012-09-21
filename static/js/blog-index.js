define(['jquery', 'underscore', 'handlebars', 'element'], 
function($, _, Handlebars, el) {
  var self = this
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
      var posts = _(data)
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
          var extract = { 
              name    :  post.name
            , title   :  post.title
            , created :  new Date(post.created).toLocaleDateString()
          };
          return Handlebars.partials['blog-nav'](extract);
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
