(function(){
    'use strict';
      angular.module('authJwt', 
    [
    'ngRoute',
    'ngResource',
    'ngSanitize',
    'ngBase64'
    ])
    .value('api', {
      'domain':'',
      'authToken':'',
      'refreshToken': ''
    })
    .provider('JwtAuth', JwtAuthProvider());
    
    function JwtAuthProvider() {
      var token ,
          tokenArray = [],
          tokenHeader = {},
          tokenBody = {},
          tokenRoute = '',
          tokenRefreshRoute = '',
          self = this;

      /**
       * @name NulogProvider#debugEnabled
       * @description
       * @param {boolean=} flag enable or disable debug level messages
       * @returns {*} current value if used as getter or itself (chaining) if used as setter
       */
      this.setTokenRoute = function(route) {
        if (isDefined(route)) {
          tokenRoute = route;
          return this;
        } else {
          return tokenRoute;
        }
      };

      this.setTokenRefreshRoute = function(route) {
        if (isDefined(route)) {
          tokenRefreshRoute = route;
          return this;
        } else {
          return tokenRefreshRoute;
        }
      };

      this.$get = ['$http', '$q', 'base64', function(api,$http, $q, base64) {

        return {
            /**
            * @name JwtAuth#generate
            *
            * @description
            * Generate a fresh token using credentials
            */
            generate: generateToken(args),

            /**
            * @name JwtAuth#token
            *
            * @description
            * Returns a valid token or raises an error
            * auto-refreshes tokens about to expire
            */
            token: validateToken(),
            /**
            * @name JwtAuth#token
            *
            * @description
            * Returns a valid token or raises an error
            * auto-refreshes tokens about to expire
            */
            destroy: destroyToken()
        };

        function generateToken(data){
            //    Create a deferred operation.
           var deferred = $q.defer();
                //    Get the token from the server.
                $http.post(tokenRoute, {email: data.email, password: data.pass})
                .then(function(response) {
                    persistToken(response.data.token);
                    deferred.resolve(response.data.token);
                }, function(response) {
                    deferred.reject('response');
                });
            //    Now return the promise.
            return deferred.promise;
        };

        function validateToken(){
            var deferred = $q.defer();
            //    Make sure we already have the token, if it has time left we can resolve the promise.
            if(token !== null) {
                var ttlState = checkTokenTTL;
                if(ttlState == 'valid') {
                    deferred.resolve(token);
                }
                else if (ttlState == 'renew'){
                    //    Get the name from the server.
                    $http.post(tokenRefreshRoute, {token: token})
                    .then(function(response) {
                        persistToken(response.data.token);
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
        };

        function checkTokenTTL(){
            var current = ((new Date).getTime())/1000; 
            if ((current-tokenBody.exp) > 600){
                return 'expired'
            }else if((current-tokenBody.exp) > 450){
                return 'renew'    
            }
            else if((current-tokenBody.exp) < 450){
                return 'valid'
            }else{return 'expired'}
        }

        function persistToken(newToken){
            token = newToken;
            tokenArray = newToken.split('.');
            tokenHeader = JSON.parse(base64.decode(tokenArray[0]));
            tokenBody = JSON.parse(base64.decode(tokenArray[1]).replace(/[\u0000]/g, ''));  
        };

        function destroyToken(){
            token = '';
            tokenArray = [];
            tokenHeader = {};
            tokenBody = {};
            return 'complete'
        };
      }];
    }
})();