(function() {
  "use strict";

  angular
    .module("photo-tourist")
    .config(RouterFunction);

  RouterFunction.$inject = ["$stateProvider",
                            "$urlRouterProvider",
                            "photo-tourist.config.APP_CONFIG"];

  function RouterFunction($stateProvider, $urlRouterProvider, APP_CONFIG) {
    $stateProvider
      .state("home", {
        url: "/",
        templateUrl: APP_CONFIG.main_page_html
      })
      .state("signup", {
        url: "/signup",
        templateUrl: APP_CONFIG.signup_page_html
      })
      .state("authn", {
        url: "/authn",
        templateUrl: APP_CONFIG.authn_page_html
      })

      $urlRouterProvider.otherwise("/");
  };

})();
