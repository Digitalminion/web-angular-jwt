//Change the title of this file to "config.js"
'use strict';
var testApp = angular.module('testApp',
[
    'ngJwt'
]);
var apiDomain = "<fully qualified domain and route to your API>"
var apiAuthTokenUrl = "/auth/token/"
var apiAuthTokenRefreshUrl = "/auth/refresh/"