var requirejs =  require('requirejs')
  , fs        =  require('fs')
  , log       =  require('npmlog');

var config = {
      baseUrl: './static/js'
    , name: 'main.build'
    , out: './static/js/main.built.js'
    , shim: {  
        'handlebars': { exports: 'Handlebars' } 
      , 'underscore': { exports: '_' }
    }
    , paths: {
        'jquery'     :  '//ajax.googleapis.com/ajax/libs/jquery/1.8.0/jquery.min'
      , 'underscore' :  '//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.3.3/underscore-min'
      , 'director'   :  'lib/director-1.1.3'
      , 'handlebars' :  'lib/handlebars.runtime'
      }
};

requirejs.optimize(config, function (res) {
  log.info('requirejs', res);
  //var contents = fs.readFileSync(config.out, 'utf8');
});
