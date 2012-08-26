requirejs.config ({
    shim: {  
      'handlebars': { exports: 'Handlebars' } 
    }
  , paths: {
      'jquery'               :  'lib/jquery-1.8.0'
      // 'jquery' : 'https://ajax.googleapis.com/ajax/libs/jquery/1.8.0/jquery.min'
    // ,  'underscore': '//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.3.3/underscore-min'
    
      // using unminified versions during development
    , 'underscore'           :  'node_modules/underscore'
    , 'director'             :  'lib/director-1.1.3'

    , 'handlebars'           :  'lib/handlebars.runtime'
    , 'event-emitter'        :  'node_modules/eventemitter2'
    }
});

require( 
  [ 'handlebars-templates' 
  , 'router'
  ]
);
