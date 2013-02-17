'use strict';

var compilePartial = require('../views/utils/compile-partial');

function json(model, sidebarTmpl, contentTmpl) {
  var data = {};
  if (sidebarTmpl && model.sidebar) data.sidebar = compilePartial(sidebarTmpl)(model.sidebar);
  if (contentTmpl && model.content) data.content = compilePartial(contentTmpl)(model.content);
  return data;
}

module.exports = function sendJson(res, model, sidebarTmpl, contentTmpl) {
  // Disable cache here in order to prevent browser from serving JSON as the page
  // This happens when navigating away from the site and returning via the back button
  res.set({
      Expires         :  'Mon, 1 Jan 2001 00:01:00 GMT'
    , Pragma          :  'no-cache'
    , 'Cache-Control' :  'no-store, no-cache, must-revalidate, post-check=0, pre-check=0'
  });
  res.json(json(model, sidebarTmpl, contentTmpl));
};
