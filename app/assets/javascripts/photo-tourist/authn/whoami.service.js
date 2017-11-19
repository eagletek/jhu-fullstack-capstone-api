(function() {
  "use strict";

  angular
    .module("photo-tourist.authn")
    .factory("photo-tourist.authn.whoAmI", WhoAmIFactory);

  WhoAmIFactory.$inject = ["$resource", "photo-tourist.config.APP_CONFIG"];
  function WhoAmIFactory($resource, APP_CONFIG) {
    return $resource(APP_CONFIG.server_url + "/authn/whoami");
  }
})();
