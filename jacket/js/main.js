$(function(){

  var error,
      options,
      success,
      lat,
      lon,
      url = "http://api.wunderground.com/api/db432a740561cd8d/forecast/geolookup",
      response,
      clickCount = 0;

  options = {
    timeout: 5000,
    maximumAge: 0
  };

  success = function(pos) {
    lat = pos.coords.latitude;
    lon = pos.coords.longitude;
    $.getJSON( url + "/q/" + lat + "," + lon + ".json", function( data ) {
      response = data;
    })
    .done(function() {
      display(response);
    })
  };

  error = function(err) {
    console.warn("ERROR(" + err.code + "): " + err.message);
  };

  navigator.geolocation.getCurrentPosition(success, error, options);

  function display(data) {
    var temp = data.forecast.simpleforecast.forecastday[1].high.fahrenheit;
    if (temp > 80) {
      $("#iconBox").toggleClass("hidden")
      $("#yesOrNo").text("NO");
    }
    else {
      $("#iconBox").toggleClass("hidden")
      $("#yesOrNo").text("YES");
    }
  }
});
