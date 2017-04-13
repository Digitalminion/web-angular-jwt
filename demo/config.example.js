'use strict';
var testApp = angular.module('testApp',
[
    'authJwt','content-mocks'
]);

angular.module('authJwt')
    .value('api', {
      'domain':'<route to domain>',
      'authToken':'<route to auth>',
      'refreshToken': '<route to refresh>'
  });