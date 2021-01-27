import json
from Names.fantasy_name_generator import generateNames
import sys
from random import randrange
import math
import os 
dir_path = os.path.dirname(os.path.realpath(__file__))



# def generateNames(num):
# 	return ["tamesis","test","tamesis","test","tamesis","test","tamesis","test","tamesis","test",
#     "tamesis","test","tamesis","test","tamesis","test","tamesis","test","tamesis","test"]


numberOfElements = 20
if len(sys.argv) > 1:
    numberOfElements = int(sys.argv[1])

nameList = generateNames(numberOfElements)
elements = {}



minBaseSanity = 2
maxBaseSanity = 6

ranks = {
    "f": {"prob": 200, "params":4, "limit":2, "price": 1250, "variation": 0.25 },
    "e": {"prob": 150, "params":6, "limit":3, "price": 1900, "variation": 0.25 },
    "d": {"prob": 100, "params":8, "limit":4, "price": 2550, "variation": 0.25 },
    "c": {"prob": 75, "params":10, "limit":5, "price": 3200, "variation": 0.25 },
    "b": {"prob": 50, "params":12, "limit":6, "price": 3850, "variation": 0.25 },
    "a": {"prob": 30 , "params":15, "limit":7, "price": 4700, "variation": 0.30 },
    "s": {"prob": 20, "params":20, "limit":8, "price": 6300, "variation": 0.30 },
    "ss": {"prob": 10, "params":25, "limit":10, "price": 8000, "variation": 0.30 },
}

sanityProb ={
    "1": 61,
    "2": 79,
    "3": 96,
    "4": 107,
    "5": 111,
    "6": 107,
    "7": 96,
    "8": 79,
    "9": 61,
    "10": 23,
}

sanityTotalProb = 820

rankTotalProb = 0
for rank in ranks:
    rankTotalProb += int(ranks[rank]["prob"]) 

def generateRank():
    rand = randrange(0,rankTotalProb)

    for rank in ranks:
        if int(ranks[rank]["prob"]) >= rand:
            return rank
        else:
            rand -= int(ranks[rank]["prob"])
    
    return "f"


def generateSanity():
    rand = randrange(0,sanityTotalProb)

    for san in sanityProb:
        if int(sanityProb[san]) >= rand:
            return int(san)
        else:
            rand -= int(sanityProb[san])
    return 5



for i in range(0,numberOfElements):
    rank = generateRank()
    
    # Dollar
    variation = int(round(ranks[rank]["price"] * ranks[rank]["variation"]))
    dollar = randrange(ranks[rank]["price"] - variation, ranks[rank]["price"] + variation)
    dollar = int(math.floor((dollar/10)))*10
    
    # Long Money
    money = randrange(ranks[rank]["price"] - variation, ranks[rank]["price"] + variation)
    money = int(math.floor((money/10)))
    green = money%100
    blue = int(math.floor((money/100)))
    

    # Atributes
    atributes =  {
        "Administracion": 0,
        "Carisma": 0,
        "Atletismo": 0,
        "Investigación": 0,
        "Ingenieria": 0,
        "Combate": 0,
    }

    sanityParams = {
        "Felicidad": 0,
        "Lealtad": 0,
        "Esfuerzo": 0,
    }

    combatTypes = [
        "Arc. Evocador",
        "Arc. Alterador",
        "Arc. Ilusionista",
        "Dimensionalista",
        "Tecnicista",
        "Marcial Tao",
        "Firebender",
        "Waterbender",
        "Airbender",
        "Earthbender",
        "Lightningbender",
        "Clerigo Vida",
        "Clerigo Muerte",
        "Druida",
        "Demonologo",
        "Imbocador",
        "Paladin"
    ]


    for j in range(0,ranks[rank]["params"]):
        index = randrange(0,len(atributes))
        atribute = list(atributes.keys())[index]
        if ranks[rank]["limit"] > atributes[atribute]:
            atributes[atribute] = atributes[atribute] + 1

    sanity = {}
    for san in sanityParams:
        sanity[san] = generateSanity()
    
    bars = {}
    for atr in atributes:
        if atributes[atr] > 0:
            #Percent of the bar
            percent = 1
            if atributes[atr] <= 2:
                percent = (atributes[atr]/10)
            else:
                percent = (atributes[atr]/6)

            #Color of the bar
            if atr in sanity:
                bars[atr] = {
                    "startColor":   [0,0,255],
                    "fullColor":  [157,242,255],
                    "percent": percent
                }  
            else:
                bars[atr] = {
                    "startColor":  [255,0,0],
                    "fullColor":   [0,255,0],
                    "percent": percent
                }
 

    #Combat
    combat = "-"
    if atributes["Combate"] > 0:
        index = randrange(0,len(combatTypes))
        combat = combatTypes[index]

    # Json
    element = {
        "name": nameList[i],
        "rank": rank,
        "cost":{
          "dollar": dollar,
          "blue": blue,
          "green": green
        },
        "atributes": atributes,
        "sanity": sanity,
        "bars": bars,
        "combatType": combat
    }

    elements[i] = element



with open(dir_path + "\\" + 'data.json', 'w') as outfile:
    json.dump(elements, outfile)

