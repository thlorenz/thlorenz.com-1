define(['jquery', 'underscore', 'handlebars', 'element' ], function($, _, Handlebars, el) {
  var self = this
    , abouts = [
        { name: 'me', title: 'about me' }
      , { name: 'site', title: 'about thlorenz.com' }
      ]
    ;

  function init() {
    var html = _(abouts)
      .map(function (about) {
        return Handlebars.partials['about-nav'](about);
      })
      .join('\n');
    
    el.sidebarList
      .empty()
      .append(html);
  }

  return {
      init: init
  };
});
