(function() {
  "use strict";

  angular
    .module("photo-tourist.authn")
    .service("photo-tourist.authn.Authn", Authn)

  Authn.$inject = ["$auth", "$q"]
  function Authn($auth, $q){
    var service = this;
    service.signup = signup;
    service.user = null;
    service.isAuthenticated = isAuthenticated;
    service.getCurrentUserName = getCurrentUserName;
    service.getCurrentUserId = getCurrentUserId;
    service.getCurrentUser = getCurrentUser;
    service.login = login;
    service.logout = logout;

    activate();
    return;
    ////////////////
    function activate() {
      $auth.validateUser().then(
        function(user) {
          service.user = user;
          console.log("validated user", user);
        });
    };
    function signup(registration) {
      return $auth.submitRegistration(registration)
    };

    function isAuthenticated() {
      return service.user != null && service.user["uid"] != null;
    };
    function getCurrentUserName() {
      return service.user ? service.user.name : null;
    };
    function getCurrentUserId() {
      return service.user ? service.user.id : null;
    };
    function getCurrentUser() {
      return service.user;
    };
    function login(credentials) {
      console.log("login", credentials.email);
      var result = $auth.submitLogin({
        email: credentials["email"],
        password: credentials["password"]
      });

      var deferred = $q.defer();

      result.then(
        function(response){
          service.user = response;
          deferred.resolve(response);
        },
        function(response){
          var formatted_errors = { errors: {
              full_messages: response.errors
            }
          };
          console.log("Login failure", response, formatted_errors);
          deferred.reject(formatted_errors);
        });

      return deferred.promise;
    };
    function logout() {
      console.log("logout")
      var result = $auth.signOut()
      result.then(
        function(response) {
          service.user = null;
          console.log("logout complete", response);
        },
        function(response) {
          service.user = null;
          console.log("logout failed!", response);
          alert(response.status + ":" + response.statusText);
        }
      );
      return result;
    };
  };

}());
