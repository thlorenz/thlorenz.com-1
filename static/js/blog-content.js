define(['jquery', 'element', 'content-transition'], function($, el, transition) {

  function initDisqus(postName, title) {
    el.disqus.show();

    DISQUS.reset({
      reload: true,
      config: function () {  
        this.page.identifier = postName;  
        this.page.url = "http://thlorenz.com/!#" + postName;
        this.page.title = title;
      }
    });
  }

  function init (postName) {
    $.ajax({
        url: '/blog/post/' + postName
      , dataType: 'json'
      , beforeSend: transition.hide
    })
    .error(function (err) {
      console.log('Error ', err);  
    })
    .success(function (data) {
      transition.show(data.html, function () {
        initDisqus(postName, data.metadata.title);
      });
    });
  }

  transition.init('.blog-nav a');

  return {
    init: init
  };
});
