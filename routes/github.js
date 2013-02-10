'use strict';

module.exports = function (app) {
  app.get('/github', function (req, res) {
    res.locals.model.github = { };
    res.render('index');
  });
};
