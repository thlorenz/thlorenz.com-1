'use strict';
/*global window */

var $ = require('jquery')
  , $sidebar
  , $content
  ;

function browserSupportsHistoryApi(history) {
  return !!(history && history.pushState);
}

function update(sidebar, content) {
  if (sidebar && sidebar !== $sidebar.html()) $sidebar.html(sidebar);
  if (content && content !== $content.html()) $content.html(content);
}

function render(history, url, res) {
  update(res.sidebar, res.content);
  history.pushState({sidebar: res.sidebar, content: res.content }, null, url);
}  

$(function () {
  var history = window.history;
  if (!browserSupportsHistoryApi(history)) return;

  window.onpopstate = function (args) { 
    var state = args.state;
    if (!state) return;
    update(state.sidebar, state.content); 
  };

  $sidebar = $('.main .sidebar > ul');
  $content = $('.main .content');

  $('.main .sidebar')
    .on('click', 'a', function (event) {
      var url = event.target.href;
      $.ajax({
          url: url
        , dataType: 'json'
        })
        .success(function (res) { render(history, url, res); })
        .error(function () { console.log('error', arguments); })
        ;
      return false;
    });
});
