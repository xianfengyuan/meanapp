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

  $http.get('/assets/data1.json')
       .then(function(res){
          jsons.push(res.data);
        });

  $http.get('/assets/data2.json')
       .then(function(res){
          jsons.push(res.data);
        });

  $interval(function(){
    var idx = Math.floor(Math.random() * 2);
    $scope.d3json = jsons[idx];
  }, 1000, 1000);

});
