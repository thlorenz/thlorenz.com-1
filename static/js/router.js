define(['director', 'event-emitter'], function (director, EventEmitter) { 
  var emitter = new EventEmitter()
    , routes = { 
        '*': function (resource) { emitter.emit('/' + resource); }
      }
    , router = window.Router(routes).init();

  return emitter;
});
