(function() {
  "use strict";

  angular
    .module("photo-tourist.subjects")
    .factory("photo-tourist.subjects.ImageThing", ImageThing);

  ImageThing.$inject = ["$resource", "photo-tourist.config.APP_CONFIG"];
  function ImageThing($resource, APP_CONFIG) {
    return $resource(APP_CONFIG.server_url + "/api/images/:image_id/thing_images");
  }

})();
