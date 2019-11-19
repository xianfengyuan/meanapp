'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:SignInButtonCtrl
 * @description
 * # SignInButtonCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('SignInButtonCtrl', function($scope, $auth, $location, ngNotify){
    $scope.authenticate = function(provider) {
      $auth.authenticate(provider)
      .then(function(response) {
        $location.path('/');
      })
      .catch(function(response) {
       ngNotify.set('Authentication failed.', {
          type: 'error',
          sticky: true,
          button: true,
        });
      });
    };
  });
