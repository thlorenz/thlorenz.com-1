define(['jquery', 'router', 'event-emitter'], function($, router, EventEmitter) {
  var self = this
    , emitter = new EventEmitter()
    , $navigation = $('article > nav')
    ;

  router.on('/stackoverflow', function () {
    console.log('linkto stackoverflow');
  });

  return emitter;
});
