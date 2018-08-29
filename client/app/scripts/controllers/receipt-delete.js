'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:ReceiptDeleteCtrl
 * @description
 * # ReceiptDeleteCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
.controller('ReceiptDeleteCtrl', function (
  $scope,
  $routeParams,
  Receipt,
  $location
) {
  $scope.receipt = Receipt.list().one($routeParams.id).get().$object;
  $scope.deleteReceipt = function() {
    $scope.receipt.remove().then(function() {
      $location.path('/receipts');
    });
  };
  $scope.back = function() {
    $location.path('/receipt/' + $routeParams.id);
  };
});
