import Web3 from "web3";
 // Replace the metamask web3 provider (depracated) with our own Apps web3 provider
window.ethereum.request({ method: "eth_requestAccounts" });

const web3 = new Web3(window.ethereum);
 
export default web3;