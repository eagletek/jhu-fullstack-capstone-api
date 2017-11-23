(function() {
  "use strict";

  angular
    .module("photo-tourist.subjects")
    .factory("photo-tourist.subjects.ImageLinkableThing", ImageLinkableThing);

  ImageLinkableThing.$inject = ["$resource", "photo-tourist.config.APP_CONFIG"];
  function ImageLinkableThing($resource, APP_CONFIG) {
    return $resource(APP_CONFIG.server_url + "/api/images/:image_id/linkable_things");
  }

})();
