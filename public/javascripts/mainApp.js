var app = angular.module("mainApp",['ngRoute','ngAnimate']);

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

app.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });
 
                event.preventDefault();
            }
        });
    };
});
