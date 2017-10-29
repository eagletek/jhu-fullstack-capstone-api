(function() {
  "use strict";

  angular
    .module("photo-tourist.cities")
    .factory("photo-tourist.cities.City", CityFactory);

  CityFactory.$inject = ["$resource", "photo-tourist.APP_CONFIG"];
  function CityFactory($resource, APP_CONFIG) {
    return $resource(APP_CONFIG.server_url + "/api/cities/:id",
      { id: '@id' },
      { update: { method: "PUT" } }
      );
  }
})();