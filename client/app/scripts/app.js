'use strict';

/**
 * @ngdoc overview
 * @name clientApp
 * @description
 * # clientApp
 *
 * Main module of the application.
 */
angular
  .module('clientApp', [
    'ngRoute',
    'restangular',
    'angularUtils.directives.dirPagination',
    'moment-picker',
    'ngNotify',
    'satellizer',
    'ngD3tree'
  ])
  .run(['ngNotify', function(ngNotify) {
    ngNotify.config({
      theme: 'paster',
      position: 'top',
      duration: 250
    });
  }])
  // .config(['$authProvider', 'config', function ($authProvider, config) {
  //   $authProvider.github({
  //     clientId: config.GITHUB_CLIENT_ID,
  //     redirectUri: config.GITHUB_REDIRECT_URI,
  //     url: config.GITHUB_ACCESS_TOKEN_REQUEST_URL
  //   });
  //   $authProvider.httpInterceptor = true;
  // }])
  .config(function (momentPickerProvider) {
    momentPickerProvider.options({
      minutesStep: 1
    });
  })
  .config(function ($routeProvider, config, RestangularProvider) {
    // var requireAuthentication = function ($location, $auth, AuthenticationService) {
    //   if ($auth.isAuthenticated()) {
    //     return AuthenticationService.login()
    //   } else {
    //     return $location.path('/login');
    //   }
    // };
    //
    // $routeProvider.when = function(path, route){
    //   route.resolve || (route.resolve = {
    //     currentUser: function(currentUser){ return currentUser.fetch() },
    //     requireAuthentication: requireAuthentication
    //   });
    //   return $routeProvider.when(path, route);
    // };
    // Set the base URL for Restangular.
    RestangularProvider.setBaseUrl(config.SERVER_URL);

    $routeProvider
      .when('/login', {
        templateUrl: 'views/login.html'
      })
      .when('/logout', {
        templateUrl: 'views/logout.html'
      })
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/tree', {
        templateUrl: 'views/d3tree.html',
        controller: 'treeCtrl'
      })
      .when('/logins', {
        templateUrl: 'views/logins.html',
        controller: 'LoginsCtrl'
      })
      .when('/create/login', {
        templateUrl: 'views/login-add.html',
        controller: 'LoginAddCtrl'
      })
      .when('/login/:id', {
        templateUrl: 'views/login-view.html',
        controller: 'LoginViewCtrl'
      })
      .when('/login/:id/edit', {
        templateUrl: 'views/login-edit.html',
        controller: 'LoginEditCtrl'
      })
      .when('/login/:id/delete', {
        templateUrl: 'views/login-delete.html',
        controller: 'LoginDeleteCtrl'
      })
      .when('/movies', {
        templateUrl: 'views/movies.html',
        controller: 'MoviesCtrl'
      })
      .when('/create/movie', {
        templateUrl: 'views/movie-add.html',
        controller: 'MovieAddCtrl'
      })
      .when('/movie/:id', {
        templateUrl: 'views/movie-view.html',
        controller: 'MovieViewCtrl'
      })
      .when('/movie/:id/edit', {
        templateUrl: 'views/movie-edit.html',
        controller: 'MovieEditCtrl'
      })
      .when('/movie/:id/delete', {
        templateUrl: 'views/movie-delete.html',
        controller: 'MovieDeleteCtrl'
      })
      .when('/receipts', {
        templateUrl: 'views/receipts.html',
        controller: 'ReceiptsCtrl'
      })
      .when('/create/receipt', {
        templateUrl: 'views/receipt-add.html',
        controller: 'ReceiptAddCtrl'
      })
      .when('/receipt/:id', {
        templateUrl: 'views/receipt-view.html',
        controller: 'ReceiptViewCtrl'
      })
      .when('/receipt/:id/edit', {
        templateUrl: 'views/receipt-edit.html',
        controller: 'ReceiptEditCtrl'
      })
      .when('/receipt/:id/delete', {
        templateUrl: 'views/receipt-delete.html',
        controller: 'ReceiptDeleteCtrl'
      })
      .otherwise({
        // For any unmatched url, redirect to /login
        redirectTo: '/login'
      });
  })
  .factory('LoginRestangular', function(Restangular) {
    return Restangular.withConfig(function(RestangularConfigurer) {
      RestangularConfigurer.setRestangularFields({
        id: '_id'
      });
    });
  })
  .factory('Login', function(LoginRestangular) {
    return {
      list: function() {
        return LoginRestangular.service('login');
      },
      search: function(query) {
        return LoginRestangular.service('login?username__regex=/'+query+'/');
      },
      page: function(pageno) {
        return LoginRestangular.service('login?limit=10&skip='+(pageno-1)*10);
      },
      count: function() {
        return LoginRestangular.service('login/virtual/total-count');
      }
    };
  })
  .factory('MovieRestangular', function(Restangular) {
    return Restangular.withConfig(function(RestangularConfigurer) {
      RestangularConfigurer.setRestangularFields({
        id: '_id'
      });
    });
  })
  .factory('Movie', function(MovieRestangular) {
    return MovieRestangular.service('movie');
  })
  .factory('ReceiptRestangular', function(Restangular) {
    return Restangular.withConfig(function(RestangularConfigurer) {
      RestangularConfigurer.setRestangularFields({
        id: '_id'
      });
    });
  })
  .factory('Receipt', function(ReceiptRestangular) {
    return {
      list: function() {
        return ReceiptRestangular.service('receipt');
      },
      search: function(query) {
        return ReceiptRestangular.service('receipt?description__regex=/'+query+'/');
      },
      page: function(pageno) {
        return ReceiptRestangular.service('receipt?limit=10&skip='+(pageno-1)*10);
      },
      count: function() {
        return ReceiptRestangular.service('receipt/virtual/total-count');
      }
    };
  })
  .directive('youtube', function() {
    return {
      restrict: 'E',
      scope: {
        src: '='
      },
      templateUrl: 'views/youtube.html'
    };
  })
  .directive('signInButton', function() {
    return {
      restrict: "E",
      templateUrl: 'views/sign-in-button.html',
      controller: 'SignInButtonCtrl'
    };
  })
  .directive('signOutButton', function() {
    return {
      restrict: "E",
      templateUrl: 'views/sign-out-button.html',
      controller: 'SignOutButtonCtrl'
    };
  })
  .filter('trusted', function ($sce) {
    return function(url) {
      return $sce.trustAsResourceUrl(url);
    };
  })
  .filter('utcToLocal', function($filter) {
    return function(utcDateString, format) {
      if (!utcDateString) {
        return;
      }
      // append 'Z' to the date string to indicate UTC time if the timezone isn't already specified
      if (utcDateString.indexOf('Z') === -1 && utcDateString.indexOf('+') === -1) {
        utcDateString += 'Z';
      }
      // convert and format date using the built in angularjs date filter
      return $filter('date')(utcDateString, format);
    };
  });
