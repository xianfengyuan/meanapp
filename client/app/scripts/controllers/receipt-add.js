'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:ReceiptAddCtrl
 * @description
 * # ReceiptAddCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
.controller('ReceiptAddCtrl', function (
  $scope,
  Receipt,
  $location
) {
  $scope.receipt = {};
  $scope.saveReceipt = function() {
    Receipt.list().post($scope.receipt).then(function() {
      $location.path('/receipts');
    });
  };
});
