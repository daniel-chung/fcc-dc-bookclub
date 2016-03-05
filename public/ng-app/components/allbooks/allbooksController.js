// /public/ng-app/components/allbooks/allbooksController.js
'use strict';

(function(angular) {
  angular
    .module('bookClubApp.allbooksView', [
      'ngRoute'
    ])
    .config(['$routeProvider', function($routeProvider) {
      $routeProvider.when('/allbooks', {
        templateUrl: 'ng-app/components/allbooks/allbooksView.html',
        controller: 'allbooksController',
        access: {restricted: true}
      });
    }]);

  angular
    .module('bookClubApp.allbooksView')
    .controller('allbooksController',
      ['$scope', '$http', '$location', 'BookService', 
      function ($scope, $http, $location, BookService) {
        $scope.section = "All Books";
        $scope.tagline = 'Here are all of the books!';

        // Function to initiate trade
        $scope.trade = function() {
          var targetBookId = this.book._id;
          //console.log("selected:", targetBookId);
          $http.get('/trade/id/' + targetBookId)
            .success(function(){
              $location.path('/mybooks');
            })
            .error(function(){
              // handle error
            });

          /**
           * Create a trade model
           *  : store book id & the initiator's name
           *  : surface these trades on user profile page
           *  : give an option to accept/reject
           *  --> accept: update book model
           *  --> reject: delete trade model
           */

        };


        // On load, retrieve data
        $http.get('/books/all')
          .success(function(data, status, headers, config) {
            $scope.allbooks = data;
          })
          .error(function(data, status, headers, config) {
          // log error
          });


      }]);
})(window.angular);
