let gen_data = {};
const chaosTotalIncrement = 2000; //average of 100 per mision
const chaosPercentIncrement = 0.05;
var finalChaos = 0;
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// generator function

  function generate_text (type) {
    let list; if (list = gen_data[type]) {
      let string; if (string = select_from(list)) {
        return expand_tokens(string);
      }
    }
    return '';
  }

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// generate multiple

  function generate_list (type, n_of) {
    let list = [];

    let i; for (i = 0; i < n_of; i++) {
      list.push(generate_text(type));
    }
    return list;
  }

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// select from list

  function select_from (list) {
    if (list.constructor == Array) {
      return select_from_array(list);
    } else {
      return select_from_table(list);
    }
  }
  function select_from_array (list) {
    return list[Math.floor(Math.random() * list.length)];
  }
  function select_from_table (list) {
    let len; if (len = scale_table(list)) {
      let idx = Math.floor(Math.random() * len) + 1;

      let key; for (key in list) {
        let r = key_range(key);
        if (idx >= r[0] && idx <= r[1]) { return list[key]; }
      }
    }
    return '';
  }
  function scale_table (list) {
    let len = 0;

    let key; for (key in list) {
      let r = key_range(key);
      if (r[1] > len) { len = r[1]; }
    }
    return len;
  }
  function key_range (key) {
    let match; if (match = /(\d+)-00/.exec(key)) {
      return [ parseInt(match[1]), 100 ];
    } else if (match = /(\d+)-(\d+)/.exec(key)) {
      return [ parseInt(match[1]), parseInt(match[2]) ];
    } else if (key == '00') {
      return [ 100, 100 ];
    } else {
      return [ parseInt(key), parseInt(key) ];
    }
  }

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// expand {token} in string

  function expand_tokens (string) {
    let match; while (match = /{(\w+)}/.exec(string)) {
      let token = match[1];

      let repl; if (repl = generate_text(token)) {
        string = string.replace('{'+token+'}',repl);
      } else {
        string = string.replace('{'+token+'}',token);
      }
    }
    return string;
  }

// - - - - - - - - - - - - - - - - - - - - - - - - - 

$("#generate").on("click", function(){
  var chaosIncrement = Math.round($("#chaosInput").val()/1000)
  var genRate = Math.sqrt(parseInt($("#dice").val())+ parseInt(chaosIncrement))
  generate(Math.round(genRate))
  var initalChaos = parseInt($("#chaosInput").val()) 
  finalChaos = Math.round(chaosTotalIncrement + initalChaos + initalChaos * chaosPercentIncrement)
})

const generatePob =
{
  "Standard": 85,
  "Advanced": 95,
  "Special": 100
}

const specialText=
{
  "1":{
    "prob": 10, 
    "reward":"0$", 
    "chaos": 99, 
    "dificultad":"10",
    "text": "Abistado OVNI por un grangero borracho cuando paseaba a las cabras por la noche",
    "extraReward":"Los investigadores hallaron una nave Mi-Go, no obstante no llegaron a descubrir que hacian. Reducion de final de Caos +200 " 
  },
  "2":{
    "prob": 10, 
    "reward":"0$", 
    "chaos": 99, 
    "dificultad":"10",
    "text": "Abistado unos seres voladores extraños por un campista cerca de una mina avandonada por la noche",
    "extraReward":"Los investigadores hallaron una nave Mi-Go en el interior de la mina, no obstante no llegaron a descubrir que hacian. Reducion de final de Caos +200 " 
  },
  "3":{
    "prob": 10, 
    "reward":"0$", 
    "chaos": 99, 
    "dificultad":"10",
    "text": "Abistado un meteorito que parecia moverse en el cielo de forma inusual",
    "extraReward":"Los investigadores hallaron una nave Mi-Go oculta en tras un campo de camuflage en medio de un bosque, no obstante no llegaron a descubrir que hacian. Reducion de final de Caos +200 " 
  }
}


function generate(num){
  $("#imputrContainer").hide()
  $("#tableContainer").show()
  var lines = generate_list('main',num)
  $("#outputTable").empty()

  for(line in lines){
    var rand = Math.round(Math.random()*100)
    
    if(rand <= generatePob["Standard"]){
      generateStandarRow(lines,line)
    }
    if(rand > generatePob["Standard"] && rand <= generatePob["Advanced"]){
      generateAvancedRow(lines,line)
    }
    if(rand > generatePob["Advanced"] && rand <= generatePob["Special"]){
      generateSpecialRow(line)
    }
  }

  //Datatables
  $('#mainTable').DataTable({
    paging: false,
    searching: false,
  });

  $("#sucessButon").on("click",function(){
    $("#infoModalSection").hide()
    $("#failModalSection").hide()
    $("#extraModalSection").show()
  })

  $("#failButon").on("click",function(){

    var emotion = generateProbText(emotionProb)
    var failiure = generateProbText(failiureRewardProb)

    $("#emotionText").text("")
    $("#failiureText").text("")

    if(emotionProb[emotion].text != "Nada"){
      $("#emotionText").text(emotionProb[emotion].text)
    }
    if(failiureRewardProb[failiure].text != "Nada"){
      $("#failiureText").text(failiureRewardProb[failiure].text)
    }

    $("#infoModalSection").hide()
    $("#extraModalSection").hide()
    $("#failModalSection").show()
  })

}

function generateAvancedRow(lines,line){
  var dificulty = Math.round(30 + (Math.random()*100)%25)
  var evaluation = Math.sqrt((($("#eval").val())/3))+1
  var error =  Math.round(dificulty / evaluation)
  var realDificulty = error==0? dificulty: Math.round(dificulty - error + (Math.random()*100)%(error*2))
  var reward = generateReward()   
  var state  =  generateState();
  var chaosMultiplier = parseInt(rewardProb[reward]["chaosIndex"]) +  (0.1 * realDificulty)  //Max 3 + 1.5
  var chaos = 20 + Math.round(((Math.random()*80) *  chaosMultiplier)/5)*5 
  var chaosClass = chaos >= 100? "chaos-"+Math.floor(chaos/100): ""
  var extraReward  =  generateExtraReward();

  reward =  Math.round((parseInt(reward)*0.14)*10) + Math.round(Math.random()*20)*100 + (realDificulty-10) * 150

  if(extraReward == "Nada"){
    extraReward  =  generateExtraReward();
  }else{
    var temp  =  generateExtraReward();
    if(temp == "Nada"){
      temp = "Reducion de indice General de Caos X2"
    }
    extraReward += "<br>"+ 
                    "<div class='advancedRewardMesage pt-3'>"+
                      "Recompensa Extra Avanzada"+
                      "<br>"+
                      "<div class='advancedReward'>"+temp+"</div>"
                    "</div>"
  }

  $("#outputTable").append('<tr>'+
    '<th class="align-middle" scope="row">'+(line)+'</th>'+
    '<td class="align-middle">'+lines[line]+ '</td>'+
    '<td class="align-middle">'+dificulty+' <span class="reduccion">&#177;'+error+'</span></td>'+ 
    '<td class="align-middle">'+reward+'$</td>'+
    '<td class="align-middle">'+state+'</td>'+
    '<td class="align-middle text-center chaos '+chaosClass+'">'+chaos+'</td>'+
    '<td class="align-middle text-center"><button id="butom-'+line+'" data-bs-toggle="modal" data-bs-target="#modal" type="button" class="btn btn-primary btn-sm">Reclamar</button></td>'+
  '</tr>')

  $("#butom-"+line).data("realDificulty",realDificulty)
  $("#butom-"+line).data("extraReward",extraReward)
  $("#butom-"+line).data("chaos",chaos)
  $("#butom-"+line).data("text",lines[line])
  $("#butom-"+line).data("number",line)
  $("#butom-"+line).data("state",state)

  addModal("#butom-"+line)


}



function generateSpecialRow(line){
  var index = generateProbText(specialText);
  var dificulty = specialText[index]["dificultad"]
  var evaluation = Math.sqrt((($("#eval").val())/3))+1
  var error =  Math.round(dificulty / evaluation)
  var realDificulty = specialText[index]["dificultad"]
  var reward = specialText[index]["reward"]   
  var state  =  generateState(); 
  var chaos = specialText[index]["chaos"]  
  var chaosClass = chaos >= 100? "chaos-"+Math.floor(chaos/100): ""
  var extraReward  =  specialText[index]["extraReward"]  

  $("#outputTable").append('<tr>'+
    '<th class="align-middle" scope="row">'+(line)+'</th>'+
    '<td class="align-middle">'+specialText[index]["text"]+ '</td>'+
    '<td class="align-middle">'+dificulty+' <span class="reduccion">&#177;'+error+'</span></td>'+ 
    '<td class="align-middle">'+reward+'</td>'+
    '<td class="align-middle">'+state+'</td>'+
    '<td class="align-middle text-center chaos '+chaosClass+'">'+chaos+'</td>'+
    '<td class="align-middle text-center"><button id="butom-'+line+'" data-bs-toggle="modal" data-bs-target="#modal" type="button" class="btn btn-primary btn-sm">Reclamar</button></td>'+
  '</tr>')

  $("#butom-"+line).data("realDificulty",realDificulty)
  $("#butom-"+line).data("extraReward",extraReward)
  $("#butom-"+line).data("chaos",chaos)
  $("#butom-"+line).data("text",specialText[index]["text"])
  $("#butom-"+line).data("number",line)
  $("#butom-"+line).data("state",state)

  addModal("#butom-"+line)
}

function generateStandarRow(lines,line){
    var dificulty = Math.round(5 + (Math.random()*100)%25)
    var evaluation = Math.sqrt((($("#eval").val())/2))+1
    var error =  Math.round(dificulty / evaluation)
    var realDificulty = error==0? dificulty: Math.round(dificulty - error + (Math.random()*100)%(error*2))
    var reward = generateReward()
    var extraReward  =  generateExtraReward();
    var state  =  generateState();
    var chaosMultiplier = parseInt(rewardProb[reward]["chaosIndex"]) +  (0.05 * realDificulty)  //Max 3 + 1.5
    var chaos = 20 + Math.round(((Math.random()*80) *  chaosMultiplier)/5)*5 
    var chaosClass = chaos >= 100? "chaos-"+Math.floor(chaos/100): ""
    $("#outputTable").append('<tr>'+
      '<th class="align-middle" scope="row">'+(line)+'</th>'+
      '<td class="align-middle">'+lines[line]+ '</td>'+
      '<td class="align-middle">'+dificulty+' <span class="reduccion">&#177;'+error+'</span></td>'+ 
      '<td class="align-middle">'+reward+'$</td>'+
      '<td class="align-middle">'+state+'</td>'+
      '<td class="align-middle text-center chaos '+chaosClass+'">'+chaos+'</td>'+
      '<td class="align-middle text-center"><button id="butom-'+line+'" data-bs-toggle="modal" data-bs-target="#modal" type="button" class="btn btn-primary btn-sm">Reclamar</button></td>'+
    '</tr>')

    $("#butom-"+line).data("realDificulty",realDificulty)
    $("#butom-"+line).data("extraReward",extraReward)
    $("#butom-"+line).data("chaos",chaos)
    $("#butom-"+line).data("text",lines[line])
    $("#butom-"+line).data("number",line)
    $("#butom-"+line).data("state",state)

    
    addModal("#butom-"+line)


}


function addModal(butomId){
  
  $(butomId).on("click",function(){
    var realDificulty = $(this).data("realDificulty")
    var extraReward= $(this).data("extraReward")
    var chaos = $(this).data("chaos")
    var text = $(this).data("text")
    var number = $(this).data("number")
    var state = $(this).data("state")


    $(this).removeClass("btn-primary")
    $(this).addClass("btn-dark")
    
    
    $("#infoModalSection").show()
    $("#extraModalSection").hide()
    $("#failModalSection").hide()

    $("#misionCode").text("#" +number)
    $("#description-text").text(text)
    $("#localization").text(state)
    $("#dificulty").text(realDificulty)
    $("#death").text(Math.ceil(realDificulty/2))
    $("#extraReward").empty()
    $("#extraReward").append(extraReward)
    $("#chaosReduction").text(chaos)
    $("#mesageState").text($( "#continent option:selected" ).text())

    if(extraReward == "Nada"){
      $("#extraRewardMesage").hide()
      $("#extraReward").hide()
    }else{
      $("#extraRewardMesage").show()
      $("#extraReward").show()
    }


  })
}



const rewardProb ={
  "0": {"prob": 50, "chaosIndex":3},
  "250": {"prob": 20, "chaosIndex":2},
  "500": {"prob": 20, "chaosIndex":2},
  "1000": {"prob": 15, "chaosIndex":1.5},
  "2000": {"prob": 10, "chaosIndex":1.5},
  "3000": {"prob": 15, "chaosIndex":1},
  "4000": {"prob": 10, "chaosIndex":1},
  "5000": {"prob": 5, "chaosIndex":0.75},
  "6000": {"prob": 5, "chaosIndex":0.75},
  "8000": {"prob": 5, "chaosIndex":0.75},
  "10000": {"prob": 5, "chaosIndex":0.5},
  "12000": {"prob": 5, "chaosIndex":0.5},
  "15000": {"prob": 5, "chaosIndex":0.5},
  "20000": {"prob": 1, "chaosIndex":0.25}
}

const rewardProbMax = 171

function generateReward(){
  rand = (Math.round(Math.random()*1000)%rewardProbMax)

    for (prob in rewardProb){
      if(parseInt(rewardProb[prob]["prob"]) >= rand){
        return prob
      }else{
        rand -= parseInt(rewardProb[prob]["prob"])
      }
    }

  return 0
}

const failiureRewardProb ={
  "0": {"text": "Nada", "prob": 200},
  "1": {"text": "-500$", "prob": 15},
  "2": {"text": "-1000$", "prob": 20},
  "3": {"text": "-1500$", "prob": 30},
  "4": {"text": "-2000$", "prob": 35},
  "5": {"text": "-3000$", "prob": 30},
  "6": {"text": "-5000$", "prob": 25},
  "7": {"text": "-6000$", "prob": 20},
  "8": {"text": "-8000$", "prob": 15},
  "9": {"text": "-10000$", "prob": 10},
  "10": {"text": "-12000$", "prob": 5},
  "11": {"text": "El equipo perdio uno de los artefactos primigenios que llevavan", "prob": 20},
  "12": {"text": "El equipo perdio uno de los artefactos arcanos que llevavan", "prob": 20},
  "13": {"text": "-1 Azul", "prob": 15},
  "14": {"text": "-2 Azules", "prob": 20},
  "15": {"text": "-3 Azules", "prob": 25},
  "16": {"text": "-4 Azules", "prob": 30},
  "17": {"text": "-5 Azules", "prob": 25},
  "18": {"text": "-6 Azules", "prob": 20},
  "19": {"text": "-8 Azules", "prob": 15},
  "20": {"text": "-10 Azules", "prob": 10}
}



const emotionProb =
{
  "0": {"text": "Nada", "prob": 80},
  "1": {"text": "Reduce el Esfuezo de todos los Investigadores", "prob": 10},
  "2": {"text": "Reduce la Lealtad de todos los Investigadores", "prob": 10},
  "3": {"text": "Reduce la Felicidad de todos los Investigadores", "prob": 10},
  "5": {"text": "Reduce la Felicidad de uno de los Investigadores", "prob": 8},
  "6": {"text": "Reduce el Esfuezo de uno de los Investigadores", "prob": 8},
  "7": {"text": "Reduce la Lealtad de uno de los Investigadores", "prob": 8},
  "8": {"text": "Reduce la Felicidad y Lealtad de uno de los Investigadores", "prob": 6},
  "9": {"text": "Reduce la Felicidad y Esfuerzo de uno de los Investigadores", "prob": 6},
  "10": {"text": "Reduce la Lealtad y Esfuerzo de uno de los Investigadores", "prob": 6},
  "11": {"text": "Reduce la Felicidad y Lealtad de todos los Investigadores", "prob": 4},
  "12": {"text": "Reduce la Felicidad y Esfuerzo de todos los Investigadores", "prob": 4},
  "13": {"text": "Reduce la Lealtad y Esfuerzo de todos los Investigadores", "prob": 4},
  "14": {"text": "Reduce la Lealtad, Felicidad y Esfuerzo de todos los Investigadores", "prob": 2},
  "15": {"text": "Reduce la Lealtad, Felicidad y Esfuerzo de uno de los Investigadores", "prob": 2},
  "16": {"text": "Reduce en 2 el Esfuezo de todos los Investigadores", "prob": 5},
  "17": {"text": "Reduce en 2 la Lealtad de todos los Investigadores", "prob": 5},
  "18": {"text": "Reduce en 2 la Felicidad de todos los Investigadores", "prob": 5},
  "19": {"text": "Reduce en 2 la Felicidad de uno de los Investigadores", "prob": 8},
  "20": {"text": "Reduce en 2 el Esfuezo de uno de los Investigadores", "prob": 8},
  "21": {"text": "Reduce en 2 la Lealtad de uno de los Investigadores", "prob": 8}
  
}



function generateProbText(probText,probMax){
  if(probMax==undefined){
    probMax = countProbMax(probText)
  }
  rand = (Math.round(Math.random()*probMax *10)%probMax)

    for (prob in probText){
      if(parseInt(probText[prob]["prob"]) >= rand){
        return prob
      }else{
        rand -= parseInt(probText[prob]["prob"])
      }
    }

  return 0
}

const extraRewardProb ={
  "0": {"text": "Nada", "prob": 80},
  "1": {"text": "250$", "prob": 20},
  "2": {"text": "500$", "prob": 20},
  "3": {"text": "750$", "prob": 20},
  "4": {"text": "1000$", "prob": 40},
  "5": {"text": "1500$", "prob": 40},
  "6": {"text": "2000$", "prob": 40},
  "7": {"text": "2500$", "prob": 40},
  "8": {"text": "3000$", "prob": 30},
  "9": {"text": "5000$", "prob": 15},
  "10": {"text": "8000$", "prob": 5},
  "11": {"text": "2x Extra reducion del indice de caos", "prob": 20},
  "12": {"text": "2.5x Extra reducion del indice de caos", "prob": 10},
  "13": {"text": "3x Extra reducion del indice de caos", "prob": 10},
  "14": {"text": "200$ y +100 Extra reducion del indice de caos", "prob": 10},
  "15": {"text": "500$ y +100 Extra reducion del indice de caos", "prob": 10},
  "16": {"text": "1000$ y +300 Extra reducion del indice de caos", "prob": 10},
  "17": {"text": "100$ y +150 Extra reducion del indice de caos", "prob": 10},
  "18": {"text": "500$ y +200 Extra reducion del indice de caos", "prob": 10},
  "19": {"text": "-500$", "prob": 20},
  "20": {"text": "-1000$", "prob": 15},
  "21": {"text": "-1500$", "prob": 10},
  "22": {"text": "-2000$", "prob": 5},
  "23": {"text": "Libro Arcano (+0.02 Biblioteca o Venta 5 Azules)", "prob": 5},
  "24": {"text": "Tomo primigenio (+0.05 Biblioteca o Venta 15 Azules)", "prob": 5},
  "25": {"text": "Bestiario (+0.04 Biblioteca o 8 Venta Azules)", "prob": 5},
  "26": {"text": "Arma Arcana +1 (Venta 10 Azules)", "prob": 2},
  "27": {"text": "Arma Arcana +2 (Venta 15 Azules)", "prob": 2},
  "28": {"text": "Arma Arcana +3 (Venta 20 Azules)", "prob": 2},
  "29": {"text": "Arma Arcana +4 (Venta 25 Azules)", "prob": 2},
  "30": {"text": "Artefacto Primigenio +5", "prob": 1},
  "31": {"text": "Artefacto Primigenio +6", "prob": 1},
  "32": {"text": "Artefacto Primigenio +7", "prob": 1},
  "33": {"text": "Artefacto Primigenio +8", "prob": 1},
  "34": {"text": "Artefacto Primigenio +9", "prob": 1},
  "35": {"text": "El equipo tuvo un ligero incidente y perdio uno de los artefactos primigenios que llevavan", "prob": 5},
  "36": {"text": "El equipo tuvo un ligero incidente y perdio uno de los artefactos arcanos que llevavan", "prob": 5},
  "37": {"text": "+100 Extra reducion del indice de caos", "prob": 10},
  "38": {"text": "+200 Extra reducion del indice de caos", "prob": 10},
  "39": {"text": "+500 Extra reducion del indice de caos", "prob": 5},
  "40": {"text": "+300 Extra reducion del indice de caos", "prob": 10},
  "41": {"text": "+400 Extra reducion del indice de caos", "prob": 5},
  "42": {"text": "25 Azules", "prob": 1},
  "43": {"text": "20 Azules", "prob": 2},
  "44": {"text": "15 Azules", "prob": 2},
  "45": {"text": "10 Azules", "prob": 4},
  "46": {"text": "5 Azules", "prob": 5},
  "47": {"text": "4 Azules", "prob": 6},
  "48": {"text": "3 Azules", "prob": 7},
  "49": {"text": "2 Azules", "prob": 8},
  "50": {"text": "1 Azul", "prob": 10},
  "51": {"text": "+200 Extra reducion del indice de caos", "prob": 5},
  "52": {"text": "+150 Extra reducion del indice de caos", "prob": 10},
  "53": {"text": "1.5x Extra reducion del indice de caos", "prob": 20},
  "54": {"text": "1000$ y +150 Extra reducion del indice de caos", "prob": 10},
  "55": {"text": "2000$ y +100 Extra reducion del indice de caos", "prob": 10},
  "56": {"text": "3000$ y +100 Extra reducion del indice de caos", "prob": 5},
  "57": {"text": "5000$ y +250 Extra reducion del indice de caos", "prob": 2},
  "58": {"text": "3.5x Extra reducion del indice de caos", "prob": 5},
  "59": {"text": "4x Extra reducion del indice de caos", "prob": 5},
  "60": {"text": "Armadura Arcana +1", "prob": 2},
  "61": {"text": "Artefacto Primigenio +2", "prob": 2},
  "62": {"text": "Artefacto Primigenio +3", "prob": 2},
  "63": {"text": "6 Azules", "prob": 2},
  "64": {"text": "8 Azules", "prob": 2},
  "65": {"text": "12 Azules", "prob": 1},
  "66": {"text": "14 Azules", "prob": 1},
  "67": {"text": "-1 Azules", "prob": 1},
  "68": {"text": "-2 Azules", "prob": 1},
  "69": {"text": "-4 Azules", "prob": 1},
  "70": {"text": "Incrementa la Felicidad de todos los Investigadores", "prob": 5},
  "71": {"text": "Incrementa el Esfuezo de todos los Investigadores", "prob": 5},
  "72": {"text": "Incrementa la Lealtad de todos los Investigadores", "prob": 5},
  "73": {"text": "Experiencia X2 a todos los investigadores", "prob": 5},
  "74": {"text": "Experiencia X3 a todos los investigadores", "prob": 5},
  "75": {"text": "Incrementa la Felicidad de uno de los Investigadores", "prob": 10},
  "76": {"text": "Incrementa el Esfuezo de uno de los Investigadores", "prob": 10},
  "77": {"text": "Incrementa la Lealtad de uno de los Investigadores", "prob": 10},
  "78": {"text": "Experiencia X2 a uno de los investigadores", "prob": 10},
  "79": {"text": "Experiencia X3 a uno de los investigadores", "prob": 10},
  "79": {"text": "Incrementa la Felicidad y Lealtad de uno de los Investigadores", "prob": 5},
  "80": {"text": "Incrementa la Felicidad y Esfuerzo de uno de los Investigadores", "prob": 5},
  "81": {"text": "Incrementa la Lealtad y Esfuerzo de uno de los Investigadores", "prob": 5},
  "82": {"text": "Incrementa la Felicidad y Lealtad de todos los Investigadores", "prob": 2},
  "83": {"text": "Incrementa la Felicidad y Esfuerzo de todos los Investigadores", "prob": 1},
  "84": {"text": "Incrementa la Lealtad y Esfuerzo de todos los Investigadores", "prob": 1}

}

const extraRewardProbMax = 784

function countExtraRewardProbMax(){
  var toRet=0;

  for(reward in extraRewardProb){
    toRet+= parseInt(extraRewardProb[reward]["prob"])
  }
  
  return toRet;
}

function countProbMax(jSon){
  var toRet=0;

  for(line in jSon){
    toRet+= parseInt(jSon[line]["prob"])
  }
  
  return toRet;
}

function generateExtraReward(){
  rand = (Math.round(Math.random()*1000)%extraRewardProbMax)

    for (prob in extraRewardProb){
      if(parseInt(extraRewardProb[prob]["prob"]) >= rand){
        return extraRewardProb[prob]["text"]
      }else{
        rand -= parseInt(extraRewardProb[prob]["prob"])
      }
    }

  return "Nada"
}


function generateState(){
  var continent = $("#continent").val()
  rand = (Math.round(Math.random()*1000)%states[continent].length)
  return states[continent][rand]
}


///// Document Ready
$(function(){
  $("#tableContainer").hide()
  // $('#mainTable').DataTable();
})

let states = [];
states["NAmerica"] =  
[
  "Alabama (USA)",
  "Alaska (USA)",
  "Arizona (USA)",
  "Arkansas (USA)",
  "California (USA)",
  "Carolina del Norte (USA)",
  "Carolina del Sur (USA)",
  "Colorado (USA)",
  "Connecticut (USA)",
  "Dakota del Norte (USA)",
  "Dakota del Sur (USA)",
  "Delaware (USA)",
  "Florida (USA)",
  "Georgia (USA)",
  "Hawáii (USA)",
  "Idaho (USA)",
  "Illinois (USA)",
  "Indiana (USA)",
  "Iowa (USA)",
  "Kansas (USA)",
  "Kentucky (USA)",
  "Luisiana (USA)",
  "Maine (USA)",
  "Maryland (USA)",
  "Massachusetts (USA)",
  "Míchigan (USA)",
  "Minnesota (USA)",
  "Misisipi (USA)",
  "Misuri (USA)",
  "Montana (USA)",
  "Nebraska (USA)",
  "Nevada (USA)",
  "Nueva Jersey (USA)",
  "Nueva York (USA)",
  "Nuevo Hampshire (USA)",
  "Nuevo México (USA)",
  "Ohio (USA)",
  "Oklahoma (USA)",
  "Oregón (USA)",
  "Pensilvania (USA)",
  "Rhode Island (USA)",
  "Tennessee (USA)",
  "Texas (USA)",
  "Utah (USA)",
  "Vermont (USA)",
  "Virginia (USA)",
  "Virginia Occidental (USA)",
  "Washington (USA)",
  "Wisconsin (USA)",
  "Wyoming (USA)",
  "Alberta (Canada)",
  "Columbia Británica (Canada)",
  "Manitoba (Canada)",
  "Nuevo Brunswick (Canada)",
  "Terranova y Labrador (Canada)",
  "Nueva Escocia (Canada)",
  "Ontario (Canada)",
  "Isla del Príncipe Eduardo (Canada)",
  "Quebec (Canada)",
  "Saskatchewan (Canada)",
  "Territorios del Noroeste (Canada)",
  "Nunavut (Canada)",
  "Yukón (Canada)"
]

states["Europe"]=
[
  "Norte de Albania",
  "Sur de Albania",
  "Este de Albania",
  "Oeste de Albania",
  "Tirana (Albania)",
  "Norte de Alemania",
  "Sur de Alemania",
  "Este de Alemania",
  "Oeste de Alemania",
  "Berlín (Alemania)",
  "Norte de Andorra",
  "Sur de Andorra",
  "Este de Andorra",
  "Oeste de Andorra",
  "Andorra La Vieja (Andorra)",
  "Norte de Armenia ",
  "Sur de Armenia ",
  "Este de Armenia ",
  "Oeste de Armenia ",
  "Ereván (Armenia)",
  "Norte de Austria",
  "Sur de Austria",
  "Este de Austria",
  "Oeste de Austria",
  "Viena (Austria)",
  "Norte de Azerbaiyán ",
  "Sur de Azerbaiyán ",
  "Este de Azerbaiyán ",
  "Oeste de Azerbaiyán ",
  "Bakú (Azerbaiyán)",
  "Norte de Bélgica",
  "Sur de Bélgica",
  "Este de Bélgica",
  "Oeste de Bélgica",
  "Bruselas (Bélgica)",
  "Norte de Bielorrusia",
  "Sur de Bielorrusia",
  "Este de Bielorrusia",
  "Oeste de Bielorrusia",
  "Minsk (Bielorrusia)",
  "Norte de Bosnia y Herzegovina",
  "Sur de Bosnia y Herzegovina",
  "Este de Bosnia y Herzegovina",
  "Oeste de Bosnia y Herzegovina",
  "Sarajevo (Bosnia y Herzegovina)",
  "Norte de Bulgaria",
  "Sur de Bulgaria",
  "Este de Bulgaria",
  "Oeste de Bulgaria",
  "Sofía (Bulgaria)",
  "Norte de Chipre ",
  "Sur de Chipre ",
  "Este de Chipre ",
  "Oeste de Chipre ",
  "Nicosia (Chipre)",
  "Norte de Ciudad del Vaticano",
  "Sur de Ciudad del Vaticano",
  "Este de Ciudad del Vaticano",
  "Oeste de Ciudad del Vaticano",
  "Ciudad del Vaticano (Ciudad del Vaticano)",
  "Norte de Croacia",
  "Sur de Croacia",
  "Este de Croacia",
  "Oeste de Croacia",
  "Zagreb (Croacia)",
  "Norte de Dinamarca",
  "Sur de Dinamarca",
  "Este de Dinamarca",
  "Oeste de Dinamarca",
  "Copenhague (Dinamarca)",
  "Norte de Eslovaquia",
  "Sur de Eslovaquia",
  "Este de Eslovaquia",
  "Oeste de Eslovaquia",
  "Bratislava (Eslovaquia)",
  "Norte de Eslovenia",
  "Sur de Eslovenia",
  "Este de Eslovenia",
  "Oeste de Eslovenia",
  "Liubliana (Eslovenia)",
  "Norte de España",
  "Sur de España",
  "Este de España",
  "Oeste de España",
  "Madrid (España)",
  "Norte de Estonia",
  "Sur de Estonia",
  "Este de Estonia",
  "Oeste de Estonia",
  "Tallín (Estonia)",
  "Norte de Finlandia",
  "Sur de Finlandia",
  "Este de Finlandia",
  "Oeste de Finlandia",
  "Helsinki (Finlandia)",
  "Norte de Francia",
  "Sur de Francia",
  "Este de Francia",
  "Oeste de Francia",
  "París (Francia)",
  "Norte de Georgia ",
  "Sur de Georgia ",
  "Este de Georgia ",
  "Oeste de Georgia ",
  "Tiflis (Georgia)",
  "Norte de Grecia",
  "Sur de Grecia",
  "Este de Grecia",
  "Oeste de Grecia",
  "Atenas (Grecia)",
  "Norte de Hungría",
  "Sur de Hungría",
  "Este de Hungría",
  "Oeste de Hungría",
  "Budapest (Hungría)",
  "Norte de Irlanda",
  "Sur de Irlanda",
  "Este de Irlanda",
  "Oeste de Irlanda",
  "Dublín (Irlanda)",
  "Norte de Islandia",
  "Sur de Islandia",
  "Este de Islandia",
  "Oeste de Islandia",
  "Reikiavik (Islandia)",
  "Norte de Italia",
  "Sur de Italia",
  "Este de Italia",
  "Oeste de Italia",
  "Roma (Italia)",
  "Norte de Kazajistán ",
  "Sur de Kazajistán ",
  "Este de Kazajistán ",
  "Oeste de Kazajistán ",
  "Nursultán (Kazajistán)",
  "Norte de Letonia",
  "Sur de Letonia",
  "Este de Letonia",
  "Oeste de Letonia",
  "Riga (Letonia)",
  "Norte de Liechtenstein",
  "Sur de Liechtenstein",
  "Este de Liechtenstein",
  "Oeste de Liechtenstein",
  "Vaduz (Liechtenstein)",
  "Norte de Lituania",
  "Sur de Lituania",
  "Este de Lituania",
  "Oeste de Lituania",
  "Vilna (Lituania)",
  "Norte de Luxemburgo",
  "Sur de Luxemburgo",
  "Este de Luxemburgo",
  "Oeste de Luxemburgo",
  "Luxemburgo (Luxemburgo)",
  "Norte de Macedonia del Norte",
  "Sur de Macedonia del Norte",
  "Este de Macedonia del Norte",
  "Oeste de Macedonia del Norte",
  "Skopie (Macedonia del Norte)",
  "Norte de Malta",
  "Sur de Malta",
  "Este de Malta",
  "Oeste de Malta",
  "La Valeta (Malta)",
  "Norte de Moldavia",
  "Sur de Moldavia",
  "Este de Moldavia",
  "Oeste de Moldavia",
  "Chisinau (Moldavia)",
  "Norte de Mónaco",
  "Sur de Mónaco",
  "Este de Mónaco",
  "Oeste de Mónaco",
  "Mónaco (Mónaco)",
  "Norte de Montenegro",
  "Sur de Montenegro",
  "Este de Montenegro",
  "Oeste de Montenegro",
  "Podgorica (Montenegro)",
  "Norte de Noruega",
  "Sur de Noruega",
  "Este de Noruega",
  "Oeste de Noruega",
  "Oslo (Noruega)",
  "Norte de Países Bajos",
  "Sur de Países Bajos",
  "Este de Países Bajos",
  "Oeste de Países Bajos",
  "Ámsterdam (Países Bajos)",
  "Norte de Polonia",
  "Sur de Polonia",
  "Este de Polonia",
  "Oeste de Polonia",
  "Varsovia (Polonia)",
  "Norte de Portugal",
  "Sur de Portugal",
  "Este de Portugal",
  "Oeste de Portugal",
  "Lisboa (Portugal)",
  "Norte de Reino Unido",
  "Sur de Reino Unido",
  "Este de Reino Unido",
  "Oeste de Reino Unido",
  "Londres (Reino Unido)",
  "Norte de República Checa",
  "Sur de República Checa",
  "Este de República Checa",
  "Oeste de República Checa",
  "Praga (República Checa)",
  "Norte de Rumanía",
  "Sur de Rumanía",
  "Este de Rumanía",
  "Oeste de Rumanía",
  "Bucarest (Rumanía)",
  "Norte de Rusia ",
  "Sur de Rusia ",
  "Este de Rusia ",
  "Oeste de Rusia ",
  "Moscú (Rusia)",
  "Norte de San Marino",
  "Sur de San Marino",
  "Este de San Marino",
  "Oeste de San Marino",
  "San Marino (San Marino)",
  "Norte de Serbia",
  "Sur de Serbia",
  "Este de Serbia",
  "Oeste de Serbia",
  "Belgrado (Serbia)",
  "Norte de Suecia",
  "Sur de Suecia",
  "Este de Suecia",
  "Oeste de Suecia",
  "Estocolmo (Suecia)",
  "Norte de Suiza",
  "Sur de Suiza",
  "Este de Suiza",
  "Oeste de Suiza",
  "Berna (Suiza)",
  "Norte de Turquía ",
  "Sur de Turquía ",
  "Este de Turquía ",
  "Oeste de Turquía ",
  "Ankara (Turquía)",
  "Norte de Ucrania",
  "Sur de Ucrania",
  "Este de Ucrania",
  "Oeste de Ucrania",
  "Kiev (Ucrania)"
]

states["SAmerica"]=
[
"Norte de Argentina",
"Sur de Argentina",
"Este de Argentina",
"Oeste de Argentina",
"Buenos Aires (Argentina)",
"Norte de Bolivia",
"Sur de Bolivia",
"Este de Bolivia",
"Oeste de Bolivia",
"Sucre (Bolivia)",
"Norte de Brasil",
"Sur de Brasil",
"Este de Brasil",
"Oeste de Brasil",
"Brasilia (Brasil)",
"Norte de Chile",
"Sur de Chile",
"Este de Chile",
"Oeste de Chile",
"Santiago de Chile (Chile)",
"Norte de Colombia",
"Sur de Colombia",
"Este de Colombia",
"Oeste de Colombia",
"Bogotá (Colombia)",
"Norte de Ecuador",
"Sur de Ecuador",
"Este de Ecuador",
"Oeste de Ecuador",
"Quito (Ecuador)",
"Norte de Guyana",
"Sur de Guyana",
"Este de Guyana",
"Oeste de Guyana",
"Georgetown (Guyana)",
"Norte de Paraguay",
"Sur de Paraguay",
"Este de Paraguay",
"Oeste de Paraguay",
"Asunción (Paraguay)",
"Norte de Perú",
"Sur de Perú",
"Este de Perú",
"Oeste de Perú",
"Lima (Perú)",
"Norte de Surinam",
"Sur de Surinam",
"Este de Surinam",
"Oeste de Surinam",
"Paramaribo (Surinam)",
"Norte de Uruguay",
"Sur de Uruguay",
"Este de Uruguay",
"Oeste de Uruguay",
"Montevideo (Uruguay)",
"Norte de Venezuela",
"Sur de Venezuela",
"Este de Venezuela",
"Oeste de Venezuela",
"Caracas (Venezuela)"
]

states["Asia"]=
[
  "Localizacion Desconocida"
]

states["Africa"]=
[
  "Localizacion Desconocida"
]

states["Oceania"]=
[
  "Localizacion Desconocida"
]

states["NPole"]=
[
  "Localizacion Desconocida"
]

states["SPole"]=
[
  "Localizacion Desconocida"
]