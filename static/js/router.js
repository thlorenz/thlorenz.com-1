define(
  [ 'director'
  , 'github-index' 
  , 'blog-index'
  , 'stackoverflow-index'
  , 'contact-index'
  ], function (director, github, blog, stackoverflow, contact) { 

  var routes = { 
        '/github'        :  function () { github.init(); }
      , '/blog'          :  function () { blog.init(); }
      , '/stackoverflow' :  function () { stackoverflow.init(); }
      , '/contact'       :  function () { contact.init(); }
      }
    , router = window.Router(routes).init();
});
