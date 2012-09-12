define(['jquery'], function($) {
  var sidebar     =  $('.sidebar > nav')
    , content     =  $('body > article > section')
    , sidebarList =  sidebar.find('ul')
    ;

  return {
      sidebar     :  sidebar
    , content     :  content
    , sidebarList :  sidebarList
  };
});
