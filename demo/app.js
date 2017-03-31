testApp.controller('AppCtrl', ['$log', AppController])
    .component('jwtComponent', {
                bindings: {email: '<', password: '<'},
                controller: JwtController,
                controllerAs: 'auth',
                template:'<div> <alert> <strong>{{ auth.Message }}</strong></alert></div><div><button ng-click="auth.login(auth.email,auth.password)">Sign in</button></div><div><button ng-click="auth.check()">Check Session</button></div><div><button ng-click="auth.trials()">Check Trials</button></div>'
                });

    function JwtController($log, JwtAccessService, JwtAuthService){
        var self = this;
        self.jwtservice = new JwtAuthService();
        self.trialsApi = new JwtAccessService();  
        self.contentApi = new JwtAccessService();  
        self.trialsApi.modelUrl = '/forum/auth/topics/'
        self.login = function(email, password){ 
            self.jwtservice.generate({email: email, pass: password})
                .then(
                        function(token) {
                                    self.jwtservice.persist = token;
                                    self.Message = "You have saved a token!"
                                    return token;},
                        function(token) {self.Message = "Sorry, we didn't recognize the email or password you entered. Please try again."}
                )
                .then(function (token) {$log.log('end of promise');})  
        }
        
        self.check = function(){ 
            self.jwtservice.token.then(
                    function(token) {
                                self.jwtservice.persist = token;
                                self.Message = "Your token still works"
                                return token;},
                    function(token) {self.Message = "Sorry, the session has expired"}
            );  
        }
        self.trials = function(){ 
            self.jwtservice.token.then(
                function(token) {
                    self.jwtservice.persist = token;
                    self.trialsApi.auth = token;
                    return self.trialsApi.token}
            ).then(
                function(token) {
                            self.trialsApi.persist = token;
                            self.Message = "You have saved a trial token!"
                            $log.log(self.trialsApi.body.trial);
                            return token;},
                function(token) {self.Message = "Couldn't pull a trial"}
            ).then(function (token) {$log.log('end of promise');})

        }
    };

    function  AppController($log){
        $log.log('controller running')
    };

