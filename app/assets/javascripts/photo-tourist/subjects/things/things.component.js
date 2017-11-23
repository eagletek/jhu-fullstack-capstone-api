(function() {
  "use strict";

  angular
    .module("photo-tourist.subjects")
    .component("ptThingSelector", {
        templateUrl: thingSelectorTemplateUrl,
        controller: ThingSelectorController,
        bindings: {
          authz: "<"
        }
    })
    .component("ptThingEditor", {
        templateUrl: thingEditorTemplateUrl,
        controller: ThingEditorController,
        bindings: {
          authz: "<"
        }
    });

  thingSelectorTemplateUrl.$inject = ["photo-tourist.config.APP_CONFIG"];
  function thingSelectorTemplateUrl(APP_CONFIG) {
    return APP_CONFIG.thing_selector_html;
  };

  ThingSelectorController.$inject = ["$scope",
                                     "$stateParams",
                                     "photo-tourist.subjects.Thing",
                                     "photo-tourist.subjects.ThingImage"];
  function ThingSelectorController($scope, $stateParams, Thing, ThingImage) {
    var vm = this;

    vm.$onInit = function() {
      console.log("ThingSelectorController", $scope);
      if (!$stateParams.id) {
        $scope.$watch(function() { return vm.authz.authenticated; },
                      function() {
                        if (vm.authz.canQuery) {
                          vm.items = Thing.query();
                        } else {
                          vm.items = null;
                        }
                      });
      }
    };

    return;
    //////////
  };

  thingEditorTemplateUrl.$inject = ["photo-tourist.config.APP_CONFIG"];
  function thingEditorTemplateUrl(APP_CONFIG) {
    return APP_CONFIG.thing_editor_html;
  };

  ThingEditorController.$inject = ["$scope",
                                   "$q",
                                   "$state",
                                   "$stateParams",
                                   "photo-tourist.subjects.Thing",
                                   "photo-tourist.subjects.ThingImage"];
  function ThingEditorController($scope, $q, $state, $stateParams, Thing, ThingImage) {
    var vm = this;
    vm.create = create;
    vm.clear = clear;
    vm.update = update;
    vm.remove = remove;
    vm.hasDirtyLinks = hasDirtyLinks;
    vm.updateImageLinks = updateImageLinks;

    vm.$onInit = function() {
      console.log("ThingEditorController", $scope);
      if ($stateParams.id) {
        $scope.$watch(function() { return vm.authz.authenticated; },
                      function() { reload($stateParams.id); });
      }
      else {
        newResource();
      }
    };

    return;
    //////////

    function newResource() {
      vm.item = new Thing();
      return vm.item;
    };

    function reload(thingId) {
      var itemId = thingId ? thingId : vm.item.id;
      console.log("re/loading thing:", itemId)
      vm.images = ThingImage.query({thing_id: itemId});
      vm.item = Thing.get({id:itemId});
      vm.images.$promise.then(
          function(){
            angular.forEach(vm.images, function(ti) {
                ti.originalPriority = ti.priority;
              });
        });
      $q.all([vm.item.$promise, vm.images.$promise]).catch(handleError);
    };

    function create() {
      $scope.thing_form.$setPristine();
      vm.item.errors = null;
      vm.item.$save().then(
        function(){
          $state.go(".", {id: vm.item.id});
        },
        handleError);
    };
    function clear() {
      newResource();
      $state.go(".",{id:null});
    };

    function update() {
      vm.item.errors = null;
      var update = vm.item.$update();
      updateImageLinks(update);
    };

    function updateImageLinks(promise) {
      console.log("Updating links to images");
      var promises = [];
      if (promise) { promises.push(promise); }
      angular.forEach(vm.images, function(ti) {
          if (ti.toRemove) {
            promises.push(ti.$remove());
          } else if (ti.originalPriority != ti.priority) {
            promises.push(ti.$update());
          }
        });

      console.log("Waiting for promises", promises);
      $q.all(promises).then(
        function(response) {
          console.log("promise.all response", response);
          $scope.thing_form.$setPristine();
          reload();
        },
        handleError);
    };

    function hasDirtyLinks() {
      for (var i=0; vm.images && i < vm.images.length; i++) {
        var ti = vm.images[i];
        if (ti.toRemove || (ti.originalPriority != ti.priority)) {
          return true;
        }
      }
      return false;
    };

    function remove() {
      vm.item.errors = null;
      vm.item.$delete().then(
        function(){
          console.log("remove complete", vm.item);
          clear();
        },
        handleError);
    };

    function handleError(response) {
      //console.log("Error", response);
      if (response.data) {
        vm.item["errors"] = response.data.errors;
      }
      if (!vm.item.errors) {
        vm.item.errors = {};
        vm.item["errors"]["full_messages"] = [response];
      };
      $scope.thing_form.$setPristine();
    };
  };

}());
