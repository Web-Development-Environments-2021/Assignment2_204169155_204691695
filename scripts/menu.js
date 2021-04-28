var users = [];
var active_user = null;
var logged_user = false;

$(document).ready(function(){
  $("#Logout_nav").hide();
  $("#Welcome_content").show();
  $("#Game_content").hide();
  $("#Settings_content").hide();
  $("#Play_btn").hide();
  $("#Play_nav").hide();
  $("#Logout_nav").hide();
  $("#Login_content").hide();
  $("#Register_content").hide();
  $("#alert_login").hide();
  $("#alert_register").hide();
  // init first user
  const first_uesr = {
    firstname : "Pac",
    lastname : "Man",
    username : "k",
    password : "k",
    email : "k@pacman.com",
    birthday: "01/01/01",
  };
  users.push(first_uesr);
  // --- Login  functions
  
  $("#sign_in_btn").click(function () {
    var username = $('#login_username').val();
    var password = $('#login_password').val();
    var valid = false;
    var msg = "";
    $("#alert_details_login").empty();
    $("#alert_login").hide();
    if (username == "") {
      valid = false;
      msg += "Username cant be empty <br >";
    }
    if (password == "") {
      valid = false;
      msg += "Password cant be empty <br >";
    }
    users.forEach(user => {
      if(user.username === username && user.password === password){
        active_user = user;
        valid = true;
        logged_user = true;   
      }
    });
    if (!logged_user){
      msg+= "Incorrect details, Try Again! <br >";
    }
    if (!valid){
      $("#alert_details_login").empty();
      $("#alert_details_login").html(msg);
      $("#alert_login").show();
    }
    else{
     hide_everyhing();
     $("#Welcome_content").hide();
     $("#Play_btn").show();
     $("#Play_nav").show();
     $("#Login_nav").hide();
     $("#Login_btn").hide();
     $("#Register_nav").hide();
     $("#Register_btn").hide();
     $("#Logout_nav").show();
     $("#Settings_content").show();
     $("#welcom-user").html("Welcome " + active_user.username);
     $("#5points").val("#FFFFFF");
     $("#15points").val("#7495E0");
     $("#25points").val("#E34C27");
    }    
  });
});

// -------- Content change 
$("#Welcome_nav").click(function(){
  hide_everyhing();
  $("#Welcome_content").show();
  StopBackMusic();
});
// -- login
$("#Login_nav, #Login_btn").click(function() {
    hide_everyhing();
    $("#Login_content").show();
    StopBackMusic();
});
// -- register
$("#Register_nav, #Register_btn").click(function() {
  hide_everyhing();
  $("#Register_content").show();
  StopBackMusic();

});
$("#submit_register").click(function(){
  
  var valid = true;
  var username = $('#register_username').val();
  var firstname = $('#register_firstname').val();
  var lastname = $('#register_lastname').val();
  var email = $('#register_email').val();
  var password = $('#register_password').val();
  var birthday = $('#days').val() + '/' + $('#months').val() + '/' + $('#years').val();
  var msg = "";
  $("#alert_details_register").empty();
  $("#alert_register").hide();

  if(firstname !== ""){
    if (/[^a-zA-Z]/.test(firstname)){
      valid = false;
      msg += "firstname cant contain numbers <br >";
      //$('#register_firstname').css("border","red");
    }
  }else {
    valid = false;
    msg += "firstname cant be empty <br >";
  }

  if(lastname !== ""){
    if (/[^a-zA-Z]/.test(lastname)){
      valid = false;
      msg += "lastname cant contain numbers <br >";
    }
  } else {
    valid=false;
    msg += "lastname cant be empty <br >";
  }

  if(username !== ""){
    users.forEach(user => {
      if (user.username === username){
        valid = false;
        msg += "username already exsits, please choose new username <br >";
      }
    });
  } else {
    valid=false;
    msg += "username cant be empty <br >";
  }

  if(email !== ""){
    var mailformat = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!email.match(mailformat)){
      valid = false;
      msg += "Incorrect Email format, Please try again <br >";
    }
  } else {
    valid=false;
    msg += "Email cant be empty <br >";
  }
  
  if(password !== ""){
    if (password.length >= 6){
      var passFormat = /(?=.*\d)(?=.*[A-Za-z])/;
      if (!password.match(passFormat)){
        valid = false;
        msg += "Incorrect Password format, password must contain at least 1 lettet and 1 number <br >";
      }
    }else{
      valid=false;
      msg += "password must contain at least 6 characters <br >";
    }
  } else {
    valid=false;
    msg += "password cant be empty <br >";
  }

  if (!valid){
    $("#alert_details_register").empty();
    $("#alert_details_register").html(msg);
    $("#alert_register").show();
  }
  //correct register form
  else{
    const new_preson = {
      firstname,
      lastname,
      username,
      password,
      email,
      birthday,
    };
    users.push(new_preson);
    alert("Succesfuly registerd")
    $("#Register_content").hide();
    $("#Login_content").show();
  }
});

$("#Logout_nav, #Logout_btn").click(function() {
  hide_everyhing();
  active_user = "";
  logged_user = false;
  $("#Welcome_content").show();
  $("#Play_btn").hide();
  $("#Play_nav").hide();
  $("#Login_nav").show();
  $("#Login_btn").show();
  $("#Register_nav").show();
  $("#Register_btn").show();
  $("#Logout_nav").hide();
  $('#login_form')[0].reset();
  $("#welcom-user").html("Welcom");
  StopBackMusic();
});



$("#Play_btn, #Play_nav, #btn_new_game").click(function(){
  hide_everyhing();
  $("#Settings_content").show();
  $("#5points").val("#FFFFFF");
  $("#15points").val("#7495E0");
  $("#25points").val("#E34C27");
  $("#ball_numbers").val(50);
  $("#game_time").val(60);
  $("#ghost_numbers").val(2);
  $("#ghost_speed").val(2);
  $("#btn_keyleft").val('ArrowLeft');
  $("#btn_keyright").val('ArrowRight');
  $("#btn_keyup").val('ArrowUp');
  $("#btn_keydown").val('ArrowDown');
  pacmusic.volume = 0;
  die.volume = 0;
  eat.volume = 0;
  StopBackMusic();
});

function hide_everyhing() {
  $("#Welcome_content").hide();
  $("#Game_content").hide();
  $("#Login_content").hide();
  $("#Register_content").hide();
  $("#Settings_content").hide();
  //$("#About_modal").hide();
};

// ----- date picker box ------
$(function() {

  //populate our years select box
  for (i = new Date().getFullYear(); i > 1940; i--){
      $('#years').append($('<option />').val(i).html(i));
  }
  //populate our months select box
  for (i = 1; i < 13; i++){
      $('#months').append($('<option />').val(i).html(i));
  }
  //populate our Days select box
  updateNumberOfDays(); 

  //"listen" for change events
  $('#years, #months').change(function(){
      updateNumberOfDays(); 
  });

});

//function to update the days based on the current values of month and year
function updateNumberOfDays(){
  $('#days').html('');
  month = $('#months').val();
  year = $('#years').val();
  days = daysInMonth(month, year);

  for(i=1; i < days+1 ; i++){
    $('#days').append($('<option />').val(i).html(i));
  }
}

//helper function
function daysInMonth(month, year) {
  return new Date(year, month, 0).getDate();
}

// --- modal - about
let modalBtn = document.getElementById("About_nav");
let modal = document.querySelector(".modal");
let closeBtn = document.querySelector(".close-btn");

modalBtn.onclick = function(){
  modal.style.display = "block"
};
closeBtn.onclick = function(){
  modal.style.display = "none"
};
window.onclick = function(e){
  if(e.target == modal){
    modal.style.display = "none"
  }
}
document.addEventListener('keydown', function (e) {
  if (e.code == 'Escape')
      modal.style.display = 'none';
});



// $("#login_form").validate({
//   // Specify validation rules
//   rules: {
//     login_username: {
//       required: true,
//     },
//     login_password: {
//       required: true,
//     }
//   },
//   messages: {
//     login_username: {
//       required: "Username is  asdasdasdasda"
//     },
//     login_password: {
//       required: "Password Username is messing.",
//     }
//   },
//   submitHandler: function () {
//     let form = $("#contact_form_login");
//     form[0].reset();
//   }
// });