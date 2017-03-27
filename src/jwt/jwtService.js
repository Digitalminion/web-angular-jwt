(function(){
  'use strict';

  angular.module('ngJwt')
         .service('JwtService', ['$q', JwtService]);

  /**
   * JWT Request Service
   * Uses embedded, hard-coded data model; acts asynchronously to simulate
   * remote data service call(s).
   *
   * @returns {{loadContent: Function}}
   * @constructor
   */
  function JwtService($http, $cookies, $q, $log){
    var jwtAuthService = {
	get_auth_token: function(email, pass) {
      var promise = $http.post(apiDomain + apiAuthTokenUrl, {email: email, password: pass}).then(function (response) {
        delete $http.defaults.headers.common.Authorization;
        $cookies.put('token', response.data["token"]);
        $http.defaults.headers.common.Authorization = 'JWT ' + response.data["token"];
        return response.data;
      });
      return promise;
    },
	get_auth_token_refresh: function(token) {
      var promise = $http.post(apiDomain + apiAuthTokenRefreshUrl, {token: token}).then(function (response) {
        delete $http.defaults.headers.common.Authorization;
        $cookies.put('token', response.data["token"]);
        $http.defaults.headers.common.Authorization = 'JWT ' + response.data["token"];
        return response.data;
      });
      return promise;
    },
  };
  return jwtAuthService;
  }

})();