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

// Little hacky, but prevents duplication of config

// when called by requirejs during optimize
if (typeof requirejs !== 'undefined' && typeof requirejs.config === 'function') {
  requirejs.config (config);

  require( 
    [ 'handlebars-templates' 
    , 'router'
    ]
  );
}

// when called by our own requirejs module in order to retrieve config
if (module && module.exports) {
  module.exports.config = config;
}
