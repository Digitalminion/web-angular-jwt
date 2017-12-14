(function(){
  'use strict';
  angular.module('authJwt')
         .service('JwtAuthService', ['api','$http', '$q', 'base64', JwtAuthService]);

  /**
   * JWT Request Service
   * 
   *
   * @returns {{jwtAuthService: object}
   * @constructor
   */      
    function JwtAuthService(api,$http, $q, base64){
      var JwtAuthService = class{
            constructor(){
                this._token = null;
                this._array = [];
                this.header = {};
                this.body = {};
            }

            generate(data, self = this){
                //    Create a deferred operation.
               var deferred = $q.defer();
                    //    Get the token from the server.
                    $http.post(api.domain + api.authToken, {email: data.email, password: data.pass})
                    .then(function(response) {
                        self.persist(response.data.token);
                        deferred.resolve(response.data.token);
                    }, function(response) {
                        deferred.reject(response);
                    });
                //    Now return the promise.
                return deferred.promise;
            }

            token(self = this){
                //    Create a deferred operation.
               var deferred = $q.defer();
                //    Make sure we already have the token, if it has time left we can resolve the promise.
                if(self._token !== null) {
                    if(self.ttl == 'valid') {
                        deferred.resolve(self._token);
                    }
                    else if (this.ttl == 'renew'){
                        //    Get the name from the server.
                        $http.post(api.domain + api.refreshToken, {token: _token})
                        .then(function(response) {
                            self.persist(response.data.token);
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
          
            persist(token, self = this){
                self._token = token;
                self._array = token.split('.');
                self.header = JSON.parse(base64.decode(self._array[0]));
                self.body = JSON.parse(base64.decode(self._array[1]).replace(/[\u0000]/g, ''));  
            }

      }
      return JwtAuthService;
  }

})();


