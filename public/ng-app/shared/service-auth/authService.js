// /public/ng-app/shared/service-auth/authService.js
'use strict';


// Create AuthService factory ------------------------------------------------------
angular.module('bookClubApp').factory('AuthService',
  ['$q', '$timeout', '$http',
  function ($q, $timeout, $http) {
    var user = null;
    var gUsername = '';

    function isLoggedIn() {
      console.log('user', user);
      if (user)
        return true;
      else
        return false;
    };

    function getUserStatus() {
      return user;
    }

    function getUserName() {
      return gUsername;
    }

    function login(username, password) {
      // create a new instance of deferred
      var deferred = $q.defer();
      
      $http.post('/user/login', {username: username, password: password})
        .success(function (data, status) {
          console.log('data status', data.status, status);
          if (status === 200) {
            user = true;
            gUsername = username;
            deferred.resolve();
          } else {
            user = false;
            gUsername = '';
            deferred.reject();
          }
        })
        .error(function (data) {
          user = false;
          gUsername = '';
          deferred.reject();
        });
        return deferred.promise;
    };

    function logout() {
      var deferred = $q.defer();
      $http.get('/user/logout')
        .success(function (data) {
          user = false;
          gUsername = '';
          deferred.resolve();
        })
        .error(function (data) {
          user = false;
          gUsername = '';
          deferred.reject();
        });
        return deferred.promise;
    };

    function register(username, password) {
      var deferred = $q.defer();
      $http.post('/user/register', {username: username, password: password})
        .success(function(data, status) {
          if (status === 200) {
            deferred.resolve();
          } else {
            deferred.reject();
          }
        })
        .error(function(data) {
          deferred.reject();
        });
        return deferred.promise;
    };

    function changePassword(username, oldpassword, newpassword) {
      console.log("inside authService changepassword");
      
      var deferred = $q.defer();
      // need to hash?

      $http.post('/user/changepassword', {
        username: username, password: oldpassword, newpassword: newpassword
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

    // return available functions for uses in controllers
    return ({
      isLoggedIn: isLoggedIn,
      getUserStatus: getUserStatus,
      getUserName: getUserName,
      login: login,
      logout: logout,
      register: register,
      changePassword: changePassword
    });
}]);

