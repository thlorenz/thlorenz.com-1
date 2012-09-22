define(['jquery'], function($) {
  var sidebar     =  $($('.wrapper > nav:first'))
    , content     =  $($('.wrapper > section:first'))
    , sidebarList =  $(sidebar.find('ul:first'))
    ;

  return {
      sidebar     :  sidebar
    , content     :  content
    , sidebarList :  sidebarList
  };
});
