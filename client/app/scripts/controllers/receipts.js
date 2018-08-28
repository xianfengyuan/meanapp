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
    $scope.receipts = Receipt.getList().$object;
  });
