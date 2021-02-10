$(function() {  
    setTimeout(() => {$("#header").removeClass("toggled"); }, 500);
    var lastModificationDate = 0.5;
    var lastRefreshRate = 2;
    var firstLoad = true;

    function checkTrack(){
        $.ajax({
                url:   './checkImagesOfViewer.php',
                type:  'post',
                beforeSend: function () {
                    console.log("Waiting...");
                },
                success:  function (response) { 
                    console.log("donne...");
                    
                    if(response.modificationDate != lastModificationDate){
                        console.log("Images Change!");
                        lastModificationDate = response.modificationDate;
                        $("#imgShow").empty();
                       
                        var numOfImages = Object.keys(response.images.files).length;

                        if(numOfImages <= 1 ){
                                for(var img in response.images.files){
                                    $("#imgShow").append('<img class="imgFull" src="'+response.images.files[img]+'">');                                 
                                }
                        }else{
                            switch(response.images.canvasSelector){
                                case "splitInOne":
                                    var marginBottom = 1; 
                                    var rowWight = (100 /numOfImages)-marginBottom;
                                    
                                    for(var img in response.images.files){
                                        $("#imgShow").append('<div class="row" style="margin-bottom: '+marginBottom+'%;width:100%; height: '+rowWight+'%"><img class="imgToShow" src="'+response.images.files[img]+'"></div>');                              
                                    }
                                break;
                                case "splitInTwo":
                                    var marginBottom = 1; 
                                    if(numOfImages<=2){
                                        marginBottom = 0;
                                    }
                                    var rowWight = (100 / Math.ceil(numOfImages/2))-marginBottom;
                                    
                                    var i=0;
                                    var lastRow = "";
                                    for(var img in response.images.files){
                                        if(i%2 == 0){
                                            lastRow = "row"+i;
                                            $("#imgShow").append('<div class="row" id="'+lastRow+'" style="justify-content: center;margin-bottom: '+marginBottom+'%;width:100%; height: '+rowWight+'%"></div>');                              
                                        }
                                        $("#"+lastRow).append('<div class="inFlex" style="margin-bottom: '+marginBottom+'%;width:50%; height: 100%"><img class="imgToShow" src="'+response.images.files[img]+'"></div>');                              
                                        i++;
                                    }
                                break;
                                case "splitInTree":
                                    var marginBottom = 1; 
                                    if(numOfImages<=3){
                                        marginBottom = 0;
                                    }
                                    var rowWight = (100 / Math.ceil(numOfImages/3))-marginBottom;
                                    
                                    var i=0;
                                    var lastRow = "";
                                    for(var img in response.images.files){
                                        if(i%3 == 0){
                                            lastRow = "row"+i;
                                            $("#imgShow").append('<div class="row" id="'+lastRow+'" style="justify-content: center;margin-bottom: '+marginBottom+'%;width:100%; height: '+rowWight+'%"></div>');                              
                                        }
                                        $("#"+lastRow).append('<div class="inFlex" style="margin-right: 1%;width:32%; height: 100%"><img class="imgToShow" src="'+response.images.files[img]+'"></div>');                              
                                        i++;
                                    }
                                break;
                                case "splitInFour":
                                    var marginBottom = 1; 
                                    if(numOfImages<=4){
                                        marginBottom = 0;
                                    }
                                    var rowWight = (100 / Math.ceil(numOfImages/4))-marginBottom;
                                    
                                    var i=0;
                                    var lastRow = "";
                                    for(var img in response.images.files){
                                        if(i%4 == 0){
                                            lastRow = "row"+i;
                                            $("#imgShow").append('<div class="row" id="'+lastRow+'" style="justify-content: center;margin-bottom: '+marginBottom+'%;width:100%; height: '+rowWight+'%"></div>');                              
                                        }
                                        $("#"+lastRow).append('<div class="inFlex" style="margin-right: 1%;width:24%; height: 100%"><img class="imgToShow" src="'+response.images.files[img]+'"></div>');                              
                                        i++;
                                    }
                                break;
                                case "specialTreeHorizontal":
                                    var marginBottom = 1; 
                                    var multiple= 2;
                                    var width = 50;
                                    if(numOfImages == 2){
                                        width = 100;
                                    }
                                    if((numOfImages-1) %3 == 0){
                                        multiple = 3;
                                        width= 33;
                                    }
                                    if((numOfImages-1) %4 == 0){
                                        multiple = 4;
                                        width= 25;
                                    }
                                    if((numOfImages-1) %5 == 0){
                                        multiple = 5;
                                        width= 20;
                                    }
                                    if(numOfImages<2){
                                        marginBottom = 0;
                                    }
                                    var rowWight = (50 / Math.ceil((numOfImages-1)/multiple))-marginBottom;
                                    
                                    var i=0;
                                    var lastRow = "";
                                    for(var img in response.images.files){
                                        if(i== 0){
                                            $("#imgShow").append('<div class="row" id="firstRow" style="margin-bottom: '+marginBottom+'%;width:100%; height: 50%"></div>');
                                            $("#firstRow").append('<img class="imgFull" src="'+response.images.files[img]+'">');
                                        }else{
                                            if((i-1)%multiple == 0){
                                                lastRow = "row"+i;
                                                $("#imgShow").append('<div class="row" id="'+lastRow+'" style="justify-content: center;margin-bottom: '+marginBottom+'%;width:100%; height: '+rowWight+'%"></div>');                              
                                            }
                                            $("#"+lastRow).append('<div class="inFlex" style="margin-bottom: '+marginBottom+'%;width:'+width+'%; height: 100%"><img class="imgToShow" src="'+response.images.files[img]+'"></div>');                              
                                           
                                        }
                                        i++;
                                    }
                                break;
                                case "specialTreeVertical":
                                    var marginBottom = 1; 
                                    if(numOfImages<2){
                                        marginBottom = 0;
                                    }
                                    var rowWight = (100 /  (numOfImages-1))-marginBottom;
                                    
                                    var i=0;
                                    var lastRow = "";
                                    for(var img in response.images.files){
                                        if(i== 0){
                                            $("#imgShow").append('<div class="row" id="rowContainer" style="margin-bottom: 100%;width:100%; height: 100%"></div>');                              

                                            $("#rowContainer").append('<div  id="firstCol" style="    display: inline-flex;margin-right: 2%;width:48%; height: 100%"></div>');
                                            $("#firstCol").append('<img class="imgFull" src="'+response.images.files[img]+'">');
                                            $("#rowContainer").append('<div  id="secondCol" style="justify-content: center;width:50%;position: relative;height: 100%;display: inline;"></div>');

                                        }else{
 
                                                $("#secondCol").append('<div class="row" style="position: relative;margin-bottom: '+marginBottom+'%;width:100%; height: '+rowWight+'%"><img class="imgToShow" src="'+response.images.files[img]+'"></div>');                              
                                          
                                        }
                                        i++;
                                    }
                                break;
                                case "carrousel":
                                     if (!firstLoad){
                                        location.reload();
                                     }
                                    $("#imgShow").append('<div id="carouselContainer" style=" width:100%; height: 100%" class="carousel slide" data-ride="carousel">'+
                                    '    <ol id="indicators" class="carousel-indicators">'+ 
                                    '    </ol>'+
                                    '    <div id="carrouselDiv" class="carousel-inner">'+
                                    '    </div>'+
                                    '    <a class="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">'+
                                    '        <span class="carousel-control-prev-icon" aria-hidden="true"></span>'+
                                    '        <span class="sr-only">Previous</span>'+
                                    '    </a>'+
                                    '    <a class="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">'+
                                    '        <span class="carousel-control-next-icon" aria-hidden="true"></span>'+
                                    '        <span class="sr-only">Next</span>'+
                                    '    </a>'+
                                    '</div>');
                                    var i=0;
                                    for(var img in response.images.files){
                                        if(i == 0){
                                           // $("#indicators").append('<li data-target="#carouselExampleIndicators" data-slide-to="0" class="active"></li>)');  
                                            $("#carrouselDiv").append(' <div class="carousel-item active">'+
                                            '            <img class="d-block w-100" src="'+response.images.files[img]+'">'+ 
                                            '        </div>');                      
                                        }else{
                                            //$("#indicators").append('<li data-target="#carouselExampleIndicators" data-slide-to="0"></li>)');                           
                                            $("#carrouselDiv").append(' <div class="carousel-item">'+
                                            '            <img class="d-block w-100" src="'+response.images.files[img]+'">'+ 
                                            '        </div>'); 
                                        }
                                        i++;

                                    }

                                //    $("#carouselContainer").carousel('dispose'); 
                                //    $('#carouselContainer').carousel({
                                //     interval: 4000
                                //   })

 
                                break;
                                default: 
                                        var marginBottom = 1; 
                                        if(numOfImages<=5){
                                            marginBottom = 0;
                                        }
                                        var rowWight = (100 / Math.ceil(numOfImages/5))-marginBottom;
                                        
                                        var i=0;
                                        var lastRow = "";
                                        for(var img in response.images.files){
                                            if(i%5 == 0){
                                                lastRow = "row"+i;
                                                $("#imgShow").append('<div class="row" id="'+lastRow+'" style="justify-content: center;margin-bottom: '+marginBottom+'%;width:100%; height: '+rowWight+'%"></div>');                              
                                            }
                                            $("#"+lastRow).append('<div class="inFlex" style="margin-right: 1%;width:19%; height: 100%"><img class="imgToShow" src="'+response.images.files[img]+'"></div>');                              
                                            i++;
                                        }
                                    break;
                            }
                        }

                        firstLoad = false;

                    }
                }
        });
    }

    function startDelay(){
        setTimeout(function() {
            checkTrack();
            startDelay();
        }, lastRefreshRate * 1000);
    }

    checkTrack()
    startDelay();
    
});