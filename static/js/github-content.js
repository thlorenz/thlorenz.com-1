define(['jquery', 'element'], function($, el) {
  var repos = {};

  function show (html) {
    el.content
      .empty()
      .append(html)
      .clear()
      .fadeIn(200);
  }

  function hide () {
    el.content
      .clear()
      .fadeOut(200);  
  }

  function init (repoName) {
    console.log('getting', repoName);
    if (repos[repoName]) show(repos[repoName]);
    else {
      $.ajax({
          url: '/github/repo/' + repoName
        , dataType: 'html'
      })
      .error(function (err) {
        console.log('Error ', err);  
      })
      .success(function (html) {
        repos[repoName] = html;
        show(html);
      });
    }
  }

  return {
    init: init
  };

});
