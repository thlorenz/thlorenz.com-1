requirejs.config ({
    paths: {
        // 'jquery' : 'https://ajax.googleapis.com/ajax/libs/jquery/1.8.0/jquery.min'
      
        // About 200ms faster than getting it from cdn
        'jquery' : 'lib/jquery-1.8.0'
    }
});

require( ['github-projects']);
