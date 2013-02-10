'use strict';

module.exports = function (app) {
  app.get('/about', function (req, res) {
    res.locals.model.about = {};
    res.render('index');
  });
};
