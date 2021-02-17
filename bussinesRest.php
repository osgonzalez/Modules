<?php


$strJsonFileContents = file_get_contents("Business Character Generator/JsonGenerator/Selector/fullDataset.json");
$json = json_decode($strJsonFileContents, true);    

$keys = array_keys($json);

$randIndex = array_rand ($keys , 10 ) ;


$finalJson = array();
foreach($randIndex as $index){
    $finalJson[$index] = $json[$keys[$index]];
}


header('Content-Type: application/json');
echo json_encode($finalJson);
?>