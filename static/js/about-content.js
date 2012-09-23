define(['jquery', 'handlebars', 'element', 'content-transition'],
function($, Handlebars, el, transition) {
  function init () {
    transition.hide();
    transition.show(Handlebars.partials['about-content']());
  }

  return {
    init: init
  };
});
