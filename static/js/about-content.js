define(['jquery', 'handlebars', 'element', 'content-transition'],
function($, Handlebars, el, transition) {
  function init (name) {
    transition.hide();

    var partial
      , ctx;

    switch(name) {
      case 'me':
        partial = 'about-me-content';
        ctx = {};
        
        break;
      case 'site':
        partial = 'about-site-content';
        ctx = {
          libraries: [
            { name: 'hotplates'  ,  link: '#/github/repo/hotplates' }
          , { name: 'stylus'     ,  link: 'http://learnboost.github.com/stylus/' }
          , { name: 'handlebars' ,  link: 'http://handlebarsjs.com/' }
          , { name: 'requirejs'  ,  link: 'http://requirejs.org/' }
          , { name: 'runnel'     ,  link: '#/github/repo/runnel' }
          , { name: 'director'   ,  link: 'https://github.com/flatiron/director' }
          ]
        };
        break;
      default:
        partial = 'about-me-content';
        ctx = {};
        
    }

    transition.show(Handlebars.partials[partial](ctx));
  }

  return {
    init: init
  };
});
