require(['jquery', 'github-index'], function($, index) {
  index.on('select', function () {
    console.log(arguments);
  });
});
