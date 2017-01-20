app.factory('authentication',function($http, $window){
    var saveToken = function (token) {
      $window.localStorage['mysteryToken'] = token;
    };

    var getToken = function () {
      return $window.localStorage['mysteryToken'];
    };

    var logout = function() {
      $window.localStorage.removeItem('mysteryToken');
    };

    var isLoggedIn = function() {
        var token = getToken();
        var payload;

        if(token){
        payload = token.split('.')[1];
        payload = $window.atob(payload);
        payload = JSON.parse(payload);

        return payload.exp > Date.now() / 1000;
        } else {
        return false;
        }
    };

    var currentUser = function() {
        if( isLoggedIn ){
        var token = getToken();
        var payload = token.split('.')[1];
        payload = $window.atob(payload);
        payload = JSON.parse(payload);
        return {
            username : payload.username,
            name : payload.name
        };
        }
    };    

    return {
      saveToken : saveToken,
      getToken : getToken,
      logout : logout,
      isLoggedIn : isLoggedIn,
      currentUser : currentUser
    };
});