define(['jquery', 'router', 'event-emitter'], function($, router, EventEmitter) {
  var self = this
    , emitter = new EventEmitter()
    , $navigation = $('article > nav')
    ;

  router.on('/contact', function () {
    console.log('linkto contact');
  });

  return emitter;
});
