'use strict';

angular.module('pdxpicApp')
  .controller('AuthCtrl', function($scope, authService, $location) {
    $scope.$watch( function () { return authService.user; }, function (user) {
      $scope.user = user;
    }, true);

    $scope.$watch( function () { return $location.path() }, function (path) {
      $scope.loginView = path === '/login';
    }, true);

    $scope.logout = function() {
      authService.auth.logout();
    };
  });