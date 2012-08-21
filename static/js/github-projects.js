define(['jquery', 'event-emitter'], function($, EventEmitter) {
  var self = this
    , emitter = new EventEmitter()
    , $navigation = $('article > nav')
    ;

  ee = emitter;
  //console.log(emitter.emit);
  setTimeout(function () { 
      emitter.emit('select', 'me'); 
    }
    , 1000);
  return { 
    on: function () { emitter.on.apply(emitter, arguments); }
  };
});
