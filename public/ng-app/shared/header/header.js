'use strict';

(function(angular) {
  angular
    .module('bookClubApp.headerView', [
      'ngRoute'
    ])
    .controller('headerController', ['$scope', function($scope) {
    }]);

  angular.module('bookClubApp.headerView')
    .directive('header1', function() {
      return {
        templateUrl: 'ng-app/shared/header/header1.html'
      };
    });

  angular.module('bookClubApp.headerView')
    .directive('header2', function() {
      return {
        templateUrl: 'ng-app/shared/header/header2.html',
        controller: 'logoutController'
      };
    });
})(window.angular);
