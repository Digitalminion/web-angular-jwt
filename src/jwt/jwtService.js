(function(){
  'use strict';

  angular.module('ngJwt')
         .service('JwtService', ['$q', JwtServic]);

  /**
   * About DataService
   * Uses embedded, hard-coded data model; acts asynchronously to simulate
   * remote data service call(s).
   *
   * @returns {{loadContent: Function}}
   * @constructor
   */
  function JwtServic($q){
    var data = {
      title: '',
      description: ''
    };

    // Promise-based API
    return {
      loadContent : function() {
        // Simulate async nature of real remote calls
        return $q.when(data);
      }
    };
  }

})();