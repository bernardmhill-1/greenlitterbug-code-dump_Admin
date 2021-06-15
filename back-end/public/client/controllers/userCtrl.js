angular.module('userCtrl', ['ngFileUpload'])
  .controller('UserSignupController', function($location, $window, $scope, Upload, User){
      var vm = this;

      vm.signupUser = function(){
        vm.message = "";
          User.signupUser(vm.userData, $scope.file)
            .then(function(response){
              vm.userData = {};
              console.log(response.data.message);
              $location.path('/');
          })
      };

  });
