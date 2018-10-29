'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:LoginDeleteCtrl
 * @description
 * # LoginDeleteCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
.controller('LoginDeleteCtrl', function (
  $scope,
  $routeParams,
  Login,
  $location
) {
  $scope.login = Login.list().one($routeParams.id).get().$object;
  $scope.deleteLogin = function() {
    $scope.login.remove().then(function() {
      $location.path('/logins');
    });
  };
  $scope.back = function() {
    $location.path('/login/' + $routeParams.id);
  };
});
