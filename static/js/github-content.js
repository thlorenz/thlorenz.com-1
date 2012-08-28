define(['jquery', 'element'], function($, el) {
  function show (html) {
    el.content
      .empty()
      .append(html)
      .fadeIn(200);
  }

  function hide () {
    el.content.fadeOut(200);  
  }

  function init (repoName) {
    console.log('getting', repoName);
    $.ajax({
        url: '/github/repo/' + repoName
      , dataType: 'html'
    })
    .error(function (err) {
      console.log('Error ', err);  
    })
    .success(function (html) {
      show(html);
    });
  }

  return {
    init: init
  };

});
