<?php



header('Content-Type: application/json');
echo json_encode(getImages());
exit;



//Get Images
function getImages(){
    $imageRootFolder = "../middle/images";

    return getFilesOfDir($imageRootFolder);
    
}


//Remove Image
function removeImage($file){

    
}



//Get all the files of the direrctory recursively
function getFilesOfDir($dir){
    $files = Array();
    $dirs = Array(); 

    if(is_dir($dir)){
        $elements  = array_diff(scandir($dir), array('..', '.'));

        foreach ($elements as $key => $element){ 
            if(is_dir($dir."/".$element)){
                $dirs[$element]= getFilesOfDir($dir."/".$element);
            }else{
                $files[$element]= $dir . "/" . $element;
            }
         }
        
    }



    return ["files" => $files, "dirs" => $dirs];
    
}