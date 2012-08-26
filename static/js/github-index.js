define(['jquery', 'event-emitter'], function($, EventEmitter) {
  var self = this
    , emitter = new EventEmitter()
    , $navigation = $('article > nav')
    , repos
    ;

  function init() {
    console.log('linkto github');
    $.ajax({
      url: 'github/index'
    })
    .error(function (err) {
      console.log('Error ', err);  
    })
    .success(function (data) {
      console.log(data);
    });
  }

  return {
      init: init
    , events: emitter
  };
});
