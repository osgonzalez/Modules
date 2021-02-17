<?php

$strJsonFileContents = file_get_contents("fullDataset.json");
$json = json_decode($strJsonFileContents, true);    

$keys = array_keys($json);

$randIndex = array_rand ($keys , 10 ) ;


$finalJson = array();
foreach($randIndex as $index){
    $finalJson[$index] = $json[$keys[$index]];
}




$file = fopen('../data.json', 'w');
fwrite($file, json_encode($finalJson));
fclose($file);


print("done!");

