
var imageData = null;
var navigationStack = [];
var canvasSelector = "splitInOne";

var isMovileDevice = false;

$(function(){
    $("#imageDrop").dropzone(
        { 
            url: "/core/imageUpload.php",
            uploadMultiple: true , 
            accept: function(file, done) {
                if (!file.name.toLowerCase().endsWith(".jpg") && !file.name.toLowerCase().endsWith(".png" )) {
                    $(" #dropError").show();
                  done("Solo esta permitido la subida de imagenes");
                }
                else { done(); }
              },
            success: function() {
                    loadImages();
                  },
        }
        );


        
       
        loadImages()

        setTimeout(() => {$("#header").removeClass("toggled"); }, 500);

        if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
            isMovileDevice = true;

            $("#gallery").removeClass("connectedSortable")
        }else{
            $("#gallery").sortable({
                connectWith: ".connectedSortable",
                remove: function (event, ui) {
                    ui.item.clone().appendTo('#viewerDrop');
                    $(this).sortable('cancel');
                }
            }).disableSelection();
    
            $( "#viewerDrop" ).sortable({
                connectWith: ".connectedSortable"
                
              }).disableSelection();
    
        }

        

        




        $("#showButtom").on("click",uploadShowContent);

        $("#clearButtom").on("click",function(){
            $("#viewerDrop").empty();
        });

        $("#loadButom").on("click",function(){
            $(" #dropError").hide();
            $("#dropImageModal").modal("show");
        });

        $(".imageCamvas").on("click",function(){
            canvasSelector = $(this).attr('id');

            $(".imageCamvas").each(function(){
                $(this).removeClass('brightness');
            })

            $(this).addClass('brightness');
        });


    })


    function loadImages(){
        $.ajax({
            url: "imageRest.php",
            method: "POST", 
            data: {action: "get"}
          }).done(function(data) {
            imageData =  data;
            navigationStack.push(imageData);
            drawActualFolerContent();
          });
    }
 

    

    function drawActualFolerContent(){
        var content = navigationStack[navigationStack.length-1]; 
        if(content != null){

            $("#gallery").empty();
            // $("#viewerDrop").empty();
            $("#dirs").empty();

            for(var files in content["files"]){
                if(isMovileDevice){
                    $("#gallery").append('<img class="imgMovile" src="'+content["files"][files]+'">');
                }else{
                    $("#gallery").append('<li class="ui-state-default image-dropable"><img src="'+content["files"][files]+'"></li>');
                }
            }


            
            if(navigationStack.length>1){
                var dir =   '<div id="backDir" class="m-3" onclick="backDir()">'+
                                '<span class="dirname">Back</span>'+
                                '<span class="dirnumber"></span>'+
                            '</div>';
                $("#dirs").append(dir);
            }


            for(var directory in content["dirs"]){
                var numOfImages = Object.keys(content["dirs"][directory]["files"]).length;  
                var dir =   '<div class="dir m-3" onclick="changeActualFolder(\''+directory+'\')">'+
                                '<span class="dirname">'+directory+'</span>'+
                                '<span class="dirnumber">'+numOfImages+'</span>'+
                            '</div>';
                $("#dirs").append(dir);
            }


            $("#gallery .imgMovile").on("touchstart",function(){
                $(this).clone().appendTo('#viewerDrop');
    
            });

             
        }
    }

    function changeActualFolder( newDir){
        var content = navigationStack[navigationStack.length-1]; 
        if(content != null){
            navigationStack.push(content["dirs"][newDir]);
        }
        drawActualFolerContent();
    }


    function backDir(){ 
        if(navigationStack != null && navigationStack.length>1){
            navigationStack.pop();
        }
        drawActualFolerContent();
    }



    function uploadShowContent(){
        var data={}; 
        var files = {};

        if(isMovileDevice){
            $("#viewerDrop img").each(function(index ) {
                files["img"+index ] = $( this ).attr("src");
              });
        }else{
        $("#viewerDrop li img").each(function(index ) {
            files["img"+index ] = $( this ).attr("src");
          });
        }
        

          data["canvasSelector"] = canvasSelector;
          data["files"] = files;
        $.ajax({
            url: "../middle/viewerTraker.php",
            method: "POST", 
            data: data
          })
    }
