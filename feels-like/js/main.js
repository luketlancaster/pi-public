$(function(){

  var error,
      options,
      success,
      url = "http://api.wunderground.com/api/db432a740561cd8d/forecast/geolookup/conditions",
      response;

  options = {
    timeout: 5000,
    maximumAge: 0
  };
  $('#send-it').click(function () {
    console.log('clicked');

    // $.ajax({
    //   url: 'https://luketlancaster.com/temp.php',
    //   type: 'POST',
    //   dataType: 'json',
    //   data: {lat: lat, lon: lon},
    // })
    // .done(function(data) {
    //   display(data);
    // });
  })

  success = function(pos) {
    var lat = pos.coords.latitude;
    var lon = pos.coords.longitude;
    // ajax post to the php instead
    // $.ajax({
    //   url: 'https://luketlancaster.com/temp.php',
    //   type: 'POST',
    //   dataType: 'json',
    //   data: {lat: lat, lon: lon},
    // })
    // .done(function(data) {
    //   display(data);
    // });

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
      console.log(data);
      var temp = data.current_observation.feelslike_f;
      $("#iconBox").toggleClass("hidden");
      $("#yesOrNo").text(temp);
    }
});
