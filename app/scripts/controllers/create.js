'use strict';

angular.module('pdxpicApp')
  .controller('CreateCtrl', function CreateCtrl($scope, $location, angularFire, authService) {
    $scope.$watch(function () { return authService.user; }, function (user) {
      // No user? Re-direct to login.
      if (!user) {
        $location.path('/login');
      }
    }, true);

    var url = 'https://momdd.firebaseio.com/events';
    var promise = angularFire(url, $scope, 'events', []);
    $scope.createEvent = function () {
      $scope.events.push({title: this.title, description: this.description});
      $location.path("/");
    };
  });