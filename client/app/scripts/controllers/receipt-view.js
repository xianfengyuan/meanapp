'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:ReceiptViewCtrl
 * @description
 * # ReceiptViewCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
.controller('ReceiptViewCtrl', function (
  $scope,
  $routeParams,
  Receipt
) {
  $scope.viewReceipt = true;
  $scope.receipt = Receipt.one($routeParams.id).get().$object;
});
