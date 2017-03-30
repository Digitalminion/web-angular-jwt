(function(){
  'use strict';
  angular.module('authJwt')
         .service('JwtService', ['apiDomain','apiAuthTokenUrl','apiAuthTokenRefreshUrl','$http', '$q', '$log','base64', JwtService]);

  /**
   * JWT Request Service
   * 
   *
   * @returns {{jwtAuthService: object}
   * @constructor
   */
//  function JwtService(apiDomain,apiAuthTokenUrl,apiAuthTokenRefreshUrl,$http, $q, $log){
//      var JwtService = function(){
//        var self = this;
//        self.token = function(email, pass) {
//            var promise = $http.post(apiDomain + apiAuthTokenUrl, {email: email, password: pass}).then(function (response) {
//                return response.data;  
//            });
//            return promise;
//        };
//        self.token_refresh = function(token) {
//            var promise = $http.post(apiDomain + apiAuthTokenRefreshUrl, {token: token}).then(function (response) {
//                return response.data;
//            });
//            return promise;
//        };
//        self.init = function(){};
//    	return self.init();
//      }
//      return JwtService;
//  }
    
      
    function JwtService(apiDomain,apiAuthTokenUrl,apiAuthTokenRefreshUrl,$http, $q, $log, base64){
      var JwtService = class{
            constructor(){
                this._token = null;
                this._array = [];
                this.header = {};
                this.body = {};
            }

            login(login){
                //    Create a deferred operation.
               var deferred = $q.defer();
                    //    Get the token from the server.
                    $http.post(apiDomain + apiAuthTokenUrl, {email: login.email, password: login.pass})
                    .then(function(response) {
                        deferred.resolve(response.data.token);
                    }, function(response) {
                        deferred.reject(response);
                    });
                //    Now return the promise.
                return deferred.promise;
            }

            get token(){
                //    Create a deferred operation.
               var deferred = $q.defer();
                //    Make sure we already have the token, if it has time left we can resolve the promise.
                if(this._token !== null) {
                    $log.log(this.ttl)
                    if(this.ttl == 'valid') {
                        deferred.resolve(this._token);
                    }
                    else if (this.ttl == 'renew'){
                        //    Get the name from the server.
                        $http.post(apiDomain + apiAuthTokenRefreshUrl, {token: _token})
                        .then(function(response) {
                            deferred.resolve(response.data.token);
                        }, function(response) {
                            deferred.reject(response);
                        });
                    }else {
                        deferred.reject('expired');
                    }   
                } else {
                        deferred.reject('expired');
                }
                //    Now return the promise.
                return deferred.promise;
            }

            get ttl(){
                var current = ((new Date).getTime())/1000; 
                if ((current-this.body.exp) > 600){
                    return 'expired'
                }else if((current-this.body.exp) > 450){
                    return 'renew'    
                }
                else if((current-this.body.exp) < 450){
                    return 'valid'
                }else{return 'expired'}
            }
            set values(token){
                this._token = token;
                this._array = token.split('.');
                this.header = JSON.parse(base64.decode(this._array[0]));
                this.body = JSON.parse(base64.decode(this._array[1]).replace(/[\u0000]/g, ''));  
            }
      }
      return JwtService;
  }

})();