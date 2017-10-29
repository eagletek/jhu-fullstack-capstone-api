(function() {
  "use strict";

  angular
    .module("photo-tourist.cities")
    .controller("photo-tourist.cities.CitiesController", CitiesController);

  CitiesController.$inject = ["photo-tourist.cities.City"];

  function CitiesController(City) {
    var vm = this;
    vm.cities;
    vm.city;

    activate();
    return;
    ///////////////
    function activate() {
      newCity();
      vm.cities = City.query();
    }

    function newCity() {
      vm.city = new City();
    }
    function handleError(response) {
      console.log(response);
    }
    function edit(object, index) {
    }
    function create() {
    }
    function update() {
    }
    function remove() {
    }
    function removeElement(elements, element) {
    }
  }

})();
