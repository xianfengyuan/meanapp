angular.module('clientApp')
  .factory('AuthenticationService', ['$rootScope', 'ngNotify', '$auth', 'currentUser', '$http', 'config', '$location',
    function AuthenticationService($rootScope, ngNotify, $auth, currentUser, $http, config, $location) {
      var whenError = function(error) {
        if(error.status == 403){
          ngNotify.set('You have been logged out.', {
            type: 'warn',
		        sticky: true,
            button: true,
	  	    });

	  	    $location.path('/login');
        }
      };

      var serverSignout = function(){
        var url = config.SERVER_URL + '/logout'
		    return $http({ method: 'POST', url: url })
      };

      var login = function(){
        return currentUser.fetch().then(function(){
          return true;
        });
      };

      var logout = function(){
        return serverSignout().finally(function(){
          $auth.logout();
        });
      };

      return {
        login: login,
        logout: logout
      };
    }
  ]);
