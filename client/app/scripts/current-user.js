angular.module('clientApp')
  .factory('currentUser', ['$http', '$auth', function currentUserFactory($http, $auth) {
    var userApiUrl = 'https://people.googleapis.com/v1/people/me';
    var token = $auth.getToken();
    var authenticatedUser = null;
    var params = { personFields: 'emailAddresses' }
    var headers = { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' };

    var fetch = function() {
		  return $http({ cache: true, method: 'GET', url: userApiUrl, headers: headers, params: params })
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
