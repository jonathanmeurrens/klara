<?php

header("Content-Type: application/json");

define("WWW_ROOT",dirname(dirname(__FILE__)).DIRECTORY_SEPARATOR);

require_once WWW_ROOT. "api" .DIRECTORY_SEPARATOR. 'Slim'. DIRECTORY_SEPARATOR .'Slim.php';

$app = new Slim();

$app->get('/programma', 'getProgramma');
$app->get('/nummer','getNummer');
$app->get('/playlist','getPlaylist');
$app->get('/info','getInfoForArtist');
$app->get('/locations','getLocations');
$app->run();


function getNummer(){
    echo file_get_contents('http://services.vrt.be/playlist/onair?channel_code=31&accept=application%2Fvnd.playlist.vrt.be.noa_1.0%2Bjson');
    exit();
}

function getProgramma(){
    echo file_get_contents('http://services.vrt.be/epg/onair?channel_code=31&accept=application%2Fvnd.epg.vrt.be.onairs_1.0%2Bjson');
    exit();
}

function getPlaylist(){
    //echo file_get_contents('http://services.vrt.be/epg/playlists/current/31?accept=application%2Fvnd.epg.vrt.be.playlist_1.1%2Bjson');
    echo file_get_contents('http://services.vrt.be/epg/playlists/search?channel_code=31&artist=&title=&composer=&starttime='.date('Ymd').'0000&endtime='.date('Ymd').'2359&accept=application%2Fvnd.epg.vrt.be.songs_1.1%2Bjson');
    exit();
}

function getInfoForArtist(){
    //echo "{artist:'".Slim::getInstance()->request()->params("artist")."'}";
    //exit();
    $xml_string = file_get_contents('http://musicbrainz.org/ws/2/artist/?query='.urlencode(Slim::getInstance()->request()->params("artist")));
    $xml = simplexml_load_string($xml_string);
    echo json_encode($xml);
    exit();
}

function getLocations(){
    echo file_get_contents("http://www.mapquestapi.com/geocoding/v1/batch?key=Fmjtd%7Cluur29u8n9%2C20%3Do5-908x9u&location=York,PA&location=Red%20Lion&location=19036&location=US");
    exit();
}