(function() {
  "use strict";

  angular
    .module("photo-tourist.subjects")
    .component("ptImageSelector", {
        templateUrl: imageSelectorTemplateUrl,
        controller: ImageSelectorController,
        bindings: {
          authz: "<"
        }
    })
    .component("ptImageEditor", {
        templateUrl: imageEditorTemplateUrl,
        controller: ImageEditorController,
        bindings: {
          authz: "<"
        },
        require: {
          imagesAuthz: "^ptImagesAuthz"
        }
    });

  imageSelectorTemplateUrl.$inject = ["photo-tourist.config.APP_CONFIG"];
  function imageSelectorTemplateUrl(APP_CONFIG) {
    return APP_CONFIG.image_selector_html;
  };

  ImageSelectorController.$inject = ["$scope",
                                     "$stateParams",
                                     "photo-tourist.authz.Authz",
                                     "photo-tourist.subjects.Image",
                                     "photo-tourist.subjects.ImageThing",
                                     "photo-tourist.subjects.ImageLinkableThing"];
  function ImageSelectorController($scope, $stateParams, Authz, Image,
                                   ImageThing, ImageLinkableThing) {
    var vm = this;

    vm.$onInit = function() {
      console.log("ImageSelectorController", $scope);
      $scope.$watch(Authz.getAuthorizedUserId,
                    function() {
                      if (!$stateParams.id) {
                        vm.items = Image.query();
                      }
                    });
    };

    return;
    //////////
  };

  imageEditorTemplateUrl.$inject = ["photo-tourist.config.APP_CONFIG"];
  function imageEditorTemplateUrl(APP_CONFIG) {
    return APP_CONFIG.image_editor_html;
  };

  ImageEditorController.$inject = ["$scope",
                                   "$q",
                                   "$state",
                                   "$stateParams",
                                   "photo-tourist.authz.Authz",
                                   "photo-tourist.subjects.Image",
                                   "photo-tourist.subjects.ImageThing",
                                   "photo-tourist.subjects.ImageLinkableThing"];
  function ImageEditorController($scope, $q, $state, $stateParams, Authz, Image,
                                 ImageThing, ImageLinkableThing) {
    var vm = this;
    vm.selected_linkables = [];
    vm.create = create;
    vm.clear = clear;
    vm.update = update;
    vm.remove = remove;

    vm.$onInit = function() {
      console.log("ImageEditorController", $scope);
      $scope.$watch(Authz.getAuthorizedUserId,
                    function() {
                      if ($stateParams.id) {
                        reload($stateParams.id);
                      }
                      else {
                        newResource();
                      }
                    });
    };

    return;
    //////////

    function newResource() {
      console.log("New resource");
      vm.item = new Image();
      vm.imagesAuthz.newItem(vm.item);
      return vm.item;
    };

    function reload(imageId) {
      var itemId = imageId ? imageId : vm.item.id;
      console.log("re/loading image:", itemId)
      vm.item = Image.get({id:itemId});
      vm.things = ImageThing.query({image_id: itemId});
      vm.linkable_things = ImageLinkableThing.query({image_id: itemId});
      vm.imagesAuthz.newItem(vm.item);
      $q.all([vm.item.$promise,
              vm.things.$promise,
              vm.linkable_things.$promise]).catch(handleError);
    };

    function create() {
      $scope.image_form.$setPristine();
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
      linkThings(update);
    };

    function linkThings(parentPromise) {
      var promises = [];
      if (parentPromise) { promises.push(parentPromise); }
      angular.forEach(vm.selected_linkables, function(linkable){
          var resource = ImageThing.save({image_id:vm.item.id}, {thing_id: linkable});
          promises.push(resource.$promise);
        });

      vm.selected_linkables = [];
      console.log("waiting for promises", promises);
      $q.all(promises)
        .then(function(response){
            console.log("promise.all response", response);
            $scope.image_form.$setPristine();
            reload();
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
      $scope.image_form.$setPristine();
    };
  };

}());
