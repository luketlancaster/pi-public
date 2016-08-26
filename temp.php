<?php
//store this in the env???
$api_key = 'db432a740561cd8d';
$url = "http://api.wunderground.com/api/".$api_key."/conditions";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
     // The request is using the POST method
    return feels_like_temp($_POST['lat'], $_POST['lon']);
}

//if type==post, do some function?
function feels_like_temp($lat, $lon) {

    $url = $url."/q/".$lat.",".$lon.".json";
    $request = new HttpRequest($url, HttpRequest::METH_GET);
    
    try {
        $request->send();
        if ($request->getResponseCode() == 200) {
            // gotta make sure it's actually json
            $response = json_decode($request->getResponseBody()));
            // if it is, pull the 'feels like' temp and return it
        }
    } catch (HttpException $ex) {
        echo $ex;
    }
}