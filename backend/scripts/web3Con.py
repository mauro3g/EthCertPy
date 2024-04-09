from web3 import Web3
import json

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
    with open('./build/deployed.json', 'r') as f:
        contract_data = json.load(f)
        
    # Initialize the address calling the functions/signing transactions
    # caller = "0x8d41C478c9b7D3983153A394Bd3b4963DeeB2be5"
    # private_key = "PRIVATE_KEY"  # To sign the transaction

    # Initialize address nonce
    # nonce = w3.eth.get_transaction_count(caller)

    # Extract ABI and address for the 'Certificate' contract
    cartificate_contract_data = contract_data['Certificate']
    abi = cartificate_contract_data['abi']
    address = cartificate_contract_data['address']

    # Now you can use abi and address as objects
    #print("ABI:", abi)
    print("Address:", address)
    cartificate_contract = w3.eth.contract(address=address, abi=abi)
    
    print("Contract:", cartificate_contract)
    
    return cartificate_contract

    # addCert = cartificate_contract.functions.addCertificate(
    #     123,
    #     456,
    #     "cert1.com",
    #     "ASDAS123",
    #     [2,"jaime","lopez","1756984569"],
    #     ["java junior","curso de java","espe","6 meses","2024"]
    # ).transact({"from": caller})

    # certlist = cartificate_contract.functions.getAllCertificates().call()
    # print("-----Certificates List-----")
    # print(certlist)


