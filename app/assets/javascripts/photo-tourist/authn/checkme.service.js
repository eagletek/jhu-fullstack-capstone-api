(function() {
  "use strict";

  angular
    .module("photo-tourist.authn")
    .factory("photo-tourist.authn.checkMe", CheckMeFactory);

  CheckMeFactory.$inject = ["$resource", "photo-tourist.config.APP_CONFIG"];
  function CheckMeFactory($resource, APP_CONFIG) {
    return $resource(APP_CONFIG.server_url + "/authn/checkme");
  }
})();
