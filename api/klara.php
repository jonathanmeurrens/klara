<?php
/**
 * Created by JetBrains PhpStorm.
 * User: Jonathan
 * Date: 14/01/14
 * Time: 16:59
 * To change this template use File | Settings | File Templates.
 */

opcache_reset();

console.log();

$json = file_get_contents('http://services.vrt.be/playlist/onair?channel_code=31&accept=application%2Fvnd.playlist.vrt.be.noa_1.0%2Bjson');
$obj = json_decode($json);
echo "<pre>";
print_r($obj);
echo "</pre>";


$json = file_get_contents('http://services.vrt.be/epg/onair?channel_code=31&accept=application%2Fvnd.epg.vrt.be.onairs_1.0%2Bjson');
$obj = json_decode($json);
echo "<pre>";
print_r($obj);
echo "</pre>";