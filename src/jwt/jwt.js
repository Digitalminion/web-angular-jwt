
(function(){
  'use strict';

  // Prepare the 'ngJwt' module for subsequent registration of controllers and delegates
  angular.module('authJwt', 
    [
    'ngRoute',
    'ngResource',
    'ngSanitize',
    'ngCookies',
    'ngBase64'
    ]);


})();