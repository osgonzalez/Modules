function changeTrack(newTrack,idTrack){
    $.ajax({
            data:  {"newTrack": newTrack}, 
            url:   '../core/changeTrack.php',
            type:  'post',
            beforeSend: function () {
                console.log("Waiting...");
                $(".fa-play").each(function() {
                    $( this ).removeClass( "green" );
                  });
            },
            success:  function (response) { 
                console.log("done...");
                $("#"+ idTrack).addClass("green");
            }
    });
}

function changeVolume(newVolume){
    $.ajax({
            data:  {"newVolume": newVolume}, 
            url:   '../core/changeVolume.php',
            type:  'post',
            beforeSend: function () {
                console.log("Waiting...");
            },
            success:  function (response) { 
                console.log("done...");
            }
    });
}

function refreshRate(refreshRate){
    $.ajax({
            data:  {"refreshRate": refreshRate}, 
            url:   '../core/changeRefreshRate.php',
            type:  'post',
            beforeSend: function () {
                console.log("Waiting...");
            },
            success:  function (response) { 
                console.log("done...");
            }
    });
}

$(function(){
    $("#volume").change(function(){
        changeVolume($("#volume").val());
    });
    $('input[type=radio][name=refreshRate]').change(function() {
        refreshRate($('input[type=radio][name=refreshRate]:checked').val());
    });
});

