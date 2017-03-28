(function(){
  'use strict';

  angular.module('authJwt')
         .factory('JwtModel', ['$log','base64', JwtModel])
  /**
   * JWT Model
   * 
   *
   * @returns {{jwtModel: object}
   * @constructor
   */

    function JwtModel($log, base64){
        var JwtModel = function(){
            var self = this
            self._token = '';
            self._array = '';
            self.header = {
                get : function(){
                   return self._token.toString().split('.', 1);}
            };
            self.body = {
                get : function(){
                    return base64.decode(self._array[1]);}
            };
            self.token = {
                get : function(){return self._token},
                set : function(value){
                    self._token = value;
                    self._array = value.split('.', 2);
                }
            };

            // Call the initialize function for every new instance
            self.init = function () {};
            return self.init
        }
        return JwtModel;
    }
    
})();

