(function() {
  "use strict";

  angular
    .module("photo-tourist.subjects")
    .component("ptImageSelector", {
        templateUrl: imageSelectorTemplateUrl,
        controller: ImageSelectorController
    })
    .component("ptImageEditor", {
        templateUrl: imageEditorTemplateUrl,
        controller: ImageEditorController
    });

  imageSelectorTemplateUrl.$inject = ["photo-tourist.config.APP_CONFIG"];
  function imageSelectorTemplateUrl(APP_CONFIG) {
    return APP_CONFIG.image_selector_html;
  };

  ImageSelectorController.$inject = ["$scope",
                                     "$stateParams",
                                     "photo-tourist.subjects.Image"];
  function ImageSelectorController($scope, $stateParams, Image) {
    var vm = this;

    vm.$onInit = function() {
      console.log("ImageSelectorController", $scope);
      if (!$stateParams.id) {
        vm.items = Image.query();
      }
    };

    return;
    //////////
  };

  imageEditorTemplateUrl.$inject = ["photo-tourist.config.APP_CONFIG"];
  function imageEditorTemplateUrl(APP_CONFIG) {
    return APP_CONFIG.image_editor_html;
  };

  ImageEditorController.$inject = ["$scope",
                                   "$stateParams",
                                   "photo-tourist.subjects.Image"];
  function ImageEditorController($scope, $stateParams, Image) {
    var vm = this;

    vm.$onInit = function() {
      console.log("ImageEditorController", $scope);
      if ($stateParams.id) {
        vm.item = Image.get({id:$stateParams.id});
      }
      else {
        newResource();
      }
    };

    return;
    //////////

    function newResource() {
      vm.item = new Image();
      return vm.item;
    };
  };

}());
