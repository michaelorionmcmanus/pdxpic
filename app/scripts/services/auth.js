angular.module("pdxpicApp").factory("authService", function($rootScope){
  var out = {
    user: null
  };

  var authRef = new Firebase("https://momdd.firebaseio.com/");
  var fireAuth = new FirebaseSimpleLogin(authRef, function(error, user) {
    if (user) {
      out.user = user;
      $rootScope.$apply();
    } else if (error) {
      out.user = null;
    } else {
      out.user = null;
    };
  });

  out.auth = fireAuth;

  return out;
});