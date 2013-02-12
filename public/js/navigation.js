'use strict';

var $ = require('jquery')
  , $sidebar
  , $content;

function render(res) {
  if (res.sidebar && res.sidebar !== $sidebar.html()) $sidebar.html(res.sidebar);
  if (res.content && res.content !== $content.html()) $content.html(res.content);
}  

$(function () {
  console.log('ready');
  $sidebar = $('.main .sidebar > ul');
  $content = $('.main .content');

  $('.main .sidebar')
    .on('click', 'a', function (event) {
      var url = event.target.href;
      $.ajax({
          url: url
        , dataType: 'json'
        })
        .success(render)
        .error(function () { console.log('error', arguments); })
        ;
      return false;
    });

});
