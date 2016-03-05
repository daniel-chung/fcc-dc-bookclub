// /public/ng-app/shared/app.js
'use strict';

// Declare app level module which depends on views, and components
angular.module('bookClubApp', [
	'ngRoute',
	'bookClubApp.headerView',
	'bookClubApp.homeView',
	'bookClubApp.loginView',
	'bookClubApp.registerView',
	'bookClubApp.mybooksView',
	'bookClubApp.allbooksView',
	'bookClubApp.settingView',
	'bookClubApp.testView'
])

.config(['$routeProvider', function ($routeProvider) {
	$routeProvider
		.otherwise({redirectTo: '/'});
}])

.run(function ($rootScope, $location, $route, AuthService) {
	$rootScope.$on('$routeChangeStart', function (event, next, current) {
		console.log('next', next.access);
		if (next.access.restricted && AuthService.isLoggedIn() === false) {
			$location.path('/login');
			$route.reload();
		}
	});
});
