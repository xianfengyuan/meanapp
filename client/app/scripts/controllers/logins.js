'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:LoginsCtrl
 * @description
 * # LoginsCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('LoginsCtrl', function (
    $scope,
    Login
  ) {
    $scope.logins = [];
    $scope.totalLogins = 0;
    $scope.loginsPerPage = 10;
    getResultsPage(1);

    $scope.pagination = {
      current: 1
    };

    $scope.pageChanged = function(newPage) {
      getResultsPage(newPage);
    };

    function getResultsPage(newPage) {
      Login.page(newPage).getList()
      .then(function(logins) {
        Login.count().getList()
        .then(function(count) {
          $scope.logins = logins;
          $scope.totalLogins = count[0].total;
        });
      });
    };

    $scope.sort = function(key) {
      $scope.sortKey = key;
      $scope.reverse = !$scope.reverse;
    }
  });
