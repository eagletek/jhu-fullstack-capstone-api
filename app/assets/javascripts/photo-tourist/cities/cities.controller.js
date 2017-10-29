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
    vm.create = create;
    vm.edit = edit;
    vm.update = update;
    vm.remove = remove;

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
      //console.log("Creating city: ", vm.city)
      vm.city.$save()
        .then(function(response){
          //console.log(response);
          vm.cities.push(vm.city);
          newCity();
        })
        .catch(handleError)
    }
    function update() {
    }
    function remove() {
    }
    function removeElement(elements, element) {
    }
  }

})();
