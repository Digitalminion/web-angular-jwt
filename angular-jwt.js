
(function(){
  'use strict';

  // Prepare the 'ngJwt' module for subsequent registration of controllers and delegates
  angular.module('authJwt', 
    [
    'ngRoute',
    'ngResource',
    'ngSanitize',
    'ngBase64'
    ])
    .value('apiDomain', '')
    .value('apiAuthTokenUrl', '')
    .value('apiAuthTokenRefreshUrl', '');


})();
(function(){
    'use strict';
    
    angular.module('authJwt')
           .component('jwtComponent', {
                bindings: {email: '<', password: '<'},
                controller: JwtController,
                controllerAs: 'auth',
                template:'<div> <alert> <strong>{{ auth.ErrorMessage }}</strong></alert></div><div><button ng-click="auth.login(auth.email,auth.password)">Sign in</button></div>'
                });
    
    function JwtController($log, JwtModel, JwtService){
        var self = this;
        self.jwtservice = new JwtService();
        self.jwtmodel = JwtModel;
        self.login = function(email, password){
            self.jwtservice.token(email, password)
            .then(
                    function(d) {self.jwtmodel.hash = d.token;},
                    function(d) {self.ErrorMessage = "Sorry, we didn't recognize the email or password you entered. Please try again."}
            )
            .then(
                    function(d) {$log.log(self.jwtmodel.body);}
            )
            .finally(function (df) {$log.log('end of promise');});;  
        }
    }
})();

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


(function(){
  'use strict';
  angular.module('authJwt')
         .service('JwtService', ['apiDomain','apiAuthTokenUrl','apiAuthTokenRefreshUrl','$http', '$q', '$log', JwtService]);

  /**
   * JWT Request Service
   * 
   *
   * @returns {{jwtAuthService: object}
   * @constructor
   */
  function JwtService(apiDomain,apiAuthTokenUrl,apiAuthTokenRefreshUrl,$http, $q, $log){
      var JwtService = function(){
        var self = this;
        self.token = function(email, pass) {
            var promise = $http.post(apiDomain + apiAuthTokenUrl, {email: email, password: pass}).then(function (response) {
                $log.log(response)
                return response.data;  
            });
            return promise;
        };
        self.token_refresh = function(token) {
            var promise = $http.post(apiDomain + apiAuthTokenRefreshUrl, {token: token}).then(function (response) {
                return response.data;
            });
            return promise;
        };
        self.init = function(){};
    	return self.init();
      }
      return JwtService;
  }

})();