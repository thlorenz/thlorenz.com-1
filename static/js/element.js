define(['jquery'], function($) {
  var sidebar     =  $($('.wrapper > nav:first'))
    , content     =  $($('.wrapper > section > div.content:first'))
    , disqus      =  $($('.wrapper > section > div.disqus:first'))
    , sidebarList =  $(sidebar.find('ul:first'))
    ;

  return {
      sidebar     :  sidebar
    , content     :  content
    , disqus      :  disqus
    , sidebarList :  sidebarList
  };
});
