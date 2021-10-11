import web3 from "./web3";
import Campaign from "./build/Campaign.json";

// This file helps to create an instance of the deployed CampaignFactory contract
// "instance" can then be imported directly, instead of creating a new instance each time.
const instance = (address) => {
  return new web3.eth.Contract(JSON.parse(Campaign.interface), address);
};

export default instance;
