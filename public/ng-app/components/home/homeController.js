'use strict';

(function(angular) {
  angular
    .module('bookClubApp.homeView', [
    	'ngRoute'
    ])

    .config(['$routeProvider', function($routeProvider) {
      $routeProvider.when('/', {
        templateUrl: 'ng-app/components/home/homeView.html',
        controller: 'homeController',
        access: {restricted: false}
      });
    }])

    .controller('homeController', [
    	'$scope', 'AuthService',
    	function($scope, AuthService) {
            $scope.isLoggedIn = AuthService.isLoggedIn();                
            if ($scope.isLoggedIn)
            {
                $scope.section = "Landing page";
                $scope.tagline = "Welcome back!";
            }
            else {
                $scope.section = "Book Club";
                $scope.tagline = "Check out our book trading club!";
            }
    }]);
})(window.angular);
