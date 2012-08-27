define(['jquery'], function($) {
  var sidebar     =  $('body > article > nav')
    , content     =  $('body > article > section')
    , sidebarList =  sidebar.find('ul')
    ;

  return {
      sidebar     :  sidebar
    , content     :  content
    , sidebarList :  sidebarList
  };
});
