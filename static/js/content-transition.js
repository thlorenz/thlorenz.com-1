define(['jquery', 'element'], function($, el) {
  var $currentContent;

  var self = {
      _$currentContent: null

    , init: function (linkSelector) {

        el.sidebar.on('click', linkSelector, function () {
            $('html, body').animate({scrollTop: 0}, 200);
        });
      }
    , show: function (html) {
        if (self._$currentContent) 
          self._$currentContent
            .clearQueue()
            .fadeOut(200);

        self._$currentContent = $(html);
        self._$currentContent.hide();

        el.content
          .empty()
          .append(self._$currentContent);

        self._$currentContent.fadeIn(500);
      }
    , hide: function hide () {
        if (self._$currentContent) 
          self._$currentContent
            .clearQueue()
            .fadeOut(1000);
      }
  };

  return self;
});
