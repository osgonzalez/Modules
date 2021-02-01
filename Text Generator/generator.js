let gen_data = {};
const chaosTotalIncrement = 2000; //100 per mision
const chaosPercentIncrement = 0.05;

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
  generate(Math.sqrt((($("#dice").val())))-1)
})


function generate(num){
  $("#imputrContainer").hide()
  $("#tableContainer").show()
  var lines = generate_list('main',num)
  $("#outputTable").empty()

  for(line in lines){
    var dificulty = Math.round(5 + (Math.random()*100)%25)
    var error =  Math.round(dificulty / ((Math.sqrt((($("#eval").val()))))+1))
    var reward = generateReward()
    var extraReward  =  generateExtraReward();
    var state  =  generateState();
    var chaosMultiplier = parseInt(rewardProb[reward]["chaosIndex"]) +  (0.05 * dificulty)  //Max 3 + 1.5
    var chaos = 20 + Math.round(((Math.random()*80) *  chaosMultiplier)/5)*5 
    var chaosClass = chaos >= 100? "chaos-"+Math.floor(chaos/100): ""
    $("#outputTable").append('<tr>'+
      '<th scope="row">'+(line)+'</th>'+
      '<td>'+lines[line]+ '</td>'+
      '<td>'+dificulty+' <span class="reduccion">&#177;'+error+'</span></td>'+ 
      '<td>'+reward+'$</td>'+
      '<td>'+state+'</td>'+
      '<td class="'+chaosClass+'">'+chaos+'</td>'+
      '<td class="black">'+extraReward+'</td>'+
    '</tr>')
  }

  //Datatables
  $('#mainTable').DataTable({
    paging: false,
    searching: false,
  });

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


const extraRewardProb ={
  "0": {"text": "Nada", "prob": 177},
  "1": {"text": "250$", "prob": 20},
  "2": {"text": "500$", "prob": 20},
  "3": {"text": "750$", "prob": 20},
  "4": {"text": "1000$", "prob": 20},
  "5": {"text": "1500$", "prob": 20},
  "6": {"text": "2000$", "prob": 20},
  "7": {"text": "2500$", "prob": 20},
  "8": {"text": "3000$", "prob": 20},
  "9": {"text": "5000$", "prob": 5},
  "10": {"text": "8000$", "prob": 5},
  "11": {"text": "+1x Extra reducion del indice de caos", "prob": 10},
  "12": {"text": "+1.5x Extra reducion del indice de caos", "prob": 10},
  "13": {"text": "+2x Extra reducion del indice de caos", "prob": 10},
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
  "35": {"text": "El equipo pierde uno de los artefactos primigenios que llevavan", "prob": 5},
  "36": {"text": "El equipo pierde uno de los artefactos arcanos que llevavan", "prob": 5},
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

}

const extraRewardProbMax = 600

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
  rand = (Math.round(Math.random()*1000)%states.length)
  return states[rand]
}


///// Document Ready
$(function(){
  $("#tableContainer").hide()
  // $('#mainTable').DataTable();
})


const states =  
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