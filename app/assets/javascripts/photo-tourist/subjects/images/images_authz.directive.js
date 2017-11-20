(function() {
  "use strict";

  angular
    .module("photo-tourist.subjects")
    .directive("ptImagesAuthz", ImagesAuthzDirective);

  ImagesAuthzDirective.$inject = [];

  function ImagesAuthzDirective() {
    var directive = {
      bindToController: true,
      controller: ImagesAuthzController,
      controllerAs: "vm",
      restrict: "A",
      scope: {
        authz: "=" // updates parent scope with authz evals
      },
      link: link
    };
    return directive;

    function link(scope, element, attrs) {
      console.log("ImagesAuthzDirective", scope);
    };
  };

  ImagesAuthzController.$inject = ["$scope", "photo-tourist.authn.Authn"];
  function ImagesAuthzController($scope, Authn) {
    var vm = this;
    vm.authz = {};
    vm.authz.authenticated = false;
    vm.authz.canCreate     = false;
    vm.authz.canQuery      = false;
    vm.authz.canUpdate     = false;
    vm.authz.canDelete     = false;
    vm.authz.canGetDetails = false;
    vm.authz.canUpdateItem = canUpdateItem;

    ImagesAuthzController.prototype.resetAccess = function() {
      this.authz.canCreate     = false;
      this.authz.canQuery      = true;
      this.authz.canUpdate     = false;
      this.authz.canDelete     = false;
      this.authz.canGetDetails = true;
    };

    activate();
    return;
    ///////////
    function activate() {
      vm.resetAccess();
      $scope.$watch(Authn.getCurrentUser, newUser);
    };

    function newUser(user, prevUser) {
      console.log("newUser:", user, "prevUser:", prevUser);
      vm.authz.canQuery = true;
      vm.authz.authenticated = Authn.isAuthenticated();
      if (vm.authz.authenticated) {
        vm.authz.canCreate = true;
        vm.authz.canUpdate = true;
        vm.authz.canDelete = true;
        vm.authz.canGetDetails = true;
      } else {
        vm.resetAccess();
      };
    };

    function canUpdateItem() {
      return Authn.isAuthenticated();
    };
  };

}());