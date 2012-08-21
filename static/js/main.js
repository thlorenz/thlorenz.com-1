requirejs.config ({
    paths: {
        // 'jquery' : 'https://ajax.googleapis.com/ajax/libs/jquery/1.8.0/jquery.min'
      
        // using unminified version during development
        'jquery' : 'lib/jquery-1.8.0'
      , 'event-emitter': 'node_modules/eventemitter2'
    }
});

require( ['github-projects']);
