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
                //    Create a deferred operation.
               var deferred = $q.defer();
                if(this.auth !== null) {
                //    Make sure we already have the token, if it has time left we can resolve the promise.
                    if(this._token !== null) {
                        if(this.ttl == 'valid') {
                            deferred.resolve(this._token);
                            return deferred.promise;
                        }
                    }
                    var req = {
                        method: 'PUT',
                        url: api.domain + this.modelUrl,
                        headers: {
                            'Authorization': 'JWT '+ this.auth
                        }
                    }    
                    $http(req).then(
                        function (response) {
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


