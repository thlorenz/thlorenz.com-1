var viewResolver = require('../viewResolver');

function index (route) {
  this.res.writeHead(200, { 'Content-Type': 'text/html' });
  this.res.end(viewResolver.resolve('index', null));
}

module.exports = {
  index: index
};
