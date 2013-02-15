'use strict';

var send = require('../send');

module.exports = function (app) {
  app
    .get('/about', function (req, res) {
      res.redirect('about/me');
    })
    .get('/about/me', function (req, res) {
      send(req, res, null, 'about_nav', 'about_me');
    });
};
