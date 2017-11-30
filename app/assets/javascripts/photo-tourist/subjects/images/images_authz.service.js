(function() {
  "use strict";

  angular
    .module("photo-tourist.subjects")
    .factory("photo-tourist.subjects.ImagesAuthz", ImagesAuthzFactory);

    ImagesAuthzFactory.$inject = ["photo-tourist.authz.Authz",
                                  "photo-tourist.authz.BasePolicy"];
    function ImagesAuthzFactory(Authz, BasePolicy) {
      function ImagesAuthz() {
        BasePolicy.call(this, "Image");
      };

      ImagesAuthz.prototype = Object.create(BasePolicy.prototype);
      ImagesAuthz.constructor = ImagesAuthz;

      ImagesAuthz.prototype.canCreate = function() {
        return Authz.isAuthenticated();
      };

      return new ImagesAuthz();
    };
}());
