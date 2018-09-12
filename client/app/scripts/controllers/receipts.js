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
    $scope.receipts = [];
    $scope.totalReceipts = 0;
    $scope.receiptsPerPage = 10;
    getResultsPage(1);

    $scope.pagination = {
      current: 1
    };

    $scope.pageChanged = function(newPage) {
      getResultsPage(newPage);
    };

    function getResultsPage(newPage) {
      Receipt.page(newPage).getList()
      .then(function(receipts) {
        Receipt.count().getList()
        .then(function(count) {
          $scope.receipts = receipts;
          $scope.totalReceipts = count[0].total;
        });
      });
    };

    $scope.sort = function(key) {
      $scope.sortKey = key;
      $scope.reverse = !$scope.reverse;
    }
  });
