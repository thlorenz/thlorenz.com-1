'use strict';

var send = require('../send');

function sidebar(itemName) {
  return [ 
    {
      title: 'about me'
    , url: '/about/me'
    , active: itemName === 'me'
    }
  ];
}

module.exports = function (app) {
  app
    .get('/about', function (req, res) {
      var goto = 'about/me';
      res.location(goto);
      res.redirect(goto);
    })
    .get('/about/:what', function (req, res) {
      var what = req.params.what
        , model = { sidebar: sidebar(what), about: true };
      send(req, res, model, 'about_nav', 'about_' + what);
    })
    ;
};
