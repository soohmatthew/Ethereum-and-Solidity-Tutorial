import web3 from "./web3";
import CampaignFactory from "./build/CampaignFactory.json";

// This file helps to create an instance of the deployed CampaignFactory contract
// "instance" can then be imported directly, instead of creating a new instance each time.
const instance = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  "0xAdf0c6090a0d4a8507d00d0f0dc4dafc2bF1c5E8"
);

export default instance;
