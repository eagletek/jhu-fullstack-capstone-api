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
    function edit(object) {
      console.log("Selected:", object);
      vm.city = object;
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
      vm.city.$update()
        .then(function(response){
          //console.log(response);
        })
        .catch(handleError)
    }
    function remove() {
      vm.city.$delete()
        .then(function(response){
          // Remove element from local array
          removeElement(vm.cities, vm.city)
          // Refresh from server if other elements may have changed
          //vm.cities = City.query();
          // Replace edit area with prototype instance
          newCity();
        })
        .catch(handleError);
    }
    function removeElement(elements, element) {
      for (var i=0; i<elements.length; i++) {
        if (elements[i].id == element.id) {
          elements.splice(i, 1);
          break;
        }
      }
    }
  }

})();
