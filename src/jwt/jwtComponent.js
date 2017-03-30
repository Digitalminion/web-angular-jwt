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
                    function(d) {self.jwtmodel.hash = d.token;
                                self.loggedIn = true;},
                    function(d) {self.ErrorMessage = "Sorry, we didn't recognize the email or password you entered. Please try again."}
            )
            .finally(function (df) {$log.log('end of promise');});  
        }
    }
})();
