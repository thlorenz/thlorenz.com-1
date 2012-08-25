requirejs.config ({
    shim: {  'handlebars': { exports: 'Handlebars' } }
  , paths: {
      // 'jquery' : 'https://ajax.googleapis.com/ajax/libs/jquery/1.8.0/jquery.min'
    
      // using unminified versions during development
      'jquery'               :  'lib/jquery-1.8.0'
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
