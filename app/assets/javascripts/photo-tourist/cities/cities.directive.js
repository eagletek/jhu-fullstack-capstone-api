(function() {
  "use strict";

  angular
    .module("photo-tourist.cities")
    .directive("ptCities", CitiesDirective);

  CitiesDirective.$inject = ["photo-tourist.APP_CONFIG"];

  function CitiesDirective(APP_CONFIG) {
    var directive = {
      templateUrl: APP_CONFIG.cities_html,
      replace: true,
      bindToController: true,
      controller: "photo-tourist.cities.CitiesController",
      controllerAs: "citiesVM",
      restrict: "E",
      scope:{},
      link: link
    };
    return directive;

    function link (scope, element, attrs) {
      console.log("CitiesDirective", scope);
    }
  }
})();
