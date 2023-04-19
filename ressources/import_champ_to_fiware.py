import json
import glob
import requests
 
i = 0

FIWARE_URL = 'http://172.24.183.37:1026/v2/op/update';
print("Execution du script d'import des champions dans FIWARE...")

json_emplacement = './champs/'

# Forbidden characters (Les caractères interdits sont remplacés par des caractères autorisés)
# < replace by [
# > replace by ]
# " replace by :
# ' replace by space
# = replace by :
# ; replace by .
# ( replace by [
# ) replace by ]



for filename in glob.glob(json_emplacement + '*.json'):
    champ_name = filename.replace(".json", "").replace(json_emplacement, "")
    print("Import du champion " + champ_name + "...")
    i = 0
    # with open(filename.replace(" ", "")) as json_file:
    
    json_data = open(filename).read().replace("'", "")
    # print(json_data)
    doc = {
            "actionType": "APPEND",
            "entities": []
    }
    data = json.loads(json_data)
    
    parsed_json = json.loads(json_data)
    name = parsed_json['data'][champ_name]['name']
    idName = parsed_json['data'][champ_name]['id']
    
    id = parsed_json['data'][idName.replace(" ", "")]['key']
    title = parsed_json['data'][idName.replace(" ", "")]['title']
    lore = parsed_json['data'][idName.replace(" ", "")]['lore']
    allytips = parsed_json['data'][idName.replace(" ", "")]['allytips']
    enemytips = parsed_json['data'][idName.replace(" ", "")]['enemytips']
    tags    = parsed_json['data'][idName.replace(" ", "")]['tags']
    # Info stats of the play style of the champion
    info = parsed_json['data'][idName.replace(" ", "")]['info']
    attack = parsed_json['data'][idName.replace(" ", "")]['info']['attack']
    defense = parsed_json['data'][idName.replace(" ", "")]['info']['defense']
    magic = parsed_json['data'][idName.replace(" ", "")]['info']['magic']
    difficulty = parsed_json['data'][idName.replace(" ", "")]['info']['difficulty']
    
    # Stats of the champion in game
    stats = parsed_json['data'][idName.replace(" ", "")]['stats']
    hp = parsed_json['data'][idName.replace(" ", "")]['stats']['hp']
    hpPerLevel = parsed_json['data'][idName.replace(" ", "")]['stats']['hpperlevel']
    mp = parsed_json['data'][idName.replace(" ", "")]['stats']['mp']
    mpPerLevel = parsed_json['data'][idName.replace(" ", "")]['stats']['mpperlevel']
    moveSpeed = parsed_json['data'][idName.replace(" ", "")]['stats']['movespeed']
    armor = parsed_json['data'][idName.replace(" ", "")]['stats']['armor']
    armorPerLevel = parsed_json['data'][idName.replace(" ", "")]['stats']['armorperlevel']
    spellBlock = parsed_json['data'][idName.replace(" ", "")]['stats']['spellblock']
    spellBlockPerLevel = parsed_json['data'][idName.replace(" ", "")]['stats']['spellblockperlevel']
    attackRange = parsed_json['data'][idName.replace(" ", "")]['stats']['attackrange']
    hpRegen = parsed_json['data'][idName.replace(" ", "")]['stats']['hpregen']
    hpRegenPerLevel = parsed_json['data'][idName.replace(" ", "")]['stats']['hpregenperlevel']
    mpRegen = parsed_json['data'][idName.replace(" ", "")]['stats']['mpregen']
    mpRegenPerLevel = parsed_json['data'][idName.replace(" ", "")]['stats']['mpregenperlevel']
    crit = parsed_json['data'][idName.replace(" ", "")]['stats']['crit']
    critPerLevel = parsed_json['data'][idName.replace(" ", "")]['stats']['critperlevel']
    attackDamage = parsed_json['data'][idName.replace(" ", "")]['stats']['attackdamage']
    attackDamagePerLevel = parsed_json['data'][idName.replace(" ", "")]['stats']['attackdamageperlevel']
    attackSpeedPerLevel = parsed_json['data'][idName.replace(" ", "")]['stats']['attackspeedperlevel']
    attackSpeed = parsed_json['data'][idName.replace(" ", "")]['stats']['attackspeed']
    
    
    name = name.replace("<", "[").replace(">", "]").replace('"', ":").replace("=", ":").replace(";", ".").replace("(", "[").replace(")", "]")
    title = title.replace("<", "[").replace(">", "]").replace('"', ":").replace("=", ":").replace(";", ".").replace("(", "[").replace(")", "]")
    lore = lore.replace("<", "[").replace(">", "]").replace('"', ":").replace("=", ":").replace(";", ".").replace("(", "[").replace(")", "]")
    
    allytip_clean = []
    enemytip_clean = []
    tags_clean = []
    
    for allytip in allytips:
        allytip = allytip.replace("<", "[").replace(">", "]").replace('"', ":").replace("=", ":").replace(";", ".").replace("(", "[").replace(")", "]") 
        allytip_clean.append(allytip)
        
    for enemytip in enemytips:
        enemytip = enemytip.replace("<", "[").replace(">", "]").replace('"', ":").replace("=", ":").replace(";", ".").replace("(", "[").replace(")", "]")
        enemytip_clean.append(enemytip)
        
    for tag in tags:
        tag = tag.replace("<", "[").replace(">", "]").replace('"', ":").replace("=", ":").replace(";", ".").replace("(", "[").replace(")", "]")
        tags_clean.append(tag)
    
    
    
    # print(allytip_clean)
    # print(enemytip_clean)
    # print(tags_clean) 
   

    entity = {
        
        "id": id,
        "type": "Champion",
        
        "name": {
            "type": "String",
            "value": name
        },
        
        "title": {
            "type": "String",
            "value": title
        },
        
        "lore": {
            "type": "String",
            "value": lore
        },
        
        "allytips": {
            "type": "[String]",
            "value": allytip_clean
        },
        
        "enemytips": {
            "type": "[String]",
            "value": enemytip_clean
        },
        
        "info": {
            "type": "Object",
            "value": info
        },           
        
        "tags": {
            "type": "[String]",
            "value": tags_clean
        },
        
        "attack": {
            "type": "Number",
            "value": attack
        },
        
        "defense": {
            "type": "Number",
            "value": defense
        },
        
        "magic": {
            "type": "Number",
            "value": magic
        },
        
        "difficulty": {
            "type": "Number",
            "value": difficulty
        },
        
        "stats": {
            "type": "Object",
            "value": stats
        },
        
        "hp": {
            "type": "Number",
            "value": hp
        },
        
        "hpPerLevel": {
            "type": "Number",
            "value": hpPerLevel
        },
        
        "mp": {
            "type": "Number",
            "value": mp
        },
        
        "mpPerLevel": {
            "type": "Number",
            "value": mpPerLevel
        },
        
        "moveSpeed": {
            "type": "Number",
            "value": moveSpeed
        },
        
        "armor": {
            "type": "Number",
            "value": armor
        },
        
        "armorPerLevel": {
            "type": "Number",
            "value": armorPerLevel
        },
        
        "spellBlock": {
            "type": "Number",
            "value": spellBlock
        },
        
        "spellBlockPerLevel": {
            "type": "Number",
            "value": spellBlockPerLevel
        },
        
        "attackRange": {
            "type": "Number",
            "value": attackRange
        },
        
        "hpRegen": {
            "type": "Number",
            "value": hpRegen
        },
        
        "hpRegenPerLevel": {
            "type": "Number",
            "value": hpRegenPerLevel
        },
        
        "mpRegen": {
            "type": "Number",
            "value": mpRegen
        },
        
        "mpRegenPerLevel": {
            "type": "Number",
            "value": mpRegenPerLevel
        },
        
        "crit": {
            "type": "Number",
            "value": crit
        },
        
        "critPerLevel": {
            "type": "Number",
            "value": critPerLevel
        },
        
        "attackDamage": {
            "type": "Number",
            "value": attackDamage
        },
        
        "attackDamagePerLevel": {
            "type": "Number",
            "value": attackDamagePerLevel
        },
        
        "attackSpeedPerLevel": {
            "type": "Number",
            "value": attackSpeedPerLevel
        },
        
        "attackSpeed": {
            "type": "Number",
            "value": attackSpeed
        }
    }
    
    doc['entities'].append(entity)
    print(doc)
    print('Sending request' + str(i))
    r = requests.post(FIWARE_URL, data=json.dumps(doc), headers={'Content-Type': 'application/json'})
    print(r)
    print(r.text)
