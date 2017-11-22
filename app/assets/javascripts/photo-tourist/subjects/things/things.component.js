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
                                     "photo-tourist.subjects.Thing"];
  function ThingSelectorController($scope, $stateParams, Thing) {
    var vm = this;
    vm.canQuery = canQuery;

    vm.$onInit = function() {
      console.log("ThingSelectorController", $scope);
      if (!$stateParams.id) {
        vm.items = Thing.query();
      }
    };

    activate();
    return;
    //////////
    function activate() {
      $scope.$watch(vm.canQuery, updateCanQuery);
    }
    function canQuery() {
      return vm.authz.canQuery;
    }
    function updateCanQuery(canQuery, prevQuery) {
      if (canQuery) {
        if (!$stateParams.id) {
          vm.items = Thing.query();
        }
      } else {
        vm.items = null;
      }
    }
  };

  thingEditorTemplateUrl.$inject = ["photo-tourist.config.APP_CONFIG"];
  function thingEditorTemplateUrl(APP_CONFIG) {
    return APP_CONFIG.thing_editor_html;
  };

  ThingEditorController.$inject = ["$scope",
                                   "$state",
                                   "$stateParams",
                                   "photo-tourist.subjects.Thing"];
  function ThingEditorController($scope, $state, $stateParams, Thing) {
    var vm = this;
    vm.create = create;
    vm.clear = clear;
    vm.update = update;
    vm.remove = remove;

    vm.$onInit = function() {
      console.log("ThingEditorController", $scope);
      if ($stateParams.id) {
        vm.item = Thing.get({id:$stateParams.id});
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
      $scope.thing_form.$setPristine();
      vm.item.errors = null;
      vm.item.$update().then(
        function(){
          console.log("update complete", vm.item);
          $state.reload();
        },
        handleError);
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
    };
  };

}());
