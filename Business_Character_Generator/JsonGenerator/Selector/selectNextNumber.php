<?php

$fileOrigin = "fullDataset.json";
$fileTarget = '../data.json';

$numberOfElements = 5;
if(isset($_GET["number"])){
    $numberOfElements = $_GET["number"];
}


$strJsonFileContents = file_get_contents($fileOrigin);
$fullJson = json_decode($strJsonFileContents, true);    

$finalJson = array();
$counter = 0;
foreach($fullJson as $key => $value){
    $finalJson[$key] = $value;
    unset($fullJson[$key]);

    $counter++;
    if($counter>= $numberOfElements){
        break;
    }
}



$file = fopen($fileTarget, 'w');
fwrite($file, json_encode($finalJson));
fclose($file);

$file = fopen($fileOrigin, 'w');
fwrite($file, json_encode($fullJson));
fclose($file);


print("<h1>Quedan ". count($fullJson) ." elementos</h1>");

