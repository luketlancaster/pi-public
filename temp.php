<?php

// Actually put this on the server?
// Need to figure out how this works right now :/
putenv('DARKSKY_API_KEY=26126b73ec645084a1be76a597f307a0');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  // todo, better auth? timeouts?
  // maybe use the REMOTE_ADDR? If it's === to the current ip? Or the 'expected' ip? I don't know?
  // maybe use some sort of auth situation?
  // :/ I don't know...
  feels_like_darksky($_POST['lat'], $_POST['lon']);
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

function feels_like_darksky(string $lat, string $lon): string {
  $api_key = getenv('DARKSKY_API_KEY');
  $url = sprintf(
    'https://api.darksky.net/forecast/%s/%s,%s',
     $api_key,
     $lat,
     $lon
  );
  $data = json_decode(file_get_contents($url), true);
  echo (float) $data['currently']['apparentTemperature'];
}
