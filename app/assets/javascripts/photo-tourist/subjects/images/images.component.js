(function() {
  "use strict";

  angular
    .module("photo-tourist.subjects")
    .component("ptImageSelector", {
        templateUrl: imageSelectorTemplateUrl,
        controller: ImageSelectorController
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

}());
