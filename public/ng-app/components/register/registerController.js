'use strict';

(function(angular) {
angular
  .module('bookClubApp.registerView', [
  	'ngRoute'
  ])

  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/register', {
      templateUrl: 'ng-app/components/register/registerView.html',
      controller: 'registerController',
      access: {restricted: false}
    });
  }])

  .controller('registerController', [
    '$scope', '$location', 'AuthService',
  	function($scope, $location, AuthService) {
  		$scope.section = "Register";
  		$scope.tagline = "Sign up!";

      console.log(AuthService.getUserStatus());
      $scope.register = function () {

        // initial values
        $scope.error = false;
        $scope.disabled = true;

        // call register from service
        AuthService
          .register($scope.registerForm.username,
            $scope.registerForm.password)

          // handle success
          .then(function () {
            $location.path('/login');
            $scope.disabled = false;
            $scope.registerForm = {};
          })

          // handle error
          .catch(function () {
            $scope.error = true;
            $scope.errorMessage = "Something went wrong!";
            $scope.disabled = false;
            $scope.registerForm = {};
          });
      };
  }]);
})(window.angular);




