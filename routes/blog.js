'use strict';

module.exports = function (app) {
  app.get('/blog', function (req, res) {
    res.locals.model.blog = { };
    res.render('index');
  });
};
