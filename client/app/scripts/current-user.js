angular.module('clientApp')
  .factory('currentUser', ['$http', '$auth', function currentUserFactory($http, $auth) {
    var userApiUrl = 'https://api.github.com/user';
    var token = $auth.getToken();
    var authenticatedUser = null;
    var headers = { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' };

    var fetch = function() {
		  return $http({ cache: true, method: 'GET', url: userApiUrl, headers: headers })
        .then(function(user) {
				 	authenticatedUser = user.data;
				 	return user.data
				})
    };

	  var get = function() {
      return authenticatedUser;
    };

    return {
      fetch: fetch,
    	get: get
    }
}]);
