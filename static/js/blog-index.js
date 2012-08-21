define(['jquery', 'router', 'event-emitter'], function($, router, EventEmitter) {
  var self = this
    , emitter = new EventEmitter()
    , $navigation = $('article > nav')
    ;

  router.on('/blog', function () {
    console.log('linkto blog');
  });

  return emitter;
});
