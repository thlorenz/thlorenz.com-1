define(
  [ 'director'
  , 'github-index' 
  , 'blog-index'
  , 'stackoverflow-index'
  , 'contact-index'
  , 'github-content'
  ], function (director, github, blog, stackoverflow, contact, githubContent) { 

  var routes = { 
        '/github'        :  function () { github.init(); }
      , '/blog'          :  function () { blog.init(); }
      , '/stackoverflow' :  function () { stackoverflow.init(); }
      , '/contact'       :  function () { contact.init(); }
      , '/github/repo/:name' : function (name) { githubContent.init(name); }
      }
    , router = window.Router(routes).init();
});

