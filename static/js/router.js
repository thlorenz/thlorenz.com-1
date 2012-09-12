define(
  [ 'director'
  , 'github-index' 
  , 'blog-index'
  , 'about-index'
  , 'github-content'
  , 'blog-content'
  ], 
function (director, github, blog, about, githubContent, blogContent) { 
  var currentNav = null
    , navs = {
          github        :  github.init
        , blog          :  blog.init
        , about         :  about.init
      }
    ;

  function updateNav (nav) {
    if (currentNav !== nav) {
      navs[nav]();
      currenNav = nav;
    }
  }

  var routes = { 
        '/github'            :  function ()     { updateNav('github'); githubContent.init(); }
      , '/blog'              :  function ()     { updateNav('blog');   blogContent.init();   }
      , '/about'             :  function ()     { updateNav('about');       }
      , '/github/repo/:name' :  function (name) { updateNav('github'); githubContent.init(name); }
      , '/blog/post/:name'   :  function (name) { updateNav('blog');   blogContent.init(name); }
      }
    , router = window.Router(routes).init();
});

