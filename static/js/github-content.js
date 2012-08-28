define(['jquery', 'element'], function($, el) {
  var $currentContent;

  function show (html) {

    $currentContent = $(html);
    $currentContent.hide();

    el.content
      .empty()
      .append($currentContent);

    $currentContent.fadeIn(500);
  }

  function hide () {
    if ($currentContent) 
      $currentContent
        .clearQueue()
        .fadeOut(200);

  }

  function init (repoName) {
    $.ajax({
        url: '/github/repo/' + repoName
      , dataType: 'html'
      , beforeSend: hide
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
