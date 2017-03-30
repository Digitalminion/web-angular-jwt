(function(){
    'use strict';
    
    angular.module('authJwt')
           .component('jwtComponent', {
                bindings: {email: '<', password: '<'},
                controller: JwtController,
                controllerAs: 'auth',
                template:'<div> <alert> <strong>{{ auth.Message }}</strong></alert></div><div><button ng-click="auth.login(auth.email,auth.password)">Sign in</button></div><div><button ng-click="auth.check()">Check Session</button></div>'
                });

    function JwtController($log, JwtModel, JwtService){
        var self = this;
        self.jwtservice = new JwtService();
        self.login = function(email, password){ 
            self.jwtservice.login({email: email, pass: password})
                .then(
                        function(token) {
                                    self.jwtservice.values = token;
                                    self.Message = "You have saved a token!"
                                    return token;},
                        function(token) {self.Message = "Sorry, we didn't recognize the email or password you entered. Please try again."}
                )
                .then(function (token) {$log.log('end of promise');})  
        }
        
        self.check = function(){ 
            self.jwtservice.token.then(
                    function(token) {
                                self.jwtservice.values = token;
                                self.Message = "Your token still works"
                                return token;},
                    function(token) {
                        self.Message = "Sorry, the session has expired"}
            );  
        }
    }
})();
