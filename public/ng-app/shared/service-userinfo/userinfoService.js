// /public/ng-app/shared/service-userinfo/userinfoService.js
'use strict';


// Create UserinfoService factory ----------------------------------------------
angular.module('bookClubApp').factory('UserinfoService',
  ['$q', '$timeout', '$http',
  function ($q, $timeout, $http) {
    function updateFullname(firstname, lastname) {
      // create a new instance of deferred
      var deferred = $q.defer();
      $http.post('/setting/fullname', 
        { 
          firstname: firstname, 
          lastname: lastname 
        })
        .success(function (data, status) {
          if (status === 200 && data.status) {
            deferred.resolve();
          } else {
            deferred.reject();
          }
        })
        .error(function (data) {
          deferred.reject();
        });
        return deferred.promise;
    };

    function updateLocation(newcity, newstate) {
      // create a new instance of deferred
      var deferred = $q.defer();
      $http.post('/setting/location', 
        { 
          city: newcity, 
          state: newstate 
        })
        .success(function (data, status) {
          if (status === 200 && data.status) {
            deferred.resolve();
          } else {
            deferred.reject();
          }
        })
        .error(function (data) {
          deferred.reject();
        });
        return deferred.promise;
    };

    function getUserInfo() {
      var deferred = $q.defer();
      $http.get('/setting/getinfo')
        .success(function (data, status) {
          console.log("userinfoservice getUserInfo", data);
          if (status === 200 && data.status)
            deferred.resolve(data);
          else
            deferred.reject();
        })
        .error(function (data) {
          deferred.reject();
        });
        return deferred.promise;
    };

    // return available functions for uses in controllers
    return ({
      updateFullname: updateFullname,
      updateLocation: updateLocation,
      getUserInfo: getUserInfo
    });
}]);

