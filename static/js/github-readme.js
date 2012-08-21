require(['jquery', 'github-projects'], function($, projects) {
  projects.on('select', function () {
    console.log(arguments);
  });
});
