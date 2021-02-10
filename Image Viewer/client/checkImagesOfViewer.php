<?php
$images = json_decode(file_get_contents("../middle/viewerImages"));
$modificationDate = filemtime("../middle/viewerImages"); 

header('Content-Type: application/json');
echo json_encode([
        "images" => $images, 
        "modificationDate" => $modificationDate
    ]);
?>