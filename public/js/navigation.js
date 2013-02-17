'use strict';
/*jshint browser:true*/

var $ = require('jquery')
  , $sidebar
  , $content
  , navigatedListeners = []
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

function handleNavigation (history, url) {
  $.ajax({
      url: url
    , dataType: 'json'
    })
    .success(function (res) { 
      render(history, url, res); 
      navigatedListeners.forEach(function (fn) {
        fn(url);  
      });
    })
    .error(function () { console.log('error', arguments); });

  return false;
}

exports.onnavigated = function (fn) {
  navigatedListeners.push(fn);
};

if (!browserSupportsHistoryApi(window.history)) return;

window.onpopstate = function (args) { 
  if (!args.state) return;
  update(args.state.sidebar, args.state.content);
};

$sidebar = $('.main .sidebar > ul');
$content = $('.main .content');

$('.main .sidebar')
  .on('click', 'a', function(event) { return handleNavigation(history, this.href, true); });
$('.main.nav')
  .on('click', 'a', function(event) { return handleNavigation(history, this.href, true); });
