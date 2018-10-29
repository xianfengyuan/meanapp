'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:LoginViewCtrl
 * @description
 * # LoginViewCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
.controller('LoginViewCtrl', function (
  $scope,
  $routeParams,
  Login
) {
  $scope.viewLogin = true;
  $scope.login = Login.list().one($routeParams.id).get().$object;
});
