'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:SignOutButtonCtrl
 * @description
 * # SignOutButtonCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('SignOutButtonCtrl', function($scope, AuthenticationService, $location, ngNotify, $window, $auth){
    $scope.logout = function() {
      if(!$auth.isAuthenticated()) {
        $location.path('/login');
      }
      else{
        AuthenticationService.logout().catch(function(error) {
          // The logging out process failed on the server side
          if(error.status == 500){
            ngNotify.set('Logout failed.', { type: 'error' });
          }
        }).finally(function(){
          $location.path('/login');
          $window.location.reload()
        });
      }
    };
  });
