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
            var JwtModel = {
                _token : '',
                _array : '',
                get hash(){return this._token},
                set hash(value){
                    this._token = value;
                    this._array = value.split('.');
                },
                get header(){return base64.decode(this._array[0]);},
                get body(){return base64.decode(this._array[1]);}
            };
            return JwtModel
    }
    
})();

