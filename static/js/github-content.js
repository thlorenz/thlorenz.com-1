require(['jquery', 'github-index'], function($, index) {
  index.events.on('select', function () {
    console.log(arguments);
  });
});
