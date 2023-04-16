import json
import glob
import requests

i = 0

FIWARE_URL = 'http://127.0.0.1:1026/v2/op/update';
print("Execution du script d'import des items dans FIWARE...")

# Forbidden characters (Les caractères interdits sont remplacés par des caractères autorisés)
# < replace by [
# > replace by ]
# " replace by :
# ' replace by space
# = replace by :
# ; replace by .
# ( replace by [
# ) replace by ]

# All the items are in the same file so we don't need to loop through all the files
# For each item, we create a new entity in FIWARE
json_emplacement = './item.json'
# "data":{"1001":{"name":"Bottes de vitesse","description":"<groupLimit>Limité à 1 paire de bottes.</groupLimit><br><br><unique>Propriété passive UNIQUE - Déplacements améliorés :</unique> +25 vitesse de déplacement","colloq":";Boots of Speed;bottes de vitesse","plaintext":"Augmente légèrement la vitesse de déplacement.","gold":{"base":300,"purchasable":true,"total":300,"sell":210},"tags":["Boots"],"stats":{"FlatMovementSpeedMod":25}}

with open(json_emplacement) as json_file:
    data = json.load(json_file)
    for item in data["data"]:
        doc = {
            "actionType": "APPEND",
            "entities": []
        }

        print("Import de l'item " + item + "...")
        # print(data["data"])
        
        

        # We create a new entity for each item
        doc["entities"].append({
            "type": "Item",
            "id": item,
            "name": {
                "type": "string",
                "value": data["data"][item]["name"].replace("<", "[").replace(">", "]").replace('"', ":").replace("=", ":").replace(";", ".").replace("(", "[").replace(")", "]").replace("'", " ")
            },
            "description": {
                "type": "string",
                "value": data["data"][item]["description"].replace("<", "[").replace(">", "]").replace('"', ":").replace("=", ":").replace(";", ".").replace("(", "[").replace(")", "]").replace("'", " ")
            },
            "colloq": {
                "type": "string",
                "value": data["data"][item]["colloq"].replace("<", "[").replace(">", "]").replace('"', ":").replace("=", ":").replace(";", ".").replace("(", "[").replace(")", "]").replace("'", " ")
            },
            "plaintext": {
                "type": "string",
                "value": data["data"][item]["plaintext"].replace("<", "[").replace(">", "]").replace('"', ":").replace("=", ":").replace(";", ".").replace("(", "[").replace(")", "]").replace("'", " ")
            },
            "gold": {
                "type": "Object",
                "value": data["data"][item]["gold"]
            },
            "base" : {
                "type": "Number",
                "value": data["data"][item]["gold"]["base"]
            },
            "sell" : {
                "type": "Number",
                "value": data["data"][item]["gold"]["sell"]
            },
            "tags": {
                "type": "[string]",
                "value": data["data"][item]["tags"]
            },
            "stats": {
                "type": "string",
                "value": data["data"][item]["stats"]
            }
        })
        # print(doc)
        # We send the request to FIWARE

        headers = {'Content-Type': 'application/json'}
        r = requests.post(FIWARE_URL, data=json.dumps(doc), headers=headers)
        # print(r.text)
        # print(r.status_code)
        # print(r)
        
        if r.status_code == 400:
            print("Erreur lors de l'import de l'item " + item)
            print(r.text)
            print(doc)
        
