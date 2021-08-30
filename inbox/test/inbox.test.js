// Ganache/TestRPC

const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3"); // constructor function, which should be capitalised. Each instance will be connected to one Ethereum network

// Web3 -> Provider -> Ganache 

const web3 = new Web3(ganache.provider());

// Mocha: Test running framework
// Function 1: it; Run a test and make an assert
// Function 2: describe; Groups together 'it' functions
// Function 3: beforeEach; Execute some general setup code.

// Testing framework
// 1. Mocha starts
// 2. Deploy a new contract
// 3. Manipulate the contract
// 4. Make an assertion about the contract

// Ganache creates a local test network with "unlocked" accounts (no need for private keys)
// Web3 can:
//    1) interact with deployed contract, which requires ABI and Address of deployed contract
//    2) Create a contract, which requires ABI and bytecode
const { interface, bytecode} = require('../compile')

let accounts;
let inbox;
const INITIAL_STRING = "Hi there!"

beforeEach(async () => {
    // Get a list of all accounts -- Will return a promise (Asynchronous)
    accounts = await web3.eth.getAccounts();

    // Use one of those accounts to deploy the contract

    inbox = await new web3.eth.Contract(JSON.parse(interface)) // Defines what methods an inbox contract has
    // Interface will be a JSON object, but the "JSON.parse" will convert it into a Javascript object
        .deploy({
            data: bytecode, 
            arguments: [INITIAL_STRING]}) // Tells web3 that we want to deploy a new copy of this contract
        .send({ 
            from: accounts[0], 
            gas:'1000000'}) // Instructs web3 to send out a transaction that creates this contract

});

describe('Inbox', () => {
    it('deploys a contract', () => {
        assert.ok(inbox.options.address); //Checks that address exists        
    });
    it('has a default message', async () => {

        const message = await inbox.methods.message().call(); 
        // contract -> 
        // methods -> 
        // specific method (message), can pass in specific args -> 
        // .call()
        assert.equal(message, INITIAL_STRING);
    });

    it('can change the message', async () => {
        await inbox.methods.setMessage("Hello").send({ from:accounts[0] }); 
        // In a send function, we must set who sends the transaction

        const message = await inbox.methods.message().call();
        assert.equal(message,'Hello')
    });
});