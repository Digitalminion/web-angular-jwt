'use strict';
angular.module('authJwt')
.value('apiDomain', 'http://localhost')
.value('apiAuthTokenUrl', '/auth/token/')
.value('apiAuthTokenRefreshUrl', '/auth/refresh/');

var testHash = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImplcmVteUBkaWdpdGFsbWluaW9uLmNvbSIsInVzZXJuYW1lIjoiYWRtaW4iLCJleHAiOjE0OTA4Mjg5MzQsInVzZXJfaWQiOjEsIm9yaWdfaWF0IjoxNDkwODI3MTM0fQ.Ga81pu6dK5NrzfFHG1thKV_L_3mndpKuyi5UI87KLCc";

beforeEach(module('authJwt'));


describe('JWT Model', function() {
    var JwtModel;
    
    beforeEach(inject(function(_JwtModel_) {
        JwtModel = _JwtModel_;
        JwtModel.hash = testHash;
    }));
    
    it('should save the token hash', function() {           expect(JwtModel.hash).to.equal(testHash);
    });

    it('should decode the encoded body section', function() {
    expect(JwtModel.body).to.equal('{"email":"jeremy@digitalminion.com","username":"admin","exp":1490828934,"user_id":1,"orig_iat":1490827134}\u0000\u0000'); 
    });
    
    it('should decode the encoded header section', function() {
    expect(JwtModel.header).to.equal('{"typ":"JWT","alg":"HS256"}'); 
    });
});


describe('JWT Service', function() {  
    var JwtService;
    var $httpBackend;
    var testEmail;
    var testPass;
    var httpBackend;
    
    beforeEach(inject(function(_JwtService_) {
        JwtService = new _JwtService_;
        testEmail = 'test@digitalminion.com';
        testPass = 'letmein'
    }));
    
        beforeEach(inject(function($httpBackend) {
        httpBackend = $httpBackend;
    }));
    
    it('should resolve the promise and respond with a token', function() {

        var self = { token:'', ErrorMessage:''}

        
        httpBackend
            .expectPOST('http://localhost/auth/token/', {email: testEmail, password: testPass})
            .respond(200, { token : testHash });
        
         JwtService.token(testEmail, testPass)
            .then(
                    function(d) {self.token = d.token;},
                    function(d) {self.ErrorMessage = "Sorry, we didn't recognize the email or password you entered. Please try again."}
            )
        
        httpBackend.flush();
        
        expect(self.token).to.equal(testHash);
    });
    
    it('should resolve the promise with an error message', function() {

        var self = { token:'', ErrorMessage:''}

        
        httpBackend
            .expectPOST('http://localhost/auth/token/', {email: testEmail, password: testPass})
            .respond(400, '(BAD REQUEST)');
        
         JwtService.token(testEmail, testPass)
            .then(
                    function(d) {self.token = d.token;},
                    function(d) {self.ErrorMessage = "Sorry, we didn't recognize the email or password you entered. Please try again."}
            )
        
        httpBackend.flush();
        
        expect(self.ErrorMessage).to.equal("Sorry, we didn't recognize the email or password you entered. Please try again.");
    });
});