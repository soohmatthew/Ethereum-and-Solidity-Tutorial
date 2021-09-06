const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3"); // constructor function, which should be capitalised. Each instance will be connected to one Ethereum network
const web3 = new Web3(ganache.provider());

const {interface, bytecode} = require('../compile');

let lottery;
let accounts;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();

    lottery = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({data : bytecode})
        .send({from: accounts[0], gas: '1000000'});
});

describe("Lottery Contract", () => {
    it("Deploys contract", () => {
        assert.ok(lottery.options.address);
    });

    it("Allows one account to enter", async() => {
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('0.02', 'ether')
        });

        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });

        assert.equal(accounts[0], players[0]);
        assert.equal(1, players.length);
    });

    it("Allows multiple accounts to enter", async() => {
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('0.02', 'ether')
        });

        await lottery.methods.enter().send({
            from: accounts[1],
            value: web3.utils.toWei('0.02', 'ether')
        });

        await lottery.methods.enter().send({
            from: accounts[2],
            value: web3.utils.toWei('0.02', 'ether')
        });

        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });

        assert.equal(accounts[0], players[0]);
        assert.equal(accounts[1], players[1]);
        assert.equal(accounts[2], players[2]);
        assert.equal(3, players.length);
    });

    it("Requires a minimum amount of ether to enter", async() => {
        try {
            await lottery.methods.enter().send({
            from: accounts[0],
            value: 0});

            assert(false); // The try statement is supposed to fail,
                           // but in the event that it passes, then we want to catch that error as well.
            }
        
        catch(err) {
            assert(err)
        };
        
    });

    it("Only manager can pick winner", async() => {
        try {
            await lottery.methods.pickWinner().send({
            from: accounts[1]
        });

            assert(false); // The try statement is supposed to fail,
                           // but in the event that it passes, then we want to catch that error as well.
            }
        
        catch(err) {
            assert(err)
        };
        
    });

    it("Sends money to winner and resets test", async() => {
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei("2", "ether")
        });
        
        const initialBalance = await web3.eth.getBalance(accounts[0]);

        await lottery.methods.pickWinner().send({from: accounts[0]});

        const finalBalance = await web3.eth.getBalance(accounts[0]);
        // Difference after winning lottery should be about 2 eth, but not exactly 2 eth, due to gas cost
        const difference = finalBalance - initialBalance;
        assert(difference > web3.utils.toWei("1.8", "ether")); 

        // Confirms that the account balance is zero
        const lotteryBalance = await web3.eth.getBalance(lottery.options.address);
        assert.equal(lotteryBalance, 0);

        const no_of_players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });
        assert.equal(no_of_players, 0);
    });
});