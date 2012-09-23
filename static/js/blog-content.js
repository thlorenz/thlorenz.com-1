define(['jquery', 'element', 'content-transition'], function($, el, transition) {
  
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
      transition.show(data.html);
    });
  }

  transition.init('.blog-nav a');

  return {
    init: init
  };
});
