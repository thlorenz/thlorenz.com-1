define(['jquery', 'router', 'event-emitter'], function($, router, EventEmitter) {
  var self = this
    , emitter = new EventEmitter()
    , $navigation = $('article > nav')
    ;

  router.on('/github', function () {
    console.log('linkto github');
  });

  return emitter;
});
