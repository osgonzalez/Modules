<?php

include_once(__DIR__."/../Defines.php");

session_start();

$_SESSION["typeUser"] = "MASTER";
$_SESSION["masterName"] = "MasterTest";

extract($_POST);
$error=array();
$extension=array("jpeg","jpg","png","gif"); 

$folderName = $_SESSION["masterName"];


if(!is_dir(__DIR__."/../resources/img/masterImages/".$folderName)){ 
    mkdir(__DIR__."/../resources/img/masterImages/".$folderName);
}

foreach($_FILES["file"]["tmp_name"] as $key=>$tmp_name) {
    echo $tmp_name;
    $file_name=$_FILES["file"]["name"][$key];
    $file_tmp=$_FILES["file"]["tmp_name"][$key];
    $ext=pathinfo($file_name,PATHINFO_EXTENSION);


    if(in_array($ext,$extension)) {
            move_uploaded_file($_FILES["file"]["tmp_name"][$key],__DIR__."/../resources/img/masterImages/".$folderName."/".$file_name);

    }
    else {
        array_push($error,"$file_name, ");
    }
}