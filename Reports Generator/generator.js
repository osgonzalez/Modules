const chaosTotalIncrement = 2000; //average of 100 per mision
const chaosPercentIncrement = 0.05;
var finalChaos = 0;

const maxDificulty = 50;

var riskIndex = 1.2
var errorMargin = 0.2

var quests = [];
var agents = [
  {
    "name":"a",
    "puntuation": 15,
    "extra": 1
  },
  {
    "name":"b",
    "puntuation": 12,
    "extra": 2
  },
  {
    "name":"c",
    "puntuation": 50,
    "extra": 3
  },
  {
    "name":"d",
    "puntuation": 20,
    "extra": 4
  },
  {
    "name":"e",
    "puntuation": 6,
    "extra": 5
  }
];

var logs = []

// ***************************
// Quests functions
// ***************************

function generateQuests(){
  var chaosIncrement = Math.round($("#chaosInput").val()/800)
  var genRate = Math.sqrt(parseInt($("#dice").val()) * 1.2 + parseInt(chaosIncrement))
  var generateNumber = Math.ceil(genRate)
  
  for (var i = 0; i < generateNumber; i++){
    quests.push(generateStandarQuest())
  }
  
 
}

function generateStandarQuest(){
  var dificulty = Math.round(5 + (Math.random()*100)%maxDificulty)
  var reward = generateReward()
  // var extraReward  =  generateExtraReward();
  var chaosMultiplier = parseInt(rewardProb[reward]["chaosIndex"]) +  (0.05 * dificulty)  //Max 3 + 1.5
  var chaos = 20 + Math.round(((Math.random()*80) *  chaosMultiplier)/5)*5 

  var chaosPerDiff = chaos / dificulty;
  var rewardPerDiff = reward / dificulty;
  var chaosRewardIndex = (rewardPerDiff/10) + chaosPerDiff;

  return {
    "dificulty": dificulty,
    "chaos": chaos,
    "reward": reward,
    "rewardPerDiff": rewardPerDiff,
    "chaosPerDiff": chaosPerDiff,
    "chaosRewardIndex": chaosRewardIndex
  }
}

function asingAgentToQuest(){

  var orderType = $('input[name="preferemces"]:checked').val();

  if(orderType== "Chaos"){
    quests.sort(compareChaos)
  }
  if(orderType== "Reward"){
    quests.sort(compareReward)
  }
  if(orderType== "Hybrid"){
    quests.sort(compareChaosAndReward)
  }

  quests.reverse()

  //Clone array
  var tempAgents = JSON.parse(JSON.stringify(agents))


  tempAgents.sort(compareAgents)
  tempAgents.reverse()


  for(var quest in quests){

    if(tempAgents.length == 0){
      break;
    }

    var index = selectAgentForDiff(tempAgents, quests[quest].dificulty)
    if(index != null){
      var tempAgent = tempAgents[index];
      tempAgents.splice(index, 1);

      executeQuest(tempAgent,quests[quest])
    }
  }
}


function executeQuest(agent,quest){

  var result = {}

  result["code"] = "#" + randomString(8);
  result["dificulty"] = quest.dificulty;
  result["chaos"] = quest.chaos;
  result["reward"] = quest.reward;

  var puntuation = randomDice(agent.puntuation) + agent.extra;

  result["sucess"] = puntuation >= quest.dificulty
  
  result["diceResult"] = puntuation
  result["agentName"]= agent.name
  result["agentPuntuation"]=  Math.floor(agent.puntuation/12) + "D12 + 1D" + agent.puntuation%12 + " + " + agent.extra
  
  logs.push(result)

}


function selectAgentForDiff(agentList,dificulty){
  
  dificulty = dificulty * riskIndex;
  var bestAgent= 0
  var bestError = null

  for(agent in agentList){
    var newError = (agentList[agent].puntuation/2 + agentList[agent].extra) - dificulty
    
    if(newError < 0 ){
      newError = newError * -2
    }

    if(bestError == null || newError < bestError ){
      bestAgent = agent
      bestError = newError;
    }
  }


  if( bestError > dificulty * errorMargin){
    bestAgent = null;
  }

  return bestAgent;
}


// ***************************
// Probability jsons and functions
// ***************************



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
  "18000": {"prob": 3, "chaosIndex":0.3},
  "20000": {"prob": 1, "chaosIndex":0.25},
  "25000": {"prob": 1, "chaosIndex":0.25},
}

const rewardProbMax = 175

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

function countProbMax(jSon){
  var toRet=0;

  for(line in jSon){
    toRet+= parseInt(jSon[line]["prob"])
  }
  
  return toRet;
}






// ***************************
// Compare Funtions
// ***************************

function compareReward(a,b){
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


function compareChaos(a,b){
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


function compareChaosAndReward(a,b){
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

function compareAgents(a,b){
  var averageA = a.puntuation/2 + a.extra;
  var averageB = b.puntuation/2 + b.extra;
  //a es menor que b según criterio de ordenamiento
  if (averageA < averageB) {
    return -1;
  }
  //a es mayor que b según criterio de ordenamiento
  if (averageA > averageB) {
    return 1;
  }
  // a debe ser igual b
  return 0;
}

// ***************************
// Usefuls
// ***************************

function randomString(length) {
  return  Math.round((Math.pow(36, length + 1) - Math.random() * Math.pow(36, length))).toString(36).slice(1).toUpperCase();
}


function randomDice(value){
  var toRet = 0;
  for(var i=0; i < Math.floor(value/12); i++){
    toRet += Math.floor(Math.random()*10 + 1)
  }

  if(value%12 != 0){
    toRet += Math.floor(Math.random()*(value%12) + 1)
  }

  return toRet
}

var logIndex=0
function printResults(){
  logIndex = 0;
  var timeOut = 500; 
  for(log in logs){
    setTimeout(function(){
      $("#logs").append(
        "<div class='terminal'>"+
        logs[logIndex].code + ": Caos: "+
        logs[logIndex].chaos + " Recompensa: "+
        logs[logIndex].reward + "$ Equipo Asignado: "+
        logs[logIndex].agentName+
        "</div>"
      )
      setTimeout(function(){
        if(logs[logIndex].sucess){
          $("#logs").append("<div class='result'>Result: <strong class='blueFont'>Success</strong></div><br>")
        }else{
          $("#logs").append("<div class='result'>Result: <strong class='redFont'>Failiure</strong></div><br>")
        }

        logIndex++;
      },2500)
      
      
    },timeOut)
    
    timeOut += 4000;

  }
  

}




// ***************************
// Document Ready
// ***************************

$(function(){
  //$("#tableContainer").hide()
  // $('#mainTable').DataTable();

  $("#riskIndex").change(function(){
    riskIndex = Math.round(parseFloat($(this).val())*100)/100
    $('#riskValue').text(Math.round((riskIndex)*100))

  })


  $("#generate").click(function(){
    logs= []
    generateQuests()
    asingAgentToQuest()
    printResults()
  })
})


