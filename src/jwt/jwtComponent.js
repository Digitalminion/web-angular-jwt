(function(){
    'use strict';
    
    angular.module('authJwt')
           .directive('JwtComponent', 
            [
              JwtComponent
           ]);

     function JwtComponent() {
        return {
            bindings: {short: '<'},
            controller: function(){
                var self = this;



            }
        }
    }

})();