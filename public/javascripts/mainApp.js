var app = angular.module("mainApp",["ngRoute"]);

app.config(function($routeProvider, $locationProvider){
  
  $routeProvider

  .when("/", {
    templateUrl: "templates/login.html"
  })
  .when("/app", {
    templateUrl: "templates/app.html",
  });

  $locationProvider.html5Mode(true);
});

app.directive("contenteditable", function() {
  return {
    restrict: "A",
    require: "ngModel",
    link: function(scope, element, attrs, ngModel) {

      function read() {
        ngModel.$setViewValue(element.html());
      }

      ngModel.$render = function() {
        element.html(ngModel.$viewValue || "");
      };

      element.bind("blur keyup change", function() {
        scope.$apply(read);
      });
    }
  };
});

// app.factory("authentication", function($http,$window){

//   var saveToken = function(token) {
//     $window.localStorage['mysteryToken'];
//   };

//   var getToken = function(){
//     return $window.localStorage['mysteryToken'];
//   };

//   var logout = function(){
//     $window.localStorage.removeItem('mysteryToken');
//   };

//   return {
//       saveToken : saveToken,
//       getToken : getToken,
//       logout : logout
//     };

// });