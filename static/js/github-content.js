define(['jquery', 'element', 'content-transition'], function($, el, transition) {

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
      transition.show(html);
    });
  }

  transition.init('.github-nav a');

  return {
    init: init
  };

});
