'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:ReceiptEditCtrl
 * @description
 * # ReceiptEditCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
.controller('ReceiptEditCtrl', function (
  $scope,
  $routeParams,
  Receipt,
  $location
) {
  $scope.editReceipt = true;
  $scope.receipt = {};
  Receipt.list().one($routeParams.id).get().then(function(receipt) {
    $scope.receipt = receipt;
    $scope.saveReceipt = function() {
      $scope.receipt.save().then(function() {
        $location.path('/receipt/' + $routeParams.id);
      });
    };
  });
});
