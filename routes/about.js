'use strict';

module.exports = function (app) {
  app.get('/about', function (req, res) {
    res.locals.sidebar = 'about_nav';
    res.locals.content = 'about_content';
    res.render('index');
  });
};
