// To use web3 to access the Rinkeby Network,
// 1. web3 <- Provider (with account mnemonic)
// 2. Provider <- Infura API
// 3. Infura API <- Infura node
// 4. Infura node <- Rinkeby Network

const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const {interface, bytecode} = require('./compile')

const provider = new HDWalletProvider(
    'shoulder guard hint design number ceiling item robot monkey mean sick frequent',
    'https://rinkeby.infura.io/v3/2c618203e6f3440e9409be275c0041c4'
);

const web3 = new Web3(provider);

const deploy = async() => {
    const accounts = await web3.eth.getAccounts();

    console.log('Attempting to deploy from account', accounts[0])

    const result = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({ data: bytecode, arguments : ['Hello']})
        .send({ gas: '1000000', gasPrice: '5000000000', from: accounts[0]})

    console.log('Contract deployed to ', result.options.address)
};

deploy();