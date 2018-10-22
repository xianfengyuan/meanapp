'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:LogoutCtrl
 * @description
 * # LogoutCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('LogoutCtrl', function(AuthenticationService, $location, ngNotify, $window, $state, $auth) {
    if(!$auth.isAuthenticated()) {
      $location.path('/login');
    }
    else {
      AuthenticationService.logout().catch(function(error) {
      // The logging out process failed on the server side
        if(error.status == 500) {
          ngNotify.set('Logout failed.', { type: 'error' });
        }
      }).finally(function() {
        $location.path('/login');
        $window.location.reload()
      });
    }
  });
