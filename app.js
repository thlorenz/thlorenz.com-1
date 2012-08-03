var http = require('http')
  , director = require('director')
  , routes = require('./routes')
  ;

var router = new director.http.Router({
    '/': {
