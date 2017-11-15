(function() {
  "use strict";

  angular
    .module("photo-tourist", [
      "ui.router",
      "photo-tourist.config",
      "photo-tourist.authn",
      "photo-tourist.cities"
    ]);
})();
