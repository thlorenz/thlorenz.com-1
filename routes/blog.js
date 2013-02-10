'use strict';

module.exports = function (app) {
  app.get('/blog', function (req, res) {
    res.locals.sidebar = 'blog_nav';
    res.locals.content = 'blog_content';
    res.render('index');
  });
};
