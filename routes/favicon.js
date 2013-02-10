'use strict';

module.exports = function (app) {
  app.get('/favicon.ico', function (req, res) {
    res.redirect('/img/favicon.ico');
  });
};
