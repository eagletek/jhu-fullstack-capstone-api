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

    NavbarController.$inject = ["$scope", "$state", "photo-tourist.authn.Authn"];
    function NavbarController($scope, $state, Authn) {
      var vm = this;
      $scope.$state = $state;
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
