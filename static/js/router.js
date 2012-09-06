define(
  [ 'director'
  , 'github-index' 
  , 'blog-index'
  , 'stackoverflow-index'
  , 'contact-index'
  , 'github-content'
  , 'blog-content'
  ], 
function (director, github, blog, stackoverflow, contact, githubContent, blogContent) { 

  var routes = { 
        '/github'            :  function ()     { github.init(); }
      , '/blog'              :  function ()     { blog.init(); }
      , '/stackoverflow'     :  function ()     { stackoverflow.init(); }
      , '/contact'           :  function ()     { contact.init(); }
      , '/github/repo/:name' :  function (name) { githubContent.init(name); }
      , '/blog/post/:name'   :  function(name)  { blogContent.init(name); }
      }
    , router = window.Router(routes).init();
});

