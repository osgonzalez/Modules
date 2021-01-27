
const duration = 20000;
const interval = duration/10;

var jsonData;
var intervalID;

$(function(){ 
    $.getJSON( "JsonGenerator/data.json", function( data ) {
    jsonData = data;
    var counter = 0;

    var cardContainer = $("#cardContainer");
    cardContainer.empty();

    for(agent in data){
        card = 
        '<div class="col mb-3" style="min-width:6.5cm;max-width:7cm">'+
        '    <div class="card" id="card-'+agent+'" >'+
        '        <img src="ranks/'+data[agent].rank+'.png" class="card-img-top" alt="Rank '+data[agent].rank.toUpperCase()+'">'+
        '        <div class="card-body">'+
        '            <h5 class="card-title d-flex justify-content-center">'+data[agent].name+'</h5>'+
        '            <p class="card-text">'+
        '              <div class="d-flex justify-content-around mb-2">'+
        // '                <div class=""><i class="fas fa-dollar-sign text-success"></i> '+ data[agent].cost.dollar + '</div>'+
        '                   <div class=""><i class="fas fa-dollar-sign text-success"></i>&nbsp;<div class="fastCounter" data-num="'+data[agent].cost.dollar+'"></div></div>'+
        '                   <div class=""><i class="fab fa-ethereum text-primary"></i>&nbsp;<div class="fastCounter" data-num="'+data[agent].cost.blue+'"></div></div>'+
        '                   <div class=""><i class="fab fa-ethereum text-success"></i>&nbsp;<div class="fastCounter" data-num="'+data[agent].cost.green+'"></div></div>'+
        // '                   <div class=""><i class="fab fa-ethereum text-primary"></i> '+ data[agent].cost.blue + '</div>'+
        // '                   <div class=""><i class="fab fa-ethereum text-success"></i> '+ data[agent].cost.green + '</div>'+
        '               </div>        '+
        '               <div class="" id="bar-'+ agent + '"></div>'+
        '               <div id="sanity-'+ agent + '" class="d-flex justify-content-around my-2"></div>'+
        '            </p>'+
        '            <div id="hire-'+agent+'" class="d-flex justify-content-center"><div class="btn btn-primary">Contratar</div></div>'+
        '        </div>'+
        '    </div>'+
        '</div>';
   
        cardContainer.append(card);

        //'            <div id="hire-'+agent+'" class="d-flex justify-content-center"><strong class="btn btn-primary">Rank '+ data[agent].rank.toUpperCase() + '</strong></div>'+
        
  
        for(var bar in data[agent].bars){
            var idContainer = "#bar-"+agent;
            var isSpecial =  data[agent]["atributes"][bar] > 6 //If Atribute > 6 the bar background is yellow
            
            counter++;

            var name = bar;
            var icon = (bar in atributesIcons)? atributesIcons[bar] : ""

            if(bar == "Combate"){
                name=data[agent].combatType
            }

            if(isSpecial){
                $(idContainer).append("<strong><i class='"+icon+"'></i> "+name+" (+<spam id='mesageBar-"+counter+"' class='counter'>0</spam>)</strong>");
            }else{
                $(idContainer).append("<spam><i class='"+icon+"'></i> "+name+" (+<spam id='mesageBar-"+counter+"' class='counter'>0</spam>)</spam>");
            }
            
            data[agent].bars[bar]["bar"] = (drawBar(idContainer,
                duration* data[agent].bars[bar].percent,
                isSpecial,
                rgbToHex(data[agent].bars[bar].startColor),
                rgbToHex(data[agent].bars[bar].fullColor),
                data[agent].bars[bar].percent));

                
            $("#mesageBar-"+counter).data("actual",0)
            $("#mesageBar-"+counter).data("final",data[agent]["atributes"][bar])
            $("#mesageBar-"+counter).data("agent",agent)

        }


        //Sanity 
        for(var san in data[agent].sanity){
            var idContainer = "#sanity-"+agent;
            var icon = (san in atributesIcons)? atributesIcons[san] : "" 

            $(idContainer).append("<spam><i title='"+san+"' class='"+icon+"'></i> <spam class='fastCounter' data-num='"+data[agent]["sanity"][san]+"'></spam></spam>"); 
            

        }

        //Hire data
        $("#hire-"+agent).data("agent",agent)

        $("#hire-"+agent).on("click",function(){
            agent = jsonData[$(this).data("agent")]
            
            message = agent.name + "\t"+ 
                    agent.cost.dollar + "\t"+ 
                    agent.cost.blue + "\t"+ 
                    agent.cost.green + "\t";
            
            for(atr in  agent.atributes){
                message += agent.atributes[atr] + "\t";
            }

            message += agent.combatType  + "\t";;
            
            for(san in  agent.sanity){
                message += agent.sanity[san] + "\t";
            }

            //Copy to Clipboard
            var tempImput = $("<input>");
            $("body").append(tempImput);
            tempImput.val(message).select();
            document.execCommand("copy");
            tempImput.remove();
            console.log(message)

            //Change bagground
            $("#card-"+$(this).data("agent")).css("background-color", "#8080802e")
        })

    }
     
    intervalID = setInterval(modifyMessages,interval);
    $(".fastCounter").each(function(){
        $(this).css("--num", $(this).data("num"))
    })
});
})






//var myVar = setInterval(myTimer, 1000);

function modifyMessages() {
    var hasNextIteration = false;


    $(".counter").each(function(){
        var actual = $(this).data("actual")
        var final = $(this).data("final")

        if(actual < final){
            hasNextIteration = true;
            actual++;
            $(this).data("actual",actual)
            $(this).text(actual)
        }else{
            $(this).removeClass(".counter")
        }

    })


    if(!hasNextIteration){
        clearInterval(intervalID);
    }


}



atributesIcons =   {
    "Administracion": "far fa-folder-open color-atribute",
    "Carisma": "fas fa-theater-masks color-atribute",
    "Atletismo": "fas fa-running color-atribute",
    "Ingenieria": "fas fa-tools color-atribute",
    "Investigación": "fas fa-user-secret color-atribute",
    "Felicidad": "far fa-smile-beam color-cyan", 
    "Lealtad": "fas fa-pray color-cyan", //fas fa-handshake  //fas fa-users //fas fa-balance-scale-right
    "Esfuerzo": "fas fa-fist-raised color-cyan",
    "Combate": "fas fa-hat-wizard color-combat", //fab fa-phoenix-framework
}
