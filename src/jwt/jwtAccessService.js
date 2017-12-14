(function(){
  'use strict';
  angular.module('authJwt')
         .service('JwtAccessService', ['api','$http', '$q', '$log','base64', JwtAccessService]);

  /**
   * JWT Request Service
   * 
   *
   * @returns {{JwtAccessService: object}
   * @constructor
   */      
    function JwtAccessService(api,$http, $q, $log, base64){
      var JwtAccessService = class{
            constructor(){
                this._token = null;
                this._array = [];
                this.header = {};
                this.body = {};
                this.auth = null;
                this.modelUrl = null;
                
            }
          
            token(self = this){
               var deferred = $q.defer();
                if(self.auth !== null) {
                    //  See if we already have the token.
                    if(self._token !== null) {
                        // See if token has time left we can resolve the promise.
                        if(self.ttl == 'valid') {
                            deferred.resolve(self._token);
                            return deferred.promise;
                        }
                    }   
                    $http({
                        method: 'PUT',
                        url: api.domain + self.modelUrl,
                        headers: {
                            'Authorization': 'JWT '+ self.auth
                        }
                    }).then(
                        function (response) {
                            $log.log(response)
                            self.persist(response.data.token);
                            deferred.resolve(response.data.token);}, 
                        function(response) {
                            deferred.reject(response);
                    });
                }else{ 
                    deferred.reject('No Auth Ticket');
                }
                //    Now return the promise.
                return deferred.promise;
            }

            ttl(self = this){
                var current = ((new Date).getTime())/1000; 
                if ((current-self.body.exp) > 600){
                    return 'expired'
                }else if((current-self.body.exp) > 450){
                    return 'renew'    
                }
                else if((current-self.body.exp) < 450){
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
      return JwtAccessService;
  }

})();


