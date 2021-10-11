import Web3 from "web3";

let web3; // "let" means that we can reassign this variable

// When we are using next.js, it is rendering server-side (i.e. renders on server rather than browser)
// Thus windows will return undefined
// We will  use the next server to contact the ethereum network,
// rather than asking the user-side browser to contact the ethereum network
if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
  // We are in the browser and metamask is running.
  window.ethereum.request({ method: "eth_requestAccounts" });
  web3 = new Web3(window.ethereum);
} else {
  // We are on the server *OR* the user is not running metamask
  const provider = new Web3.providers.HttpProvider(
    "https://rinkeby.infura.io/v3/15c1d32581894b88a92d8d9e519e476c"
  );
  web3 = new Web3(provider);
}

export default web3;
