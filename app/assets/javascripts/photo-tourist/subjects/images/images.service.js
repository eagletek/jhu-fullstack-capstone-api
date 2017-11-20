(function() {
  "use strict";

  angular
    .module("photo-tourist.subjects")
    .factory("photo-tourist.subjects.Image", ImageFactory);

  ImageFactory.$inject = ["$resource", "photo-tourist.config.APP_CONFIG"];
  function ImageFactory($resource, APP_CONFIG) {
    var service = $resource(APP_CONFIG.server_url + "/api/images/:id",
        { id: '@id' },
        {
          update: {method: "PUT"},
          save: {method: "POST", transformRequest: checkEmptyPayload}
        });

    return service;
  };

  // Rails wants at least one parameter populated
  function checkEmptyPayload(data) {
    if (!data['caption']) {
      data['caption'] = null;
    }
    return angular.toJson(data);
  };

}());
