(function() {
  "use strict";

  angular
    .module("photo-tourist.subjects")
    .factory("photo-tourist.subjects.ThingsAuthz", ThingsAuthzFactory);

    ThingsAuthzFactory.$inject = ["photo-tourist.authz.Authz",
                                  "photo-tourist.authz.BasePolicy"];
    function ThingsAuthzFactory(Authz, BasePolicy) {
      function ThingsAuthz() {
        BasePolicy.call(this, "Thing");
      };

      ThingsAuthz.prototype = Object.create(BasePolicy.prototype);
      ThingsAuthz.constructor = ThingsAuthz;

      ThingsAuthz.prototype.canQuery = function() {
        return Authz.isAuthenticated();
      };

      ThingsAuthz.prototype.canAddImage = function(thing) {
        return Authz.isMember(thing);
      };

      ThingsAuthz.prototype.canUpdateImage = function(thing) {
        return Authz.isOrganizer(thing);
      };

      ThingsAuthz.prototype.canRemoveImage = function(thing) {
        return Authz.isOrganizer(thing) || Authz.isAdmin();
      };

      return new ThingsAuthz();
    };
}());
