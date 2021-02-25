<?php

$file = "imgs/mapa1/data.json";
var_dump($_POST);
echo "<br>";
var_dump(json_encode($_POST,JSON_UNESCAPED_SLASHES));
file_put_contents($file, json_encode($_POST,JSON_UNESCAPED_SLASHES));
