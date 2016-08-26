$(function(){

  var options = {
    timeout: 5000,
    maximumAge: 0
  };

  var success = function(pos) {
    var lat = pos.coords.latitude;
    var lon = pos.coords.longitude;

    $.post('../../temp.php', {lat: lat, lon: lon}, function (data) {
      display(data);  
    }, 'json');
  };

  var error = function(err) {
    console.warn("ERROR(" + err.code + "): " + err.message);
  };

  navigator.geolocation.getCurrentPosition(success, error, options);

  function display(temp) {
      $("#iconBox").toggleClass("hidden");
      $("#yesOrNo").text(temp);
    }
});
