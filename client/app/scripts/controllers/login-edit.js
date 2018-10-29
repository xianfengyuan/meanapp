'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:LoginEditCtrl
 * @description
 * # LoginEditCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
.controller('LoginEditCtrl', function (
  $scope,
  $routeParams,
  Login,
  $location
) {
  $scope.editLogin = true;
  $scope.login = {};
  Login.list().one($routeParams.id).get().then(function(login) {
    $scope.login = login;
    $scope.saveLogin = function() {
      $scope.login.save().then(function() {
        $location.path('/login/' + $routeParams.id);
      });
    };
  });
});
