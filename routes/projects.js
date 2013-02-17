'use strict';

var send = require('../send')  
  , getRepos = require('../github/get-repos');


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
    .get('/projects/github', function (req, res) {
      getRepos(function (err, repos) {
        if (err) return send(req, res, { sidebar: sidebar('github') }, 'projects_nav', 'error');
        var model = { sidebar: sidebar('github'), content: repos };
        send(req, res, model, 'projects_nav', 'projects_github');
      });
    })
    .get('/projects/:projectName', function (req, res) {
      var projectName = req.params.projectName
        , model = { sidebar: sidebar(projectName) };
      send(req, res, model, 'projects_nav', 'projects_' + projectName);
    })
    ;
};
