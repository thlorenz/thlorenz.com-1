'use strict';

var send     =  require('../send')
  , getRepos =  require('../github/get-repos')
  , sidebar  =  require('./projects-sidebar');


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

        var model = { sidebar: sidebar('github'), content: repos, projects: true };
        send(req, res, model, 'projects_nav', 'projects_github');
      });
    })
    .get('/projects/:projectName', function (req, res) {
      var projectName = req.params.projectName
        , model = { sidebar: sidebar(projectName), projects: true };
      send(req, res, model, 'projects_nav', 'projects_' + projectName);
    })
    ;
};
