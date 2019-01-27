'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:TreeCtrl
 * @description
 * # TreeCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller("treeCtrl", function($scope, $interval, $http) {

  var jsons = [];

  $http.get('https://rawgit.com/komushi/ng-d3tree/master/examples/data/data1.json')
       .success(function(res){
          jsons.push(res);
        });

  $http.get('https://rawgit.com/komushi/ng-d3tree/master/examples/data/data2.json')
       .success(function(res){
          jsons.push(res);
        });

  $interval(function(){
    var idx = Math.floor(Math.random() * 2);
    $scope.d3json = jsons[idx];
  }, 1000, 1000);

});
