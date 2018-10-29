'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:LoginAddCtrl
 * @description
 * # LoginAddCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
.controller('LoginAddCtrl', function (
  $scope,
  Login,
  $location
) {
  $scope.login = {};
  $scope.saveLogin = function() {
    Login.list().post($scope.login).then(function() {
      $location.path('/logins');
    });
  };
});
