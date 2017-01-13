app.controller("loginController", function($scope,$http,$location,$window,authentication){

  if(authentication.isLoggedIn()){
    $location.path('/app');
  }

  $scope.credentials = {  
    name:"",
    username :"",
    email:"",
    password:""
  };

  $scope.signingUp = function(){
    $scope.credentials.name = $scope.fullName;
    $scope.credentials.username = $scope.userNameSignup;
    $scope.credentials.email = $scope.email;

    if($scope.passwordSignup == $scope.confirmPassword && $scope.confirmPassword.length >= 8){
      $scope.credentials.password = $scope.confirmPassword;
    } 

    $http.post("/register",$scope.credentials).success(function(data){
      authentication.saveToken(data.token);
    }).then(function(){
      $location.path('/app');
    });

    $scope.credentials = {  
      name:"",
      username :"",
      email:"",
      password:""
    };

  };

  $scope.logCreds = {
    username : "",
    password : ""
  };

  $scope.logingIn = function(){

    $scope.logCreds.username = $scope.userNameLogin;
    $scope.logCreds.password = $scope.passwordLogin;

    console.log($scope.logCreds);

    $http.post("/login",$scope.logCreds).success(function(data){
      authentication.saveToken(data.token);
    }).then(function(){
      $location.path('app');
    });

    $scope.logCreds = {
      username : "",
      password:""
    };

  };



});