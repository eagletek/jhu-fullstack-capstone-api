(function() {
  "use strict";

  angular
    .module("photo-tourist.authn")
    .component("ptSignup", {
        templateUrl: templateUrl,
        controller: SignupController
    });

    templateUrl.$inject = ["photo-tourist.config.APP_CONFIG"];
    function templateUrl(APP_CONFIG) {
      return APP_CONFIG.authn_signup_html;
    };

    SignupController.$inject = ["$scope", "$state", "photo-tourist.authn.Authn"]
    function SignupController($scope, $state, Authn) {
      var vm=this;
      vm.signupForm = {};
      vm.signup = signup;

      vm.$onInit = function() {
        console.log("SignupController", $scope);
      }

      return;

      function signup() {
        console.log("signup...");
        Authn.signup(vm.signupForm).then(
            function(response){
              vm.id = response.data.data.id;
              console.log("signup complete", response.data, vm);
              $state.go("home");
            },
            function(response){
              console.log("signup failure", response, vm);
            });
      }
    };

}());
