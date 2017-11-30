(function() {
  "use strict";

  angular
    .module("photo-tourist", [
      "ui.router",
      "photo-tourist.config",
      "photo-tourist.authn",
      "photo-tourist.authz",
      "photo-tourist.layout",
      "photo-tourist.cities",
      "photo-tourist.subjects"
    ]);
})();
