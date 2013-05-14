'use strict';

module.exports = function sidebar(itemName) {
  return [ 
    {
      title: 'github'
    , url: '/projects/github'
    , active: itemName === 'github'
    }
  , {
      title: 'scriptie-talkie'
    , url: '/projects/scriptie_talkie'
    , active: itemName === 'scriptie-talkie'
    }
  , {
      title: 'doctoc'
    , url: '/projects/doctoc'
    , active: itemName === 'doctoc'
    }
  ];
};
