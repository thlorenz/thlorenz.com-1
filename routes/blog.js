var log = require('npmlog')
  , blog = require('../blog')
  ;


function get () {
  var req = this.req
    , res = this.res
    , maxAge = config().caching.maxAge.blog.index
    ;
  log.info('blog', 'Getting index');
  res.end();
}

function getPost(post) {
  var req = this.req
    , res = this.res
    , maxAge = config().caching.maxAge.blog.post
    ;

  log.info('blog', 'Getting post', post);
  res.end();
}

module.exports = {
    get     :  get
  , getPost :  getPost
};

