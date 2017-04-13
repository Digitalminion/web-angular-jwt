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
          
            get token(){
               var deferred = $q.defer();
                if(this.auth !== null) {
                    //  See if we already have the token.
                    if(this._token !== null) {
                        // See if token has time left we can resolve the promise.
                        if(this.ttl == 'valid') {
                            deferred.resolve(this._token);
                            return deferred.promise;
                        }
                    }   
                    $http({
                        method: 'PUT',
                        url: api.domain + this.modelUrl,
                        headers: {
                            'Authorization': 'JWT '+ this.auth
                        }
                    }).then(
                        function (response) {
                            this.persist = response.data.token
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
      return JwtAccessService;
  }

})();


