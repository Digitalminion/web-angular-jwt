(function(){
  'use strict';
  angular.module('authJwt')
         .service('JwtAuthService', ['api','$http', '$q', '$log','base64', JwtAuthService]);

  /**
   * JWT Request Service
   * 
   *
   * @returns {{jwtAuthService: object}
   * @constructor
   */      
    function JwtAuthService(api,$http, $q, $log, base64){
      var JwtAuthService = class{
            constructor(){
                this._token = null;
                this._array = [];
                this.header = {};
                this.body = {};
            }

            generate(data){
                //    Create a deferred operation.
               var deferred = $q.defer();
                    //    Get the token from the server.
                    $http.post(api.domain + api.authToken, {email: data.email, password: data.pass})
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
                        $http.post(api.domain + api.refreshToken, {token: _token})
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
          
            set persist(token){
                this._token = token;
                this._array = token.split('.');
                this.header = JSON.parse(base64.decode(this._array[0]));
                this.body = JSON.parse(base64.decode(this._array[1]).replace(/[\u0000]/g, ''));  
            }

      }
      return JwtAuthService;
  }

})();


