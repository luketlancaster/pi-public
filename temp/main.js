'use strict';
var zip;
var zipUrl;
var localZip;

document.querySelector('#location').addEventListener('click', function(){
  var ipUrl = 'http://api.wunderground.com/api/db432a740561cd8d/geolookup/q/autoip.json'
  //zip;
  zipUrl = 'http://api.wunderground.com/api/db432a740561cd8d/forecast10day/q/' + zip + '.json';
  getJSON(ipUrl, function(result) {
    localZip = result.location.zip;
    document.querySelector('#inputZip').value = localZip;
    console.log(localZip);
  });

});

document.querySelector('#userZip').addEventListener('click', function(){
  zip = document.querySelector('#inputZip').value;
  zipUrl = 'http://api.wunderground.com/api/db432a740561cd8d/forecast10day/q/' + zip + '.json';
  getJSON(zipUrl, function(result){
    var listOfDays = [];
    for(var i = 0; i < 5; i++){
      var currentDay = [];
      var day = result.forecast.simpleforecast.forecastday[i];
      var dailyHigh = day.high.fahrenheit;
      var dailyLow = day.low.fahrenheit;
      var weekday = day.date.weekday_short;
      var icon = day.icon_url;
      currentDay.push(dailyHigh);
      currentDay.push(dailyLow);
      currentDay.push(weekday);
      currentDay.push(icon);
      listOfDays.push(currentDay);
    }
    var forecastContainer = document.querySelector('#forecastList');
    forecastContainer.innerHTML = '';
    forecastContainer.appendChild(makeDays(listOfDays));
  });
});

function makeDays(array) {
//day 1
  var docFragment = document.createDocumentFragment();
  var div = document.createElement('DIV');
  docFragment.appendChild(div);
  var span = document.createElement('SPAN');
  div.appendChild(span);
  var text = document.createTextNode(array[0][2]);
  span.appendChild(text);
  var span_0 = document.createElement('SPAN');
  div.appendChild(span_0);
  var text_0 = document.createTextNode(array[0][0]);
  span_0.appendChild(text_0);
  var img = document.createElement('IMG');
  img.setAttribute("src", array[0][3]);
  div.appendChild(img);
  var span_01 = document.createElement('SPAN');
  div.appendChild(span_01);
  var text_01 = document.createTextNode(array[0][1]);
  span_01.appendChild(text_01);
//day 2
  var div_0 = document.createElement('DIV');
  docFragment.appendChild(div_0);
  var span_1 = document.createElement('SPAN');
  div_0.appendChild(span_1);
  var text_1 = document.createTextNode(array[1][2]);
  span_1.appendChild(text_1);
  var span_2 = document.createElement('SPAN');
  div_0.appendChild(span_2);
  var text_2 = document.createTextNode(array[1][0]);
  span_2.appendChild(text_2);
  var img_0 = document.createElement('IMG');
  img_0.setAttribute("src", array[1][3]);
  div_0.appendChild(img_0);
  var span_02 = document.createElement('SPAN');
  div_0.appendChild(span_02);
  var text_02 = document.createTextNode(array[1][1]);
  span_02.appendChild(text_02);

//day3
  var div_1 = document.createElement('DIV');
  docFragment.appendChild(div_1);
  var span_3 = document.createElement('SPAN');
  div_1.appendChild(span_3);
  var text_3 = document.createTextNode(array[2][2]);
  span_3.appendChild(text_3);
  var span_4 = document.createElement('SPAN');
  div_1.appendChild(span_4);
  var text_4 = document.createTextNode(array[2][0]);
  span_4.appendChild(text_4);
  var img_1 = document.createElement('IMG');
  img_1.setAttribute("src", array[2][3]);
  div_1.appendChild(img_1);
  var span_04 = document.createElement('SPAN');
  div_1.appendChild(span_04);
  var text_04 = document.createTextNode(array[2][1]);
  span_04.appendChild(text_04);

//day4
  var div_2 = document.createElement('DIV');
  docFragment.appendChild(div_2);
  var span_5 = document.createElement('SPAN');
  div_2.appendChild(span_5);
  var text_5 = document.createTextNode(array[3][2]);
  span_5.appendChild(text_5);
  var span_6 = document.createElement('SPAN');
  div_2.appendChild(span_6);
  var text_6 = document.createTextNode(array[3][0]);
  span_6.appendChild(text_6);
  var img_2 = document.createElement('IMG');
  img_2.setAttribute("src", array[3][3]);
  div_2.appendChild(img_2);
  var span_06 = document.createElement('SPAN');
  div_2.appendChild(span_06);
  var text_06 = document.createTextNode(array[3][1]);
  span_06.appendChild(text_06);
//day5
  var div_3 = document.createElement('DIV');
  docFragment.appendChild(div_3);
  var span_7 = document.createElement('SPAN');
  div_3.appendChild(span_7);
  var text_7 = document.createTextNode(array[4][2]);
  span_7.appendChild(text_7);
  var span_8 = document.createElement('SPAN');
  div_3.appendChild(span_8);
  var text_8 = document.createTextNode(array[4][0]);
  span_8.appendChild(text_8);
  var img_3 = document.createElement('IMG');
  img_3.setAttribute("src", array[4][3]);
  div_3.appendChild(img_3);
  var span_08 = document.createElement('SPAN');
  div_3.appendChild(span_08);
  var text_08 = document.createTextNode(array[4][1]);
  span_08.appendChild(text_08);
  return docFragment;
}

function getJSON(url, cb) {
  var forcastData = new XMLHttpRequest();
  forcastData.open('GET', url);

  forcastData.onload = function () {
    if (this.status >= 200 && this.status < 400) {
      cb(JSON.parse(this.response));
    }
  };
  forcastData.send();
}

