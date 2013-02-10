'use strict';

module.exports = function (app) {
  app.get('/github', function (req, res) {
    res.locals.sidebar = 'github_nav';
    res.locals.content = 'github_content';
    res.render('index');
  });
};
