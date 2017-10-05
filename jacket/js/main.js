$(function(){

  var options = {
    timeout: 5000,
    maximumAge: 0
  };

  var success = function(pos) {
    lat = pos.coords.latitude;
    lon = pos.coords.longitude;
    
    $.post('../../temp.php', {lat: lat, lon: lon}, function(data) {
      display(data);
    }, 'json');
  };

  var error = function(err) {
    console.warn("ERROR(" + err.code + "): " + err.message);
  };

  navigator.geolocation.getCurrentPosition(success, error, options);

  function display(temp) {
    if (temp > 70) {
      $("#iconBox").toggleClass("hidden")
      $("#yesOrNo").text("NO");
    }
    else {
      $("#iconBox").toggleClass("hidden")
      $("#yesOrNo").text("YES");
    }
  }
});
