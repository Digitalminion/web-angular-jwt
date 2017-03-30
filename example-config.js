//Change the title of this file to "config.js"
'use strict';
var testApp = angular.module('testApp',
[
    'authJwt'
]);

angular.module('authJwt')
    .value('api', {
      'domain':'<route to your api>',
      'authToken':'/auth/token/',
      'refreshToken': '/auth/refresh/'
  });