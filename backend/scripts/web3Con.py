from web3 import Web3
import json

# Initialize the address calling the functions/signing transactions
caller = "0x65540a0894C8497db55FA75BB06Ac44badb3fe46"
# private_key = "PRIVATE_KEY"  # To sign the transaction

# Initialize address nonce
# nonce = w3.eth.get_transaction_count(caller)

def getCertificateContract():

    w3 = Web3(Web3.HTTPProvider('http://127.0.0.1:8545'))
    # chain_id = 1337

    if w3.is_connected():
        print("-" * 50)
        print("Connection Successful")
        print("-" * 50)
    else:
        print("Connection Failed")

    # Reading JSON data from a file
    with open('./backend/build/deployed.json', 'r') as f:
        contract_data = json.load(f)

    # Extract ABI and address for the 'Certificate' contract
    certificate_contract_data = contract_data['Certificate']
    abi = certificate_contract_data['abi']
    address = certificate_contract_data['address']

    # Now you can use abi and address as objects
    #print("ABI:", abi)
    print("Address:", address)
    certificate_contract = w3.eth.contract(address=address, abi=abi)
    
    print("Contract:", certificate_contract)
    
    return certificate_contract


