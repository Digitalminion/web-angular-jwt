(function() {
    'use strict';
    /**
     * This module is used to simulate backend server for this demo application.
     */
    angular.module('content-mocks',['ngMockE2E','ngBase64'])
        .run(function ($httpBackend, $log, base64) {
            var password = 'you shall pass'
            var email = 'demo@digitalminion.com'
            var token = {
                header: '{"typ":"JWT","alg":"HS256"}',
                body: {"email": email, "exp":'', "orig_ist":''},
                content: {"email": email, "refnum": [1,2,3,4,5,6,7,8], "exp":''},
                cert: 'Ga81pu6dK5NrzfFHG1thKV_L_3mndpKuyi5UI87KLCc'
            }
            var auth = '';
            var contentAuth = '';
            function generate(){
                auth = base64.encode(token.header)+'.'+base64.encode(JSON.stringify(token.body))+'.'+token.cert
                return auth;
            };
            function request(){
                var epoch = (((new Date).getTime())/1000) + 1800
                token.body.exp = epoch
                token.body.orig_ist = epoch
                return generate()
            };
            function refreash(){
                var epoch = (((new Date).getTime())/1000) + 1800
                token.body.exp = epoch
                return generate()
            };
            function content(){
                var epoch = (((new Date).getTime())/1000) + 1800
                token.content.exp = epoch
                contentAuth = base64.encode(token.header)+'.'+base64.encode(JSON.stringify(token.content))+'.'+token.cert
                return contentAuth
            };
            
                $httpBackend.whenPOST('/api/v1/auth/token/')
                    .respond(function(method, url, data, headers, params) {
                    var output = JSON.parse(data)
                    $log.log(output);
                    if (output.email == email){
                        if(output.password == password){
                            return [200, {token: request()}];
                        }
                    }
                    return [400];

                });

                $httpBackend.whenPOST('/api/v1/auth/refresh/')
                    .respond(function(method, url, data, headers, params) {
                    $log.log(headers);
                    if(headers.Authorization == 'JWT '+ auth){
                        return [200, {token: refresh()}];
                    }
                    return [400]

                });

                $httpBackend.whenPUT('/api/v1/forum/auth/topics/')
                    .respond(function(method, url, data, headers, params) {
                    $log.log(headers);
                    if(headers.Authorization == 'JWT '+ auth){
                        return [200, {token: content()}];
                    }
                    return [400]

                });

                //otherwise
                $httpBackend.whenGET(/*\/\.*/).passThrough();

        });
})();