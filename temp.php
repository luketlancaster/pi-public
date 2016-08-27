<?php

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
     // The request is using the POST method
  feels_like_temp($_POST['lat'], $_POST['lon']);
} else {
  header("Location: https://luketlancaster.com");
  exit();
}



function feels_like_temp($lat, $lon) {

  $api_key = getenv('WUNDERGROUND_API_KEY'); 
  $url = "http://api.wunderground.com/api/".$api_key."/conditions";
  $url = $url."/q/".$lat.",".$lon.".json";

  $ch = curl_init();
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
  curl_setopt($ch, CURLOPT_URL,$url);
  $content = curl_exec($ch);
  $content = json_decode($content, true);
  echo $content['current_observation']['feelslike_f'];

}
