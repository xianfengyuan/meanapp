'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:ReceiptsCtrl
 * @description
 * # ReceiptsCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('ReceiptsCtrl', function (
    $scope,
    Receipt
  ) {
    $scope.receipts = Receipt.list().getList().$object;
    $scope.sort = function(key) {
      $scope.sortKey = key;
      $scope.reverse = !$scope.reverse;
    }
  });
