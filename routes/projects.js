'use strict';

var send = require('../send');

function sidebar(itemName) {
  return [ 
    {
      title: 'github'
    , url: '/projects/github'
    , active: itemName === 'github'
    }
  , {
      title: 'doctoc'
    , url: '/projects/doctoc'
    , active: itemName === 'doctoc'
    }
  ];
}

module.exports = function (app) {
  app
    .get('/projects', function (req, res) {
      var goto = '/projects/github';
      res.location(goto);
      res.redirect(goto);
    })
    .get('/projects/:projectName', function (req, res) {
      var projectName = req.params.projectName
        , model = { sidebar: sidebar(projectName) };
      send(req, res, model, 'projects_nav', 'projects_' + projectName);
    })
    ;
};
