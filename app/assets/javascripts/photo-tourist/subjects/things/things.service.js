(function() {
  "use strict";

  angular
    .module("photo-tourist.subjects")
    .factory("photo-tourist.subjects.Thing", ThingFactory);

  ThingFactory.$inject = ["$resource", "photo-tourist.config.APP_CONFIG"];
  function ThingFactory($resource, APP_CONFIG) {
    var service = $resource(APP_CONFIG.server_url + "/api/things/:id",
        { id: '@id' },
        {
          update: {method: "PUT"},
          save: {method: "POST", transformRequest: checkEmptyPayload}
        });

    return service;
  };

  // Rails wants at least one parameter populated
  function checkEmptyPayload(data) {
    if (!data['name']) {
      data['name'] = null;
    }
    return angular.toJson(data);
  };

}());
