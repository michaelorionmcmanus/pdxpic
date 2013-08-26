'use strict';

angular.module('pdxpicApp')
  .controller('MainCtrl', ['$scope', 'angularFire',
    function MainCtrl($scope, angularFire) {
      var url = 'https://momdd.firebaseio.com/events';
      var promise = angularFire(url, $scope, 'events', []);
  }]);
