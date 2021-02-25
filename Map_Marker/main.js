
    let markerCounter = 0;
    var mouseXPos = 0;
    var mouseYPos = 0;

    
    var imgMarker = "http://www.clker.com/cliparts/w/O/e/P/x/i/map-marker-hi.png"

    var canvas;
    var context;
    var mapSprite;
    var selectedMarker = "";



    var Marker = function () {
        this.Sprite = new Image();
        this.Sprite.src = "http://www.clker.com/cliparts/w/O/e/P/x/i/map-marker-hi.png"
        this.Width = 24;
        this.Height = 40;
        this.XPos = 0;
        this.YPos = 0;
        this.markerText = "";
        this.markerDescription = "";
    }

    var Markers = {};

    var selectedSprite = new Marker();
    selectedSprite.Sprite.src = "https://img.icons8.com/plasticine/2x/arrow.png"
    selectedSprite.Width = 35;
    selectedSprite.Height = 40;

    var selectedBackgroundSprite = new Marker();
    selectedBackgroundSprite.Sprite.src = "background.png"
    selectedBackgroundSprite.Width = 48;
    selectedBackgroundSprite.Height = 80;



    $(function(){


    
    $(".imgDiv").click(function() {
        //Set the image
        $(".imgDiv").each(function () {
            $(this).removeClass("border");
        })

        $(this).addClass("border");
        imgMarker = $(this).children(":first").attr("src");
    });



    canvas = document.getElementById('Canvas');
    context = canvas.getContext("2d");

    // Map sprite
    mapSprite = new Image();
    mapSprite.onload = function(){
        // $("#Canvas").innerWidth(this.width);
        // $("#Canvas").innerHeight(this.height);
    };
    // mapSprite.src = "./imgs/Long Locaclizaciones.png";
    mapSprite.src = "http://www.retrogameguide.com/images/screenshots/snes-legend-of-zelda-link-to-the-past-8.jpg";




    var mouseClicked = function (mouse) {


        // Get corrent mouse coords
        var rect = canvas.getBoundingClientRect();
        mouseXPos = (mouse.x - rect.left);
        mouseYPos = (mouse.y - rect.top);

        $("#modal").modal("show")
        selectMarkerImput()

    }

    // Add mouse click event listener to canvas
    canvas.addEventListener("mousedown", mouseClicked, false);

    var firstLoad = function () {
        context.font = "15px Georgia";
        context.textAlign = "center";
    }

    firstLoad();

    $("#setMarker").on("click",function(){
        if ($("#markerText").val() == "") {
            $("#markerText").addClass("is-invalid")  
            $("#modal").modal("show")
            selectMarkerImput()
            return;
        } else {
            $("#markerText").removeClass("is-invalid")
            addCanvasMarker()

            $("#modal").modal("hide")
            $("#markerText").val("");
            $("#markerDescription").val("");

        } 
    })

    var main = function () {
        draw();
    };

    setInterval(main, (1000 / 60)); // Refresh 60 times a second

    $("#saveButom").click(function(){
        uploadData()
    })

    setTimeout(function(){
        loadData()
    },400)
})

    function addCardMarker(marker, counter){
        var card = 
        '<div id="card-'+counter+'" class="card text-white bg-primary mb-3 markerCard m-1" >'+
        '    <div class="card-header d-flex justify-content-between">'+
        '       <strong>'  +marker.markerText+ '</strong>'+    
        '       <button id="cardCloseButon-'+counter+'" type="button" class="close text-danger" data-dismiss="alert" aria-label="Close">x</button>'+
        '    </div>'+
        '    <div class="card-body">'+
        '        <p class="card-text">'+marker.markerDescription+'</p>'+
        '    </div>'+
        '</div>'

        $("#cardContainer").append(card)
        
        $("#card-"+counter).data("counter",counter)
        $("#card-"+counter).mouseover(function(){
            let counter = $(this).data("counter")
            selectedMarker = counter;
        })

        $("#card-"+counter).mouseout(function(){
            selectedMarker = "";
        })

        $("#cardCloseButon-"+counter).data("counter",counter)
        $("#cardCloseButon-"+counter).on("click", function(){
            let counter = $(this).data("counter")
            $("#card-"+counter).remove()
            delete Markers[counter]
        })

    }


    function addCanvasMarker(){
        console.log("Marker added");

        // Move the marker when placed to a better location
        var marker = new Marker();
        marker.XPos = mouseXPos - (marker.Width / 2);
        marker.YPos = mouseYPos - marker.Height;
        marker.markerText = $("#markerText").val();
        marker.markerDescription = $("#markerDescription").val();
        marker.Sprite.src = imgMarker;

        
        Markers[markerCounter] = marker;
        addCardMarker(marker,markerCounter)

        markerCounter++;
    }


    function selectMarkerImput(){
        setTimeout(function() {
            $("#markerText").focus();
            $("#markerText").select();
        }, 500);
    }


    function draw () {
        // Clear Canvas
        context.fillStyle = "#000";
        context.fillRect(0, 0, canvas.width, canvas.height);

        // Draw map
        // Sprite, X location, Y location, Image width, Image height
        // You can leave the image height and width off, if you do it will draw the image at default size
        context.drawImage(mapSprite, 0, 0, 700, 700);

        // Draw markers
        for (var i in Markers) {
            var tempMarker = Markers[i];
           
           
            if(selectedMarker==i){
                context.drawImage(selectedSprite.Sprite, 
                    tempMarker.XPos - (tempMarker.Width/2 + selectedSprite.Width), 
                    tempMarker.YPos, 
                    selectedSprite.Width, selectedSprite.Height);

                context.drawImage(selectedBackgroundSprite.Sprite, 
                    tempMarker.XPos - (selectedBackgroundSprite.Width - tempMarker.Width )/2, 
                    tempMarker.YPos - (selectedBackgroundSprite.Height - tempMarker.Height )/2,  
                    selectedBackgroundSprite.Width, 
                    selectedBackgroundSprite.Height);
                
            }

             // Draw marker
             context.drawImage(tempMarker.Sprite, tempMarker.XPos, tempMarker.YPos, tempMarker.Width, tempMarker.Height);

            // Calculate postion text
            //var markerText = "Postion (X:" + tempMarker.XPos + ", Y:" + tempMarker.YPos;
            var markerText = tempMarker.markerText;

            // Draw a simple box so you can see the position
            var textMeasurements = context.measureText(markerText);
            context.fillStyle = "#fff";//666
            context.globalAlpha = 0.7;
            //context.fillRect(tempMarker.XPos - (textMeasurements.width / 2), tempMarker.YPos - 15, textMeasurements.width, 20);
            context.fillRect(tempMarker.XPos - (textMeasurements.width / 2) + (tempMarker.Width / 2), tempMarker.YPos - 20, textMeasurements.width, 20);
            context.globalAlpha = 1;

            // Draw position above
            context.fillStyle = "#000";
            context.fillText(markerText, tempMarker.XPos + (tempMarker.Width / 2), tempMarker.YPos - 5);
        }
    };




function saveMarkers(){
    var toRet = {};

    for(mark in Markers){
        toRet[mark] ={
            "src": Markers[mark].Sprite.src,
            "Width": Markers[mark].Width,
            "Height": Markers[mark].Height,
            "XPos": Markers[mark].XPos,
            "YPos": Markers[mark].YPos,
            "markerText": Markers[mark].markerText,
            "markerDescription": Markers[mark].markerDescription
        }
    }

    return toRet;
}


function loadMarkers(dataJson){

    Markers = {}
    $("#cardContainer").empty()

    for(mark in dataJson){
        var marker = new Marker();
        marker.Sprite.src = dataJson[mark].src;
        marker.XPos = parseFloat(dataJson[mark].XPos);
        marker.YPos = parseFloat(dataJson[mark].YPos);
        marker.markerText = dataJson[mark].markerText;
        marker.markerDescription = dataJson[mark].markerDescription;
        
        addCardMarker(marker,mark)
        Markers[mark] = marker;

        if(markerCounter <= parseInt(mark)){
            markerCounter = parseInt(mark) +1
        }
    }

}


function loadData(){
    var url = "imgs/mapa1/data.json";
    
    try{
        $.ajax({
            url:   url,
            type:  'post',
            beforeSend: function () {
                console.log("Waiting...");
            },
            success:  function (response) { 
                console.log("donne...");
                loadMarkers(toJson(response))
            }
        })
    }catch(error){
        console.log(error)
    }

}



function uploadData(){
    var data= saveMarkers();

    $.ajax({
        url: "./saveData.php",
        method: "POST", 
        data: data
      })
}


function toJson(str) {
    try {
        var toRet = JSON.parse(str);
        return toRet;
    } catch (e) {
        return str;
    }
}