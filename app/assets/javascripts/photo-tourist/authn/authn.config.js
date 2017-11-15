(function() {
  "use strict"

  angular
    .module("photo-tourist.authn")
    .config(AuthnConfig)

    AuthnConfig.$inject = ["$authProvider", "photo-tourist.config.APP_CONFIG"];

    function AuthnConfig ($authProvider, APP_CONFIG) {
      $authProvider.configure({
            apiUrl: APP_CONFIG.server_url
          })
    }

}());
