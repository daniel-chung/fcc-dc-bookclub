// /public/ng-app/components/mybooks/mybooksController.js
'use strict';

(function(angular) {
  angular
    .module('bookClubApp.mybooksView', [
      'ngRoute'
    ])
    .config(['$routeProvider', function($routeProvider) {
      $routeProvider.when('/mybooks', {
        templateUrl: 'ng-app/components/mybooks/mybooksView.html',
        controller: 'mybooksController',
        access: {restricted: true}
      });
    }]);

  angular
    .module('bookClubApp.mybooksView')
    .controller('mybooksController',
      ['$scope', '$http', 'BookService', 'UserinfoService',
      function ($scope, $http, BookService, UserinfoService) {

        $scope.section = "Profile";
        $scope.tagline = 'Add your books or review pending trades!';

      // On load, retrieve data:
        // Personal info
        $http.get('/setting/getinfo').
          success(function(data, status, headers, config) {
            $scope.userinfo = {};
            $scope.userinfo.firstname = data.firstname;
            $scope.userinfo.lastname = data.lastname;
            $scope.userinfo.city = data.city;
            $scope.userinfo.state = data.state;
          }).
          error(function(data, status, headers, config) {
            // log error
          });

        // Your books
        $http.get('/books/user').
          success(function(data, status, headers, config) {
            $scope.userbooks = data;
          }).
          error(function(data, status, headers, config) {
            // log error
          });

        // Your requested trades
        $http.get('/trade/requested').
          success(function(data, status, headers, config) {
            console.log("mybooks controller", data);
            $scope.tradesrequested = data;
          }).
          error(function(data, status, headers, config) {
            // log error
          });

        // Your trade offers
        $http.get('/trade/received').
          success(function(data, status, headers, config) {
            console.log("mybooks controller", data);
            $scope.tradesreceived = data;
          }).
          error(function(data, status, headers, config) {
            // log error
          });


    }]);

  angular
    .module('bookClubApp.mybooksView')
    .controller('myBooksUpdateController',
      ['$scope', '$http', '$route', 'BookService', 
      function ($scope, $http, $route, BookService) {
        $scope.addBook = function () {
          $scope.error = false;
          $scope.disabled = true;
          console.log('previous');

          // call register from service
          BookService.addBook($scope.addNewBook.bookname)
            .then(function (data) {     // <--- this doesn't seem to work.
              //console.log('addBook inside', data);
              //$scope.section = "testing!";
              //console.log('inside');          // <--- need to figure out how to refresh
              //$location.path('/myBooks');
            })
            .catch(function () {
              $scope.error = true;
              $scope.errorMessage = "Something went wrong!";
            });

          console.log('end');
          $scope.disabled = false;
          $scope.addNewBook = {};
          $route.reload();
        };

        $scope.removeBook = function () {
          $scope.error = false;
          $scope.disabled = true;

          // call register from service
          BookService.removeBook(this.book._id)
            .then(function (data) {     // <--- this doesn't seem to work.
            })
            .catch(function () {
              $scope.error = true;
              $scope.errorMessage = "Something went wrong!";
            });

          $scope.disabled = false;
          $route.reload();
        };


        $scope.withdrawTrade = function () {
          $scope.error = false;
          $scope.disabled = true;
          
          // call register from service
          BookService.withdrawTrade(this.tradereq._id)
            .then(function (data) {     // <--- this doesn't seem to work.
            })
            .catch(function () {
              $scope.error = true;
              $scope.errorMessage = "Something went wrong!";
            });

          $scope.disabled = false;
          $route.reload();

        };



    // acceptTrade()
        $scope.acceptTrade = function () {
          $scope.error = false;
          $scope.disabled = true;
          
          // call register from service
          BookService.acceptTrade(this.traderec._id)
            .then(function (data) {     // <--- this doesn't seem to work.
            })
            .catch(function () {
              $scope.error = true;
              $scope.errorMessage = "Something went wrong!";
            });

          $scope.disabled = false;
          $route.reload();

        };

    // declineTrade()
        $scope.declineTrade = function () {
          console.log(this.traderec);

          $scope.error = false;
          $scope.disabled = true;
          
          // call register from service
          BookService.declineTrade(this.traderec._id)
            .then(function (data) {     // <--- this doesn't seem to work.
            })
            .catch(function () {
              $scope.error = true;
              $scope.errorMessage = "Something went wrong!";
            });

          $scope.disabled = false;
          $route.reload();

        };

    }]);



})(window.angular);
