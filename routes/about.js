'use strict';

var send = require('../send');

function sidebar(itemName) {
  return [ 
    {
      title: 'projects'
    , url: '/about/projects'
    , active: itemName === 'projects'
    }
  , {
      title: 'about me'
    , url: '/about/me'
    , active: itemName === 'me'
    }
  ];
}

module.exports = function (app) {
  app
    .get('/about', function (req, res) {
      res.redirect('about/projects');
    })
    .get('/about/projects', function (req, res) {
      var model = { sidebar: sidebar('projects') };
      send(req, res, model, 'about_nav', 'about_projects');
    })
    .get('/about/me', function (req, res) {
      var model = { sidebar: sidebar('me') };
      send(req, res, model, 'about_nav', 'about_me');
    })
    ;
};
