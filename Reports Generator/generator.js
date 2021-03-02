const chaosTotalIncrement = 2000; //average of 100 per mision
const chaosPercentIncrement = 0.05;
var finalChaos = 0;

const maxDificulty = 120; //The final dificulty is maxDificulty +20

var minSuccesRisk = 1.2
var errorMargin = 0.2

var quests = [];
var agents = [];

var logs = []


// ***************************
// Quests functions
// ***************************

function generateAllQuests() {
  quests = []
  var chaosIncrement = Math.round($("#chaosInput").val() / 800)
  var genRate = Math.sqrt(parseInt($("#dice").val()) * 1.2 + parseInt(chaosIncrement))
  var generateNumber = Math.ceil(genRate)

  for (var i = 0; i < generateNumber; i++) {
    quests.push(generateStandarQuest())
  }

}

function generateStandarQuest() {
  var dificulty = Math.round(20 + (Math.random() * maxDificulty))
  var reward = generateReward()
  // var extraReward  =  generateExtraReward();
  var chaosMultiplier = parseInt(rewardProb[reward]["chaosIndex"]) + (0.05 * dificulty)  //Max 3 + 1.5
  var chaos = 20 + Math.ceil(((Math.random() * 80) * chaosMultiplier) / 5) * 5


  var chaosPerDiff = chaos / dificulty;
  var rewardPerDiff = reward / dificulty;
  var chaosRewardIndex = (rewardPerDiff / 10) + chaosPerDiff;

  return {
    "dificulty": dificulty,
    "chaos": chaos,
    "reward": reward,
    "rewardPerDiff": rewardPerDiff,
    "chaosPerDiff": chaosPerDiff,
    "chaosRewardIndex": chaosRewardIndex
  }
}

function asingAgentToQuest() {

  var orderType = $('input[name="preferemces"]:checked').val();

  if (orderType == "Chaos") {
    quests.sort(compareChaos)
  }
  if (orderType == "Reward") {
    quests.sort(compareReward)
  }
  if (orderType == "Hybrid") {
    quests.sort(compareChaosAndReward)
  }

  quests.reverse()

  //Clone array
  var tempAgents = JSON.parse(JSON.stringify(agents))


  tempAgents.sort(compareAgents)
  tempAgents.reverse()

  var undoQuest = []

  for (var quest in quests) {

    if (tempAgents.length == 0) {
      break;
    }

    var index = selectBestAgentForDificulty(tempAgents, quests[quest].dificulty)
    if (index != null) {
      var tempAgent = tempAgents[index];
      tempAgents.splice(index, 1);

      executeQuest(tempAgent, quests[quest])
    }else{
      undoQuest.push(quests[quest])
    }
  }

  if (tempAgents.length > 1 && undoQuest.length > 0) {
    
    //Generate pairs
    if(tempAgents.length%2!=0){
      var tempAgent = tempAgents[tempAgents.length-1];
      tempAgents.splice(tempAgents.length-1, 1);
      tempAgents[tempAgents.length-1].puntuation += tempAgent.puntuation
      tempAgents[tempAgents.length-1].name += " y " + tempAgent.name
    }
  

    var pairAgents = []

    for(var i =0; i<tempAgents.length; i+=2){
      pairAgents.push({
        "name": tempAgents[i].name + " y " + tempAgents[i+1].name,
        "puntuation": parseInt(tempAgents[i].puntuation) + parseInt(tempAgents[i+1].puntuation)
      })
    }


    //Solve pair quests

    if (orderType == "Chaos") {
      undoQuest.sort(compareChaos)
    }
    if (orderType == "Reward") {
      undoQuest.sort(compareReward)
    }
    if (orderType == "Hybrid") {
      undoQuest.sort(compareChaosAndReward)
    }
  
    undoQuest.reverse()

    for (var quest in undoQuest) {

      if (pairAgents.length == 0) {
        break;
      }
  
      var index = selectBestAgentForDificulty(pairAgents, undoQuest[quest].dificulty)
      if (index != null) {
        var tempAgent = pairAgents[index];
        pairAgents.splice(index, 1);
  
        executeQuest(tempAgent, undoQuest[quest])
      }
    }
  

  }

}


function executeQuest(agent, quest) {

  var result = {}

  result["code"] = "#" + randomString(8);


  var cardTypes = Object.keys(cardsEfects)
  var realRandom = Math.floor((Math.random() * 10 * quest.dificulty * agent.puntuation) % cardTypes.length)
  var cardType = cardTypes[realRandom]
  
  var cardColors = Object.keys(cardsEfects[cardType])
  var realRandom = Math.floor((Math.random() * 10 + quest.dificulty + agent.puntuation) % cardColors.length)
  var cardColor = cardColors[realRandom]

  result["cardType"] =  cardType;
  result["cardColor"] = cardColor

  console.log(cardType + " -> "+ cardColor)
  var cardsEfect = cardsEfects[cardType][cardColor]
  

  result["dificulty"] = quest.dificulty;
  result["chaos"] = quest.chaos;
  result["reward"] = quest.reward;

  var prob = getSuccesProb(agent, quest.dificulty)
  result["prob"] = Math.floor(prob * 100) + "%"
  console.log(Math.floor(prob * 100) + "%")


  //Execute Card
  result["final-dificulty"] = Math.ceil(quest.dificulty * cardsEfect["dificulty-multiplier"] + cardsEfect["dificulty-increment"])
  result["final-chaos"] = Math.ceil(quest.chaos * cardsEfect["chaos-multiplier"] + cardsEfect["chaos-increment"])
  result["final-reward"] = Math.ceil(quest.reward * cardsEfect["reward-multiplier"] + cardsEfect["reward-increment"])
  prob = getSuccesProb(agent, result["final-dificulty"])
  result["final-prob"] = Math.floor(prob * 100) + "%"

  result["sucess"] = randomProbResult(prob);



  result["agentName"] = agent.name

  logs.push(result)

}


function getSuccesProb(agent, dificulty) {
  var maxDificulty = dificulty * 1.5
  var minDificulty = dificulty * 0.5

  if (minDificulty >= agent.puntuation) {
    return 0
  }

  var aux = (agent.puntuation - minDificulty) / (maxDificulty - minDificulty)
  return aux
}

function selectBestAgentForDificulty(agentList, dificulty) {


  var bestAgent = null
  var bestProb = null

  for (agent in agentList) {
    var newProb = getSuccesProb(agentList[agent], dificulty)

    if (newProb > 100) {
      if (bestProb == null || bestProb < 100 || newProb < bestProb) {
        bestAgent = agent
        bestProb = newProb;
      }
    } else {
      if (bestProb == null || newProb > bestProb) {
        bestAgent = agent
        bestProb = newProb;
      }
    }
  }

  if (bestProb == null || bestProb < minSuccesRisk) {
    return null;
  } else {
    return bestAgent;
  }

}


// ***************************
// Probability jsons and functions
// ***************************


const cardIcons = {
  'death': 'fas fa-skull-crossbones',
  'money': 'fas fa-dollar-sign',
  'comments': 'fas fa-comments-dollar',
  'law': 'fas fa-gavel',
  'nada': 'fas fa-yin-yang'
}





const cardsEfects = {
  'death': {
    "red":{
      "reward-increment": 0,"reward-multiplier": 1, 
      "chaos-increment": 0, "chaos-multiplier": 1,
      "dificulty-increment": 0, "dificulty-multiplier": 1.80,
      "description" : ""
    },
    "gray":{
      "reward-increment": 0,"reward-multiplier": 1, 
      "chaos-increment": 0, "chaos-multiplier": 1,
      "dificulty-increment": 0, "dificulty-multiplier": 1.40,
      "description" : ""
    },
    "gold":{
      "reward-increment": 0,"reward-multiplier": 1, 
      "chaos-increment": 0, "chaos-multiplier": 1,
      "dificulty-increment": 0, "dificulty-multiplier": 1.20,
      "description" : ""
    }
  },
  'money': {
    "red":{
      "reward-increment": 0,"reward-multiplier": 0.5, 
      "chaos-increment": 0, "chaos-multiplier": 1,
      "dificulty-increment": 0, "dificulty-multiplier": 1,
      "description" : ""
    },
    "gray":{
      "reward-increment": 500,"reward-multiplier": 1, 
      "chaos-increment": 0, "chaos-multiplier": 1,
      "dificulty-increment": 0, "dificulty-multiplier": 1,
      "description" : ""
    },
    "gold":{
      "reward-increment": 0,"reward-multiplier": 2, 
      "chaos-increment": 0, "chaos-multiplier": 1,
      "dificulty-increment": 0, "dificulty-multiplier": 1,
      "description" : ""
    }
  },
  'comments': {
    "red":{
      "reward-increment": 0,"reward-multiplier": 0.75, 
      "chaos-increment": 0, "chaos-multiplier": 1,
      "dificulty-increment": 0, "dificulty-multiplier": 1.25,
      "description" : ""
    },
    "gray":{
      "reward-increment": 300,"reward-multiplier": 1, 
      "chaos-increment": 0, "chaos-multiplier": 1.20,
      "dificulty-increment": 10, "dificulty-multiplier": 1,
      "description" : ""
    },
    "gold":{
      "reward-increment": 1000,"reward-multiplier": 1, 
      "chaos-increment": 50, "chaos-multiplier": 1,
      "dificulty-increment": 0, "dificulty-multiplier": 0.75,
      "description" : ""
    }
  },
  'law': {
    "red":{
      "reward-increment": 0,"reward-multiplier": 0.75, 
      "chaos-increment": 0, "chaos-multiplier": 1,
      "dificulty-increment": 5, "dificulty-multiplier": 1,
      "description" : ""
    },
    "gray":{
      "reward-increment": 1000,"reward-multiplier": 1, 
      "chaos-increment": 0, "chaos-multiplier": 1,
      "dificulty-increment": 10, "dificulty-multiplier": 1,
      "description" : ""
    },
    "gold":{
      "reward-increment": 5000,"reward-multiplier": 1, 
      "chaos-increment": 150, "chaos-multiplier": 1,
      "dificulty-increment": 0, "dificulty-multiplier": 0.75,
      "description" : ""
    }
  },
  'nada': {
    "red":{
      "reward-increment": 0,"reward-multiplier": 1, 
      "chaos-increment": 0, "chaos-multiplier": 0.5,
      "dificulty-increment": 0, "dificulty-multiplier": 1,
      "description" : ""
    },
    "gray":{
      "reward-increment": 0,"reward-multiplier": 1, 
      "chaos-increment": 100, "chaos-multiplier": 1,
      "dificulty-increment": 20, "dificulty-multiplier": 1,
      "description" : ""
    },
    "gold":{
      "reward-increment": 0,"reward-multiplier": 1, 
      "chaos-increment": 0, "chaos-multiplier": 2,
      "dificulty-increment": 0, "dificulty-multiplier": 1,
      "description" : ""
    }
  }
}


const rewardProb = {
  "0": { "prob": 50, "chaosIndex": 3 },
  "250": { "prob": 20, "chaosIndex": 2 },
  "500": { "prob": 20, "chaosIndex": 2 },
  "1000": { "prob": 15, "chaosIndex": 1.5 },
  "2000": { "prob": 10, "chaosIndex": 1.5 },
  "3000": { "prob": 15, "chaosIndex": 1 },
  "4000": { "prob": 10, "chaosIndex": 1 },
  "5000": { "prob": 5, "chaosIndex": 0.75 },
  "6000": { "prob": 5, "chaosIndex": 0.75 },
  "8000": { "prob": 5, "chaosIndex": 0.75 },
  "10000": { "prob": 5, "chaosIndex": 0.5 },
  "12000": { "prob": 5, "chaosIndex": 0.5 },
  "15000": { "prob": 5, "chaosIndex": 0.5 },
  "18000": { "prob": 3, "chaosIndex": 0.3 },
  "20000": { "prob": 1, "chaosIndex": 0.25 },
  "25000": { "prob": 1, "chaosIndex": 0.25 },
}

const rewardProbMax = 175

function generateReward() {
  rand = (Math.round(Math.random() * 1000) % rewardProbMax)

  for (prob in rewardProb) {
    if (parseInt(rewardProb[prob]["prob"]) >= rand) {
      return prob
    } else {
      rand -= parseInt(rewardProb[prob]["prob"])
    }
  }

  return 0
}


function generateProbText(probText, probMax) {
  if (probMax == undefined) {
    probMax = countProbMax(probText)
  }
  rand = (Math.round(Math.random() * probMax * 10) % probMax)

  for (prob in probText) {
    if (parseInt(probText[prob]["prob"]) >= rand) {
      return prob
    } else {
      rand -= parseInt(probText[prob]["prob"])
    }
  }

  return 0
}

function countProbMax(jSon) {
  var toRet = 0;

  for (line in jSon) {
    toRet += parseInt(jSon[line]["prob"])
  }

  return toRet;
}






// ***************************
// Compare Funtions
// ***************************

function compareReward(a, b) {
  //a es menor que b según criterio de ordenamiento
  if (a.rewardPerDiff < b.rewardPerDiff) {
    return -1;
  }
  //a es mayor que b según criterio de ordenamiento
  if (a.rewardPerDiff > b.rewardPerDiff) {
    return 1;
  }
  // a debe ser igual b
  return 0;
}


function compareChaos(a, b) {
  //a es menor que b según criterio de ordenamiento
  if (a.chaosPerDiff < b.chaosPerDiff) {
    return -1;
  }
  //a es mayor que b según criterio de ordenamiento
  if (a.chaosPerDiff > b.chaosPerDiff) {
    return 1;
  }
  // a debe ser igual b
  return 0;
}


function compareChaosAndReward(a, b) {
  //a es menor que b según criterio de ordenamiento
  if (a.chaosRewardIndex < b.chaosRewardIndex) {
    return -1;
  }
  //a es mayor que b según criterio de ordenamiento
  if (a.chaosRewardIndex > b.chaosRewardIndex) {
    return 1;
  }
  // a debe ser igual b
  return 0;
}

function compareAgents(a, b) {
  //a es menor que b según criterio de ordenamiento
  if (a.puntuation < b.puntuation) {
    return -1;
  }
  //a es mayor que b según criterio de ordenamiento
  if (a.puntuation > b.puntuation) {
    return 1;
  }
  // a debe ser igual b
  return 0;
}

// ***************************
// Usefuls
// ***************************

function randomString(length) {
  return Math.round((Math.pow(36, length + 1) - Math.random() * Math.pow(36, length))).toString(36).slice(1).toUpperCase();
}


function randomProbResult(successProb) {

  return Math.random() <= successProb
}

var logIndex = 0
function printResults() {
  logIndex = 0;
  $("#logs").append("<div class='terminal'>Se han hallado <bold class='numberOfQuest'>" + quests.length + "</bold> posibles misiones</div><br>")
  var timeOut = 2000;
  for (log in logs) {
    setTimeout(function () {
      $("#logs").append(
        "<div class='terminal'>" +
        "<span style='color: #eaeb88;'>" + logs[logIndex].code + ":</span> "+
        "Caos: <div class='chaos'>" + logs[logIndex].chaos + '</div>' +
        " Recompensa: <div class='money'>" + logs[logIndex].reward + "$</div>"+
        " Probabilidad Exito: <div class='prob'>" + logs[logIndex].prob + '</div>' +
        " Equipo Asignado: <div class='agentName'>" + logs[logIndex].agentName + '</div>' +
        "</div>"
      )

      //Print Card
      setTimeout(function () {

        $("#logs").append('<div class="cardLog">Carta: '+
              '<i class="'+cardIcons[logs[logIndex].cardType]+' '+logs[logIndex].cardColor+'"></i> '+
              '('+
              '<div class="prob">'+ logs[logIndex]["final-prob"] +'</div> '+
              '<div class="chaos">'+ logs[logIndex]["final-chaos"]+'</div> '+
              '<div class="money">'+ logs[logIndex]["final-reward"]+'$ </div>)'+
              '</div>')
          

      }, 1500)



      //Print Result
      setTimeout(function () {
        if (logs[logIndex].sucess) {
          $("#logs").append("<div class='result'>Result: <strong class='blueFont'>Success</strong></div><br>")
        } else {
          $("#logs").append("<div class='result'>Result: <strong class='redFont'>Failiure</strong></div><br>")
        }

        logIndex++;
      }, 3000)


    }, timeOut)

    timeOut += 4000;

  }


  timeOut += 2000;


  //Calc Chaos and rewards
  var reward = 0
  var chaos = 0
  var sucessMisions = 0

  for (var log in logs) {

    if (logs[log].sucess) {
      reward += parseInt(logs[log].reward)
      chaos += parseInt(logs[log].chaos)
      sucessMisions++
    }

  }

  setTimeout(function () {
    $("#logs").append("<br><div class='terminal'>Misiones finalizadas con exito "+
    "<bold class='numberOfQuest'>"  + sucessMisions + "/" + logs.length+" </bold></div>")
  }, timeOut)

  timeOut += 2000;

  setTimeout(function () {
    $("#logs").append("<div class='terminal'>Reduccion del Indice de Caos General en <bold class='chaos'>"
      + chaos + "</bold> puntos</div>")
  }, timeOut)

  timeOut += 2000;

  setTimeout(function () {
    $("#logs").append("<div class='terminal'>Recomensas obtenidas <bold class='money'>"
      + reward + "$</bold></div><br>")
  }, timeOut)

  timeOut += 2000;



  setTimeout(function () {
    $("#generate").removeClass('disabled');
  }, timeOut + 1000)

}


function parseAgents() {
  var text = $("#agents").val()
  if (text != "") {
    agents = []

    try {
      var lines = String(text).split("\n")
      for (var line in lines) {
        var tokens = lines[line].split("\t")
        agents.push({
          "name": tokens[0],
          "puntuation": tokens[1]
        })
      }
    } catch (error) {
      alert("Parsing Exception")
    }
  }
}



// ***************************
// Document Ready
// ***************************



$(function () {
  $("#logs").hide();
  $("#back").hide();

  $("#back").click(function () {
    $("#logs").hide();
    $("#back").hide();
    $("#imputrContainer").show();
  })


  $("#riskIndex").on('input', function () {
    minSuccesRisk = Math.round(parseFloat($(this).val()) * 100) / 100
    $('#riskValue').text(Math.round((minSuccesRisk) * 100))

  })


  $("#generate").click(function () {
    $("#generate").addClass('disabled');
    $("#imputrContainer").hide();
    $("#logs").show();
    $("#back").show();


    logs = []


    parseAgents()
    generateAllQuests()
    asingAgentToQuest()
    printResults()


  })
})




//TOdo
// Biblioteca Protentage
// Paises Superficie / Bases
// Nivel Comunicaciones
// Nivel Transporte