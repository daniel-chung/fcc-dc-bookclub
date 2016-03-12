// /public/ng-app/components/setting/settingController.js

/**
 * TODO: Allow password changes 
 */

'use strict';

(function(angular) {
angular
  .module('bookClubApp.settingView', [
  	'ngRoute'
  ])

  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/setting', {
      templateUrl: 'ng-app/components/setting/settingView.html',
      controller: 'settingController',
      access: {restricted: true}
    });
  }])

  .controller('settingController', [
  	'$scope', 'AuthService', 'UserinfoService',
  	function($scope, AuthService, UserinfoService) {
  		$scope.section = "Setting";
  		$scope.tagline = "Update your personal settings!";

      $scope.updateFullname = function() {
        $scope.isLoggedIn = AuthService.isLoggedIn();
        if ($scope.isLoggedIn)
        {
          // Run code to POST to user data
          UserinfoService
            .updateFullname($scope.fullnameForm.firstname,
                            $scope.fullnameForm.lastname)

            // handle success
            .then(function () {
              //$location.path('/setting');
              $scope.disabled = false;
              $scope.fullnameForm = {};
            })

            // handle error
            .catch(function () {
              $scope.error = true;
              $scope.errorMessage = "Something went wrong!";
              $scope.disabled = false;
              $scope.fullnameForm = {};
            });
        }
        else {
          // return error
        }
      }

      $scope.updateLocation = function() {
        $scope.isLoggedIn = AuthService.isLoggedIn();
        if ($scope.isLoggedIn)
        {
          // Run code to POST to user data
          UserinfoService
            .updateLocation($scope.locationForm.newcity,
                            $scope.locationForm.newstate)

            // handle success
            .then(function () {
              //$location.path('/setting');
              $scope.disabled = false;
              $scope.locationForm = {};
            })

            // handle error
            .catch(function () {
              $scope.error = true;
              $scope.errorMessage = "Something went wrong!";
              $scope.disabled = false;
              $scope.locationForm = {};
            });
        }
        else {
          // return error
        }
      }

      $scope.changePassword = function() {
        $scope.isLoggedIn = AuthService.isLoggedIn();
        var userName = AuthService.getUserName();

        if ($scope.isLoggedIn)  // should be true
        {
          // Run code to POST to user data
          AuthService
            .changePassword(userName,
                            $scope.passwordForm.oldpassword,
                            $scope.passwordForm.newpassword)

            // handle success
            .then(function () {
              $location.path('/mybooks');
              $scope.disabled = false;
              $scope.passwordForm = {};
            })

            // handle error
            .catch(function () {
              $scope.error = true;
              $scope.errorMessage = "Something went wrong!";
              $scope.disabled = false;
              $scope.passwordForm = {};
            });
        }
        else {
          // return error
        }



      }

    }]);

})(window.angular);
