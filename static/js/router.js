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
  var currentNav = null
    , navs = {
          github        :  github.init
        , blog          :  blog.init
        , stackoverflow :  stackoverflow.init
        , contact       :  contact.init
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
      , '/stackoverflow'     :  function ()     { updateNav('stackoverflow'); }
      , '/contact'           :  function ()     { updateNav('contact');       }
      , '/github/repo/:name' :  function (name) { updateNav('github'); githubContent.init(name); }
      , '/blog/post/:name'   :  function (name) { updateNav('blog');   blogContent.init(name); }
      }
    , router = window.Router(routes).init();
});

