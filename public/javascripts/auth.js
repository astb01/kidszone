$(function(){
  /*
  Toggle errors based on where they are sourced from.
   */
  $("#firstName, #lastName").keyup(function() {
    const id = $(this).attr('id');
    const msgIdKey = "#" + id + "Msg";

    if ($(this).val().length > 2) {
      $(msgIdKey).show();
      $(msgIdKey).html(tickHtml());
    }
    else {
      $(msgIdKey).html('').hide();
      $(this).siblings('.serverError').hide();
    }
  });

  $('input[name="gender"]').change(function() {
    const msgIdKey = "#genderMsg";

    $(msgIdKey).show();
    $(msgIdKey).html(tickHtml());
  });

  $("#username").keyup(function() {
    const id = $(this).attr('id');
    const msgIdKey = "#" + id + "Msg";

    const isValid = validateEmail($(this).val());

    if (isValid){
      $(msgIdKey).show();
      $(msgIdKey).html(tickHtml());
    }
    else {
      if ($(this).val().length > 0){
        $(msgIdKey).html(errorHtml("Username must be an email")).show();
        $(this).siblings('.serverError').hide();
      }
      else {
        $(msgIdKey).html('').hide();
      }
    }
  });

  $("#password").keyup(function() {
    if ($(this).val().length > 6){
      $("#passwordMsg").show();
      $("#passwordMsg").html(tickHtml());
    }
    else {
      if ($(this).val().length > 0){
        $("#passwordMsg").html(errorHtml("Password must be at least 6 characters in length")).show();
        $(this).siblings('.serverError').hide();
      }
      else {
        $("#passwordMsg").html('').hide();
      }
    }
  });

  $("#confPassword").keyup(function() {
    if ($(this).val() === $("#password").val()){
      $("#confPasswordMsg").show();
      $("#confPasswordMsg").html(tickHtml());
    }
    else {
      if ($(this).val().length > 0){
        $("#confPasswordMsg").show();
        $("#confPasswordMsg").html(errorHtml("Passwords do not match. Please retype them"));
        $(this).siblings('.serverError').hide();
      }
      else {
        $("#confPasswordMsg").html('').hide();
      }
    }
  });
});

/** Simple placeholder for tick span. */
function tickHtml(){
  return '<span class="tick"><img alt="good" class="tickImg" src="/images/tick.png"></span>';
}

/** Simple placeholder for cross span. */
function crossHtml(){
  return '<span class="cross"><img alt="error" class="crossImg" src="/images/cross.png"></span>';
}

/** Simple placeholder for displaying error messages in a span. */
function errorHtml(msg){
  return '<span class="error">' + msg + '</span>'
}

/** Validate emails. */
function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}