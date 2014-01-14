<?php

header("Content-Type: application/json");

define("WWW_ROOT",dirname(dirname(__FILE__)).DIRECTORY_SEPARATOR);

require_once WWW_ROOT. "api" .DIRECTORY_SEPARATOR. 'Slim'. DIRECTORY_SEPARATOR .'Slim.php';

$app = new Slim();

$app->get('/programma', 'getProgramma');
$app->get('/nummer','getNummer');
$app->get('/playlist','getPlaylist');
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
    echo file_get_contents('http://services.vrt.be/epg/playlists/search?channel_code=31&artist=&title=&composer=&starttime='.date('Ymd').'0000&endtime=201401152359&accept=application%2Fvnd.epg.vrt.be.songs_1.1%2Bjson');
    exit();
}


http://services.vrt.be/epg/playlists/search?channel_code=31&artist=&title=&composer=&starttime=201401140000&endtime=201401152359&accept=application%2Fvnd.epg.vrt.be.songs_1.1%2Bjson&f=mySearch.parseResults