'use strict';

(function(angular) {
angular
    .module('bookClubApp.aboutView', [
    	'ngRoute'
    ])

    .config(['$routeProvider', function($routeProvider) {
      $routeProvider.when('/about', {
        templateUrl: 'ng-app/components/about/aboutView.html',
        controller: 'aboutController',
        access: {restricted: false}
      });
    }])

    .controller('aboutController', [
    	'$scope',
    	function($scope) {
    		$scope.section = "About us";
    		$scope.tagline = "Check out the book trading club!";
    }]);
})(window.angular);
