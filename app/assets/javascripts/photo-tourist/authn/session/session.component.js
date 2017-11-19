(function() {
  "use strict";

  angular
    .module("photo-tourist.authn")
    .component("ptAuthnSession", {
      templateUrl: templateUrl,
      controller: AuthnSessionController
    });

    templateUrl.$inject = ["photo-tourist.config.APP_CONFIG"];
    function templateUrl(APP_CONFIG) {
      return APP_CONFIG.authn_session_html;
    };

    AuthnSessionController.$inject = ["$scope", "photo-tourist.authn.Authn"];
    function AuthnSessionController($scope, Authn) {
      var vm = this;
      vm.loginForm = {};
      vm.login = login;
      vm.logout = logout;
      vm.getCurrentUser = Authn.getCurrentUser;
      vm.getCurrentUserName = Authn.getCurrentUserName;
      vm.closeDropdown = closeDropdown;

      vm.$onInit = function() {
        console.log("AuthnSessionController", $scope);
      };

      vm.$postLink = function() {
        vm.dropdown = $("#login-dropdown");
      }

      return;
      ////////////
      function login() {
        console.log("login");
        $scope.login_form.$setPristine();
        vm.loginForm.errors = null;
        Authn.login(vm.loginForm).then(
            vm.closeDropdown,
            function(response) {
              console.log("Login failure", response.errors);
              vm.loginForm["errors"] = response.errors;
            });
      };
      function logout() {
        Authn.logout().then(
            vm.closeDropdown
          );
      };
      function closeDropdown() {
        vm.dropdown.removeClass("open");
      };
    };

}());
