define(['jquery', 'handlebars', 'element', 'content-transition'], function($, Handlebars, el, transition) {

  function init (repoName) {
    $.ajax({
        url: '/github/repo/' + repoName
      , dataType: 'html'
      , beforeSend: transition.hide
    })
    .error(function (err) {
      console.log('Error ', err);  
    })
    .success(function (html) {
      var forkme = Handlebars.partials['github-forkme-banner'](repoName);
      transition.show(html + '\n' + forkme);
    });
  }

  transition.init('.github-nav a');

  return {
    init: init
  };

});
