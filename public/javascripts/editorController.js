app.controller("editorController",function($scope,$http,$interval,$location,$window,authentication){
  $scope.new_title = "Title";
  $scope.new_content = "What's going on your mind?";
  $scope.adddisplay = true;
  $scope.articleLoading = true;
  $scope.addArticle = false;  
  var articleId;
  var updatearticle = {};

  $interval(function(){
    $scope.today_date = Date.now();
  },800);

  $scope.addButton = function(){
    $scope.new_title = "Title";
    $scope.new_content = "What's going on your mind?";
    $scope.adddisplay = true;
    $scope.articledisplay = false;
    $scope.todoNumber = -1;
    updatearticle = {};
    $scope.upArticle() = false;
    if(!$scope.adddisplay){
      $scope.upArticle = function(){
        console.log('Put API Working');
        updatearticle.title = $scope.new_title;
        updatearticle.note = $scope.new_content;
        $scope.postingArticle = true;            
        $http.put('/articles/' + updatearticle._id , updatearticle, {
          headers:{
            Authorization:"Bearer "+  authentication.getToken()
          }
        }).success(function(data){
          console.log(data);
          $scope.postingArticle = false;
        });
      };
    }
  };

  $scope.logOut = function(){
    authentication.logout();
    $location.path("/");
  };

  if(!authentication.isLoggedIn){
    $location.path("/");
    return;
  } 

  $scope.currentusername = authentication.currentUser().name;

  var newArticle = {
    title: "",
    note: "",
    note_date: ""
  };

  $scope.articles=[];
  var addedArticle;

  $scope.newEntry = function(){
    newArticle.title =  $scope.new_title;
    newArticle.note = $scope.new_content;
    newArticle.note_date = Date.now();
    $scope.postingArticle = true;
    if($scope.new_title && $scope.new_title != "Title"){
    $http.post("/articles", newArticle, {
      headers:{
        Authorization:"Bearer "+ authentication.getToken()
      }
    }).success(function(data){
      $scope.articles = data;
      addedArticle = $scope.articles[0];
      $scope.detail(addedArticle);
      $scope.addArticle = false;
      $scope.todoNumber = 0;
      $scope.postingArticle = false;      
    });  
        
      // $scope.todos.unshift(newArticle);
    } else {
      $scope.new_title = "Sorry, Can't be Empty!";
    };

      newArticle = {title: "",note: " ",note_date: ""};
    };

      $http.get("/articles",{
        headers: {
          Authorization:"Bearer "+ authentication.getToken()
        }
      }).success(function(data){
          $scope.articles = data;
          $scope.articleLoading = false;
          if(data.length == 0) {
            $scope.addArticle = true;
          } else {
            $scope.addArticle = false;
          }
      });

      $scope.detail = function ( article ) {
        $scope.new_title = article.title;
        $scope.new_content = article.note;
        articleId = article._id;
        console.log(articleId);
        $scope.articledisplay = true;
        $scope.adddisplay = false;
        updatearticle = article;
        if(!$scope.adddisplay){
          $scope.upArticle = function(){
            console.log('Put API Working');
            updatearticle.title = $scope.new_title;
            updatearticle.note = $scope.new_content;
            $scope.postingArticle = true;            
            $http.put('/articles/' + updatearticle._id , updatearticle, {
              headers:{
                Authorization:"Bearer "+  authentication.getToken()
              }
            }).success(function(data){
              console.log(data);
              $scope.postingArticle = false;
            });
          };
        }
    };

     
 
  
  $scope.todoNumber = -1;
  $scope.setNumber = function(index){
    $scope.todoNumber = index;
  };

  $scope.delete = function(){
  console.log(articleId);
    
    $http.delete('/articles/'+articleId,{
        headers: {
          Authorization:"Bearer "+ authentication.getToken()
        }
     }).success(function(data){
      $scope.articles = data;
      if($scope.articles.length > 0 ){
        $scope.new_title = $scope.articles[0].title;
        $scope.new_content = $scope.articles[0].note;
        $scope.todoNumber = 0;      
     }else {
       $scope.new_title = "Title";
        $scope.new_content = "What's going on your mind?";
        $scope.adddisplay = true;
        $scope.articledisplay = false;
        $scope.todoNumber = -1;
     }
    })
  };

  
  

  // $scope.logOut() = authentication.logout;

  $scope.bold = function() {
      document.execCommand('bold', false, null);
  };
  $scope.italic = function() {
      document.execCommand('italic', false, null);
  };
  $scope.underline = function() {
      document.execCommand('underline', false, null);
  };


});
