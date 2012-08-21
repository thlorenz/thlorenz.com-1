requirejs.config ({
    paths: {
        // 'jquery' : 'https://ajax.googleapis.com/ajax/libs/jquery/1.8.0/jquery.min'
      
        // using unminified versions during development
        'jquery' : 'lib/jquery-1.8.0'
      , 'director': 'lib/director-1.1.3'

      , 'event-emitter': 'node_modules/eventemitter2'
    }
});

require( 
  [ 'github-index'
  , 'github-content'
  , 'blog-index'
  , 'stackoverflow-index'
  , 'contact-index'
  ]
);
