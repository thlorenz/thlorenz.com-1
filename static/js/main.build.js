requirejs.config ({
  // requirejs likes to see me repeat myself, so we have to tell it where to get these here as well
  // although we already did so in the requirejs.js-config
    shim: {  
      'handlebars': { exports: 'Handlebars' } 
    , 'underscore': { exports: '_' }
    }
  , paths: {
      'jquery'     :  '//ajax.googleapis.com/ajax/libs/jquery/1.8.0/jquery.min'
    , 'underscore' :  '//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.3.3/underscore-min'
    }
});

require( 
  [ 'handlebars-templates' 
  , 'router'
  ]
);
