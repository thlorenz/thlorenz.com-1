requirejs.config ({
    shim: {  
        'handlebars': { exports: 'Handlebars' } 
      , 'underscore': { exports: '_' }
    }
  , paths: {
      'jquery'               :  'lib/jquery-1.8.0'
    , 'underscore'           :  'node_modules/underscore'
    , 'director'             :  'lib/director-1.1.3'
    , 'handlebars'           :  'lib/handlebars.runtime'
    }
});

require( 
  [ 'handlebars-templates' 
  , 'router'
  ]
);
