define(['jquery', 'element'], function($, el) {
  
  // TODO: 90% same code as github-content -> extract commonalities
  
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

  function init (postName) {
    $.ajax({
        url: '/blog/post/' + postName
      , dataType: 'json'
      , beforeSend: hide
    })
    .error(function (err) {
      console.log('Error ', err);  
    })
    .success(function (data) {
      show(data.html);
    });
  }

  return {
    init: init
  };
});
