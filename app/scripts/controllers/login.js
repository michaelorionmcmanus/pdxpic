'use strict';

angular.module('pdxpicApp')
  .controller('LoginCtrl', function($scope, authService, $location) {
    $scope.$watch( function () { return authService.user; }, function (user) {
      $scope.user = user;

      if(user) {
        $location.path('/');
      }

    }, true);

    $scope.logout = function() {
      authService.fireAuth.logout();
    };

    $scope.submit = function() {
      authService.auth.login('password', {
        email: this.email,
        password: this.password
      });
    };
  });