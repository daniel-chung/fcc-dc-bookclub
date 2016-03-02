'use strict';

(function(angular) {
angular
  .module('bookClubApp')
  .controller('logoutController',
    ['$scope', '$location', '$route', 'AuthService',
    function ($scope, $location, $route, AuthService) {
      $scope.logout = function () {
        console.log(AuthService.getUserStatus());

        // call logout from service
        AuthService.logout()
          .then(function () {
            $location.path('/');
            $route.reload();
          });
      };
  }]);
})(window.angular);
