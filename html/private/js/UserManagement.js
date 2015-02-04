
function createUser(username, password,defaultBank){
  $.ajax({
    url: "/Users",
    type: "POST",
    //dataType: "json",
    contentType: "json",
    data: JSON.stringify({username:username, password:password, defaultBank:defaultBank}),
    success: function(data){
      console.log("usercreated");
    },
    error: function(data){
      console.log("userfailedToCreate");
    }
  })
};


function UpdateUser(username, password,defaultBank){
    $.ajax({
      url: "/Users",
      type: "PUT",
      contentType: "json",
      data: JSON.stringify({username:username, password:password,defaultBank:defaultBank}),
      success: function(data){
        console.log("user updated");
      },
      error: function(data){
        console.log("userfailedToUpdate");
      }
    })
  }
