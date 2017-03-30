(function(){
  'use strict';
  angular.module('authJwt')
         .service('JwtService', ['apiDomain','apiAuthTokenUrl','apiAuthTokenRefreshUrl','$http', '$q', '$log', JwtService]);

  /**
   * JWT Request Service
   * 
   *
   * @returns {{jwtAuthService: object}
   * @constructor
   */
  function JwtService(apiDomain,apiAuthTokenUrl,apiAuthTokenRefreshUrl,$http, $q, $log){
      var JwtService = function(){
        var self = this;
        self.token = function(email, pass) {
            var promise = $http.post(apiDomain + apiAuthTokenUrl, {email: email, password: pass}).then(function (response) {
                return response.data;  
            });
            return promise;
        };
        self.token_refresh = function(token) {
            var promise = $http.post(apiDomain + apiAuthTokenRefreshUrl, {token: token}).then(function (response) {
                return response.data;
            });
            return promise;
        };
        self.init = function(){};
    	return self.init();
      }
      return JwtService;
  }