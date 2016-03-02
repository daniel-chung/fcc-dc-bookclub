'use strict';

(function(angular) {
angular
    .module('bookClubApp.testView', [
    	'ngRoute'
    ])

    .config(['$routeProvider', function($routeProvider) {
      $routeProvider.when('/test', {
        templateUrl: 'ng-app/components/test/testView.html',
        controller: 'testController',
        access: {restricted: true}
      });
    }])

    .controller('testController', [
    	'$scope',
    	function($scope) {
    		$scope.section = "This is a test view";
    		$scope.tagline = "this is an authorized space";
    }]);
})(window.angular);
