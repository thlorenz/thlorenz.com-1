define(['jquery', 'element'], function($, el) {
  
  var discussHtml = [
      ' <div id="disqus_thread"></div>'
    , '   <script type="text/javascript">'
    , '     var disqus_shortname = "thlorenz";'
    , '     (function() {'
    , '         var dsq = document.createElement("script"); dsq.type = "text/javascript"; dsq.async = true;'
    , '         dsq.src = "http://" + disqus_shortname + ".disqus.com/embed.js";'
    , '         (document.getElementsByTagName("head")[0] || document.getElementsByTagName("body")[0]).appendChild(dsq);'
    , '     })();'
    , ' </script>'
    , ' <noscript>Please enable JavaScript to view the <a href="http://disqus.com/?ref_noscript">comments powered by Disqus.</a></noscript>'
    , ' <a href="http://disqus.com" class="dsq-brlink">comments powered by <span class="logo-disqus">Disqus</span></a>'
  ].join('\n');

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

  el.sidebar.on('click', '.blog-nav a', function () {
      $('html, body').animate({scrollTop: 0}, 200);
  });

  return {
    init: init
  };
});
