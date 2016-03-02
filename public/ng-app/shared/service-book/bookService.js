// Create BookService factory ------------------------------------------------------
angular.module('bookClubApp').factory('BookService',
  ['$q', '$timeout', '$http',
  function ($q, $timeout, $http) {

    function addBook(bookName) {
      var deferred = $q.defer();
      $http.post('/books/add', {bookName: bookName})
        .success(function(data, status) {
          if (status === 200 && data.status) {
            deferred.resolve(data);
          } else {
            deferred.reject();
          }
        })
        .error(function(data) {
          deferred.reject();
        });
        return deferred.promise;
    }

    function removeBook(bookId) {
      var deferred = $q.defer();
      $http.post('/books/remove', { _id: bookId })
        .success(function(data, status) {
          if (status === 200 && data.status) {
            deferred.resolve(data);
          } else {
            deferred.reject();
          }
        })
        .error(function(data) {
          deferred.reject();
        });
        return deferred.promise;
    }

    function withdrawTrade(tradeId) {
      var deferred = $q.defer();
      $http.post('/trade/withdraw', { _id: tradeId })
        .success(function(data, status) {
          if (status === 200 && data.status) {
            deferred.resolve(data);
          } else {
            deferred.reject();
          }
        })
        .error(function(data) {
          deferred.reject();
        });
        return deferred.promise;
    }

    // return available functions for uses in controllers
    return ({
      addBook: addBook,
      removeBook: removeBook,
      withdrawTrade: withdrawTrade
    });
}]);
