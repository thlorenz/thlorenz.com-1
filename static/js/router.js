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

  function track (route) {
    // track pageviews manually since this is a single page app
    // See: http://akahn.net/2010/11/12/tracking-events-with-google-analytics.html
    _gaq.push(['_trackPageview', route || '/']);
  }

  function getGithub () {
    track('github');
    updateNav('github'); 
    githubContent.init();
  }

  function getGithubRepo (name) {
    track('github/repo/' + name);
    updateNav('github'); 
    githubContent.init(name);
  }

  function getBlog () {
    track('blog');
    updateNav('blog');
    blogContent.init();   
  }

  function getBlogPost (name) {
    track('blog/post/' + name);
    updateNav('blog');
    blogContent.init(name); 
  }
  
  function getAbout () {
    track('about');
    updateNav('about');      
  }

  var routes = { 
        '/github'            : getGithub 
      , '/blog'              : getBlog
      , '/about'             : getAbout 
      , '/github/repo/:name' : getGithubRepo 
      , '/blog/post/:name'   : getBlogPost 
      }
    , router = window.Router(routes).init('/blog');


});
