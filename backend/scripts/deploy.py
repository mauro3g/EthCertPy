from brownie import Certificate, accounts
import json

def main():
    admin = accounts[0]
    
    certificates = Certificate.deploy({
        "from": admin
    })
    
    
    data = {
        "Certificate": {
            "abi": certificates.abi,
            "address": certificates.address
        }
    }
    
    # Writing JSON data to a file
    with open('./build/deployed.json', 'w') as f:
        json.dump(data, f, ensure_ascii=False, indent=4)
    