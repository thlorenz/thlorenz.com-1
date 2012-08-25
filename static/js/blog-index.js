define(['jquery', 'event-emitter'], function($, EventEmitter) {
  var self = this
    , emitter = new EventEmitter()
    , $navigation = $('article > nav')
    ;

  function init() {
    console.log('linkto blog');
  }

  return {
      init: init
    , events: emitter
  };
});
