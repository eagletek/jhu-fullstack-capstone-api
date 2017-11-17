(function() {
  "use strict";

  angular
    .module("photo-tourist.layout")
    .component("ptNavbar", {
      templateUrl: templateUrl,
      controller: NavbarController
    })

    templateUrl.$inject = ["photo-tourist.config.APP_CONFIG"];
    function templateUrl(APP_CONFIG) {
      return APP_CONFIG.navbar_html;
    };

    NavbarController.$inject = ["$scope", "photo-tourist.authn.Authn"];
    function NavbarController($scope, Authn) {
      var vm = this;
      vm.getLoginLabel = getLoginLabel;

      vm.$onInit = function() {
        console.log("NavbarController", $scope);
      };

      return;
      ///////////////
      function getLoginLabel() {
        return Authn.isAuthenticated() ? Authn.getCurrentUserName() : "Login";
      }
    };

}());
