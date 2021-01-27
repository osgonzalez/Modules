
 
function createCanvas(){
    $("#viewer").css("background-image",'none');

    html2canvas(document.querySelector("#viewer")).then(canvas => {
        canvas.id = "imgCanvas";
        document.body.appendChild(canvas)
        download()
    });
}


function download(){ 
    var link = document.createElement('a');
    link.download = 'filename.png';

    link.href = document.getElementById('imgCanvas').toDataURL()
    link.click(); 
}

function toAverageDice(num){

  if(num>60){
    return " (" + (num - 60) + " + " + dices[120] + ")"
  }else{
    return dices[num*2]
  }






}

function generate(){

    $("#challenge").removeClass("is-invalid")

 

 var challenge = $("#challenge").val();
 var life = $("input[name='lifeRadio']:checked").val();
 var CA = $("input[name='CARadio']:checked").val();
 var damage = $("input[name='damageRadio']:checked").val();
 var TS = $("input[name='TSRadio']:checked").val();
 var aptitude = $("input[name='aptitudeRadio']:checked").val();



 var finalXP = 0;

 if(!(challenge in statsJSON)){
    $("#challenge").addClass("is-invalid")
    return;
 }




 //Life
 var lifeMod = 0;

 switch(life){
    case "BossHight": 
        lifeMod = 5;
        finalXP += 5;
        break;

    case "Hight": 
        lifeMod = 4;
        finalXP += 4;
        break;
    
    case "Mid": 
        lifeMod = 3;
        finalXP += 3;
        break;
    
    case "Low": 
        lifeMod = 2;
        finalXP += 2;
        break;

    case "Extra": 
        lifeMod = 1;
        finalXP += 1;
        break;   
 }

 var finalLife = statsJSON[challenge]["DamageLow"] * lifeMod;
 var variation = finalLife * 0.25 ;
 var round = 2;
 if(finalLife > 25){
    round = 5; 
 }
 if(finalLife > 100){
  round = 10; 
  variation = finalLife * 0.20;
}
if(finalLife > 200){
  round = 20; 
  variation = finalLife * 0.10;
}
if(finalLife > 400){
  round = 100; 
}
 var minLife = Math.floor((finalLife - variation)/round)*round;
 var maxLife =Math.ceil((finalLife + variation)/round)*round;

  if(minLife <= 0){
    minLife = 1;
  }

  $("#hp").text(minLife + " - " + maxLife);



  //CA
  var CAMod = 0;

  switch(CA){
     case "BossHight": 
         CAMod = 1.2;
         finalXP += 5;
         break;
 
     case "Hight": 
         CAMod = 1;
         finalXP += 4;
         break;
     
     case "Mid": 
         CAMod = 0.8;
         finalXP += 3;
         break;
     
     case "Low": 
         CAMod = 0.6;
         finalXP += 2;
         break;
 
     case "Extra": 
         CAMod = 0.4;
         finalXP += 1;
         break;   
  }
 
  var finalCA = statsJSON[challenge]["Atack"] * CAMod;
 finalCA = Math.round(finalCA);

 if(finalCA < 10){
   finalCA = 10;
 }

  $("#ca").text(finalCA);



  

//Damage

$("#results").empty();

var damageMod = 0;

switch(damage){
   case "BossHight": 
       damageMod = 2;
       finalXP += 5;
       break;

   case "Hight": 
       damageMod = 3;
       finalXP += 4;
       break;
   
   case "Mid": 
       damageMod = 4;
       finalXP += 3;
       break;
   
   case "Low": 
       damageMod = 5;
       finalXP += 2;
       break;

   case "Extra": 
       damageMod = 6;
       finalXP += 1;
       break;   
}

var finaldamage = statsJSON[challenge]["Life"] / damageMod;
finaldamage = Math.round(finaldamage);
// $("#results").append("Damage: " + finaldamage);
// $("#results").append("<br>");
// $("#results").append("Damage (1/Short Rest): " + Math.round(finaldamage* 1.20));
// $("#results").append("<br>");
// $("#results").append("Damage (1/Long Rest): " + Math.round(finaldamage* 1.40));
// $("#results").append("<br>");
//TS
 
var TSMod = 0;

switch(TS){
   case "BossHight": 
       TSMod = 1.2;
       finalXP += 5;
       break;

   case "Hight": 
       TSMod = 1;
       finalXP += 4;
       break;
   
   case "Mid": 
       TSMod = 0.8;
       finalXP += 3;
       break;
   
   case "Low": 
       TSMod = 0.6;
       finalXP += 2;
       break;

   case "Extra": 
       TSMod = 0.4;
       finalXP += 1;
       break;   
}

var finalTS = statsJSON[challenge]["TS"] * TSMod;
finalTS = Math.round(finalTS);
$("#results").append("TS: " + finalTS);
$("#results").append("<br>");

  //Atack
  var finalAtack = (statsJSON[challenge]["Atack"] - 10 ) * (CAMod + 0.2);
  finalAtack = Math.round(finalAtack);

$("#results").append("Standart Atack: Atack +" +  Math.round(finalAtack)  + ". Damage "+Math.round(finaldamage));
$("#results").append("<br>");
$("#results").append("Advanced (1/Short Rest): Atack +" +  Math.round(finalAtack * 1.2)  + ". Damage "+Math.round(finaldamage* 1.20));
$("#results").append("<br>");
$("#results").append("Final (1/Long Rest): Atack +" +  Math.round(finalAtack * 1.4)  + ". Damage "+Math.round(finaldamage* 1.40));
$("#results").append("<br>");
$("#results").append("Special (Recharge 5-6): Atack +" +  Math.round(finalAtack * 1.6)  + ". Damage "+Math.round(finaldamage* 1.60));
$("#results").append("<br>");
$("#results").append("Legendary Actions (3): Atack +" +  Math.round(finalAtack * 2)  + ". Damage "+Math.round(finaldamage* 2));
$("#results").append("<br>");
//Xp

 var xpMultiplier; 
 finalXP = finalXP + parseInt(aptitude);
 finalXP =  (finalXP / 4)
 console.log("x: "+finalXP)

 switch(finalXP){
    case 0.25: 
      xpMultiplier = 0.000625;
      break;

    case 0.5: 
      xpMultiplier = 0.00125;
      break;

    case 0.5: 
      xpMultiplier = 0.00125;
      break;

    case 0.75: 
      xpMultiplier = 0.0025;
      break;

    case 1: 
      xpMultiplier = 0.005;
      break;

    case 1.25: 
        xpMultiplier = 0.0125;
        break;

    case 1.5: 
      xpMultiplier = 0.015;
      break;

    case 1.75: 
      xpMultiplier = 0.05;
      break;

    default: 
      xpMultiplier = (-21 * Math.pow(finalXP,4) + 238 * Math.pow(finalXP,3) - 867 * Math.pow(finalXP,2) + 1274 * finalXP -600) / 480; 
      break;   
}

    
  
 console.log("f(x): "+xpMultiplier)
 
 var level = Number( $("#level").val());
 var xpVal = xp[level] * xpMultiplier;

 var xpRound = 25;

 if(xpVal > 500){
  xpRound = 50;
 }
 if(xpVal > 1500){
  xpRound = 100;
 }
 if(xpVal > 10000){
  xpRound = 500;
 }
 if(xpVal > 50000){
  xpRound = 1000;
 }
 if(xpVal > 500000){
  xpRound = 10000;
 }

 xpVal = Math.round(xpVal/xpRound)*xpRound;

 $("#c-level").text(level);
 $("#c-xp").text(xpVal.toLocaleString("en-us"));

var ratio = Math.round(finalXP);

if(ratio <= 1){
  $("#c-ratio").text("Minion");
}else{
  if(ratio <= 2){
    $("#c-ratio").text("Weak");
  }else{
    if(ratio <= 3){
      $("#c-ratio").text("Normal");
    }else{
      if(ratio <= 4){
        $("#c-ratio").text("Lieutenant");
      }else{
        if(ratio <= 5){
          $("#c-ratio").text("Boss");
        }else{
          $("#c-ratio").text("Elite Boss");
        }
      } 
    } 
  }
}


}

function changeSkillName(input, number){
  $("#c-skill-name-"+ number).text(input.value + ". ");
}

function changeSkillDescription(input, number){
  $("#c-skill-des-"+ number).text(input.value + ". ");
}

function createSkill(){
  var skillNumber = $(".skill").length;
  var div = '<div class="form-row skill" id="skill-'+ skillNumber +'">'+
            '  <div class="form-group col-9">'+ 
            '    <input type="text" class="form-control"  id="name-'+ skillNumber +'" onChange="changeSkillName(this,'+ skillNumber +')">'+
            '  </div>'+
            '<div class="d-flex justify-content-center col-3" style="height: 25px">'+
            '   <button onClick="removeSkill('+ skillNumber +')" type="button"  class="btn btn-danger  d-center ">Remove</button>'+
            '</div>'+
            '  <div class="form-group col-12">'+ 
            '    <textarea type="text" class="form-control" rows="3"  onChange="changeSkillDescription(this,'+ skillNumber +')" id="des-'+ skillNumber +'"></textarea>'+ 
            '  </div>'+
            '</div>';

    $("#Skills").append(div);

    var skill = '<li id="c-skill-'+ skillNumber +'">'+
                  '<span  id="c-skill-name-'+ skillNumber +'"></span>'+
                  '<div class="d-inline" id="c-skill-des-'+ skillNumber +'"></div>'+
                '</li>';

    $("#skillList").append(skill);

  
}

function removeSkill(num){

  $("#skill-" + num).remove();
  $("#c-skill-" + num).remove();
}


$(function(){
    $("#download").click(createCanvas)
    
 
    $("#generate").click(generate)

    $("#addSkill").click(createSkill)


    $("#level").change(function () {
        $("#challenge").val(Math.floor(Number($(this).val()) / 4)  )       
    });

    $("#challenge").change(function () {
        $("#level").val(Number($(this).val()) * 4 )       
    });

    $("#speed-input").change(function () { 
      $("#c-speed").text($(this).val() )       
  });

    $("#name").keyup(function(){
        $("#c-name").empty();
        var name = this.value;
        $("#c-name").text(name);

    })

    $("#phrase").keyup(function(){ 
      $("#c-phrase").text( this.value);

  })

 
  $('#Immunities').change(function() {
      if(this.checked) {
        $('#c-Immunities').show();
      }else{
        $('#c-Immunities').hide();
      }      
  }); 

  $('#input-Immunities').keyup(function() {

    $("#c-Immunities-list").text($(this).val()); 
    $('#Immunities').prop("checked",true);
    $('#c-Immunities').show();
}); 


$('#Resistances').change(function() {
  if(this.checked) {
    $('#c-Resistances').show();
  }else{
    $('#c-Resistances').hide();
  }      
}); 

$('#input-Resistances').keyup(function() {

$("#c-Resistances-list").text($(this).val()); 
$('#Resistances').prop("checked",true);
$('#c-Resistances').show();
}); 

$('#Vulnerabilities').change(function() {
  if(this.checked) {
    $('#c-Vulnerabilities').show();
  }else{
    $('#c-Vulnerabilities').hide();
  }      
}); 

$('#input-Vulnerabilities').keyup(function() {

$("#c-Vulnerabilities-list").text($(this).val()); 
$('#Vulnerabilities').prop("checked",true);
$('#c-Vulnerabilities').show();
}); 

$('#Senses').change(function() {
  if(this.checked) {
    $('#c-Senses').show();
  }else{
    $('#c-Senses').hide();
  }      
}); 

$('#input-Senses').keyup(function() {

$("#c-Senses-list").text($(this).val()); 
$('#Senses').prop("checked",true);
$('#c-Senses').show();
}); 

$('#Iniciative').change(function() {
  if(this.checked) {
    $('#c-Iniciative').show();
  }else{
    $('#c-Iniciative').hide();
  }      
}); 

$('#input-Iniciative').keyup(function() {

$("#c-Iniciative-list").text($(this).val()); 
$('#Iniciative').prop("checked",true);
$('#c-Iniciative').show();
}); 

$("#Fortitude").change(function () { 
  $("#c-Fortitude").text("+"+$(this).val() )       
});
$("#Dexterity").change(function () { 
  $("#c-Dexterity").text("+"+$(this).val() )       
});

$("#Power").change(function () { 
  $("#c-Power").text("+"+$(this).val() )       
});

$("#Spirit").change(function () { 
  $("#c-Spirit").text("+"+$(this).val() )       
});


})

const xp = [0,1000,1200,1500,1900,2400,3000,3700,4500,5400,6400,7500,8700,10000,11400,12900,14500,16200,
            18000,19900,22300,24800,27400,30200,33100,36100,39200,42400,45800,49300,53200,57000,61000,65000,
            69000,74000,79000,84000,89000,94000,100000,106000,112000,118000,124000,130000,136000,143000,
            150000,157000,165000,173000,181000,189000,197000,205000,213000,222000,231000,243000,257000,
            273000,291000,311000,333000,357000,383000,411000,441000,473000,507000,543000,581000,621000,
            663000,707000,753000,801000,851000,903000,957000,1013000,1071000,1131000,1193000,1257000,
            1323000,1391000,1461000,1533000,1607000,1683000,1761000,1841000,1923000,2007000,2093000,2181000,
            2271000,2363000,2457000,2553000,2651000,2751000,2853000,2957000,3063000,3171000,3281000,3393000,
            3507000,3623000,3741000,3861000,3983000,4107000,4233000,4361000,4491000,4623000,5000000];




var dices = {};
dices[4]="1D4";
dices[6]="1D6";
dices[8]="1D8";
dices[10]="1D10";
dices[12]="1D12";
dices[14]="1D10 + 1D4";
dices[16]="2D8";
dices[18]="1D12 + 1D6";
dices[20]="2D10";
dices[22]="1D12 + 1D10";
dices[24]="2D12";
dices[26]="2D10 + 1D6";
dices[28]="2D10 + 1D8";
dices[30]="3D10";
dices[32]="2D12 + 1D8";
dices[34]="2D12 + 1D10";
dices[36]="3D12";
dices[38]="3D10 + 1D8";
dices[40]="4D10";
dices[42]="3D12 + 1D6";
dices[44]="3D12 + 1D8";
dices[46]="3D12 + 1D10";
dices[48]="4D12";
dices[50]="5D10";
dices[52]="1D12 + 4D10";
dices[54]="4D12 + 1D6";
dices[56]="3D12 + 2D10";
dices[58]="4D12 + 1D10";
dices[60]="5D12";
dices[62]="1D12 + 5D10";
dices[64]="4D12 + 2D8";
dices[66]="3D12 + 3D10";
dices[68]="4D12 + 2D10";
dices[70]="5D12 + 1D10";
dices[72]="6D12";
dices[74]="2D12 + 5D10";
dices[76]="3D12 + 4D10";
dices[78]="4D12 + 3D10";
dices[80]="5D12 + 2D10";
dices[82]="6D12 + 1D10";
dices[84]="7D12";
dices[86]="3D12 + 5D10";
dices[88]="6D12 + 2D8";
dices[90]="5D12 + 3D10";
dices[92]="6D12 + 2D10";
dices[94]="7D12 + 1D10";
dices[96]="8D12";
dices[98]="4D12 + 5D10";
dices[100]="5D12 + 4D10";
dices[102]="8D12 + 1D6";
dices[104]="8D12 + 1D8";
dices[106]="8D12 + 1D10";
dices[108]="9D12";
dices[110]="5D12 + 5D10";
dices[112]="9D12 + 1D4";
dices[114]="9D12 + 1D6";
dices[116]="9D12 + 1D8";
dices[118]="9D12 + 1D10";
dices[120]="10D12";


const statsJSON = 
{
  "1": {
    "Life": 40,
    "Atack": 14,
    "Damage": 12,
    "TS": 12,
    "DamageLow": 7,
    "DamageLowMultiplier": "0,4"
  },
  "2": {
    "Life": 50,
    "Atack": 16,
    "Damage": 20,
    "TS": 13,
    "DamageLow": 12,
    "DamageLowMultiplier": "0,38"
  },
  "3": {
    "Life": 70,
    "Atack": 18,
    "Damage": 28,
    "TS": 15,
    "DamageLow": 18,
    "DamageLowMultiplier": "0,36"
  },
  "4": {
    "Life": 80,
    "Atack": 20,
    "Damage": 36,
    "TS": 16,
    "DamageLow": 24,
    "DamageLowMultiplier": "0,34"
  },
  "5": {
    "Life": 100,
    "Atack": 22,
    "Damage": 44,
    "TS": 18,
    "DamageLow": 30,
    "DamageLowMultiplier": "0,32"
  },
  "6": {
    "Life": 110,
    "Atack": 24,
    "Damage": 52,
    "TS": 19,
    "DamageLow": 36,
    "DamageLowMultiplier": "0,3"
  },
  "7": {
    "Life": 130,
    "Atack": 26,
    "Damage": 60,
    "TS": 21,
    "DamageLow": 43,
    "DamageLowMultiplier": "0,28"
  },
  "8": {
    "Life": 140,
    "Atack": 28,
    "Damage": 68,
    "TS": 22,
    "DamageLow": 50,
    "DamageLowMultiplier": "0,26"
  },
  "9": {
    "Life": 160,
    "Atack": 30,
    "Damage": 76,
    "TS": 24,
    "DamageLow": 58,
    "DamageLowMultiplier": "0,24"
  },
  "10": {
    "Life": 170,
    "Atack": 32,
    "Damage": 84,
    "TS": 25,
    "DamageLow": 66,
    "DamageLowMultiplier": "0,22"
  },
  "11": {
    "Life": 190,
    "Atack": 34,
    "Damage": 92,
    "TS": 27,
    "DamageLow": 74,
    "DamageLowMultiplier": "0,2"
  },
  "12": {
    "Life": 200,
    "Atack": 36,
    "Damage": 100,
    "TS": 28,
    "DamageLow": 82,
    "DamageLowMultiplier": "0,18"
  },
  "13": {
    "Life": 220,
    "Atack": 38,
    "Damage": 108,
    "TS": 30,
    "DamageLow": 91,
    "DamageLowMultiplier": "0,16"
  },
  "14": {
    "Life": 230,
    "Atack": 40,
    "Damage": 116,
    "TS": 31,
    "DamageLow": 100,
    "DamageLowMultiplier": "0,14"
  },
  "15": {
    "Life": 250,
    "Atack": 42,
    "Damage": 124,
    "TS": 33,
    "DamageLow": 109,
    "DamageLowMultiplier": "0,12"
  },
  "16": {
    "Life": 260,
    "Atack": 44,
    "Damage": 132,
    "TS": 34,
    "DamageLow": 119,
    "DamageLowMultiplier": "0,1"
  },
  "17": {
    "Life": 280,
    "Atack": 46,
    "Damage": 140,
    "TS": 36,
    "DamageLow": 129,
    "DamageLowMultiplier": "0,08"
  },
  "18": {
    "Life": 290,
    "Atack": 48,
    "Damage": 148,
    "TS": 37,
    "DamageLow": 139,
    "DamageLowMultiplier": "0,06"
  },
  "19": {
    "Life": 310,
    "Atack": 50,
    "Damage": 156,
    "TS": 39,
    "DamageLow": 150,
    "DamageLowMultiplier": "0,04"
  },
  "20": {
    "Life": 320,
    "Atack": 52,
    "Damage": 164,
    "TS": 40,
    "DamageLow": 161,
    "DamageLowMultiplier": "0,02"
  },
  "21": {
    "Life": 340,
    "Atack": 54,
    "Damage": 172,
    "TS": 42,
    "DamageLow": 175,
    "DamageLowMultiplier": "-0,02"
  },
  "22": {
    "Life": 350,
    "Atack": 56,
    "Damage": 180,
    "TS": 43,
    "DamageLow": 187,
    "DamageLowMultiplier": "-0,04"
  },
  "23": {
    "Life": 370,
    "Atack": 58,
    "Damage": 188,
    "TS": 45,
    "DamageLow": 199,
    "DamageLowMultiplier": "-0,06"
  },
  "24": {
    "Life": 380,
    "Atack": 60,
    "Damage": 196,
    "TS": 46,
    "DamageLow": 212,
    "DamageLowMultiplier": "-0,08"
  },
  "25": {
    "Life": 400,
    "Atack": 62,
    "Damage": 204,
    "TS": 48,
    "DamageLow": 224,
    "DamageLowMultiplier": "-0,1"
  },
  "26": {
    "Life": 410,
    "Atack": 64,
    "Damage": 212,
    "TS": 49,
    "DamageLow": 237,
    "DamageLowMultiplier": "-0,12"
  },
  "27": {
    "Life": 430,
    "Atack": 66,
    "Damage": 220,
    "TS": 51,
    "DamageLow": 251,
    "DamageLowMultiplier": "-0,14"
  },
  "28": {
    "Life": 440,
    "Atack": 68,
    "Damage": 228,
    "TS": 52,
    "DamageLow": 264,
    "DamageLowMultiplier": "-0,16"
  },
  "29": {
    "Life": 460,
    "Atack": 70,
    "Damage": 236,
    "TS": 54,
    "DamageLow": 278,
    "DamageLowMultiplier": "-0,18"
  },
  "30": {
    "Life": 470,
    "Atack": 72,
    "Damage": 244,
    "TS": 55,
    "DamageLow": 293,
    "DamageLowMultiplier": "-0,2"
  }
};