define(['jquery'], function($) {
  var sidebar     =  $('body > nav')
    , content     =  $('body > section')
    , sidebarList =  sidebar.find('ul')
    ;

  return {
      sidebar     :  sidebar
    , content     :  content
    , sidebarList :  sidebarList
  };
});
