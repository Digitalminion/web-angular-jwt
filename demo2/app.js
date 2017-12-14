'use strict';
var testApp = angular.module('testApp',
[
    'authJwt','content-mocks', 'nuLog'
])
    .value('api', {
      'domain':'/api/v1',
      'authToken':'/auth/token/',
      'refreshToken': '/auth/refresh/'
  })
    .config(['JwtAuthProvider', function (JwtAuthProvider) {
        JwtAuthProvider.setTokenRoute('/api/v1/auth/token/')
        JwtAuthProvider.setTokenRefreshRoute('/api/v1/auth/refresh/')    
    }])


    .component('jwtComponent', {
                controller: JwtController,
                controllerAs: 'auth',
                templateUrl:'auth.partual.html'
                })  



    function JwtController($log, Auth){
        var self = this;  
        self.forumsApi.modelUrl = '/forum/auth/topics/'
        self.login = function(email, password){ 
            Auth.generate({email: self.email, pass: self.password})
                .then(
                        function(token) {
                                    self.Message = "You have saved a token!"
                                    return token;},
                        function(token) {self.Message = "Sorry, we didn't recognize the email or password you entered. Please try again."}
                )
                .then(function (token) {$log.log('end of promise');})  
        }
        
        self.check = function(){ 
            self.jwtservice.token().then(
                    function(token) {
                                self.Message = "Your token still works"
                                return token;},
                    function(token) {self.Message = "Sorry, the session has expired"}
            );  
        }
    //        self.trials = function(){ 
    //            self.jwtservice.token().then(
    //                function(token) {
    //                    self.forumsApi.auth = token;
    //                    return self.forumsApi.token()}
    //            ).then(
    //                function(token) {
    //                            self.Message = "You have saved a trial token!"
    //                            return token;},
    //                function(token) {self.Message = "Couldn't pull a trial"}
    //            ).then(function (token) {$log.log('end of promise');})
    //
    //        }
    };
