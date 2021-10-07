const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());

const compiledFactory = require("../ethereum/build/CampaignFactory.json");
const compiledCampaign = require("../ethereum/build/Campaign.json");

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  // This deploys a new version of a contract
  factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
    .deploy({ data: compiledFactory.bytecode })
    .send({ from: accounts[0], gas: "1000000" });

  await factory.methods
    .createCampaign("100")
    .send({ from: accounts[0], gas: "1000000" });

  // First way of writing
  const addresses = await factory.methods.getDeployedCampaigns().call();
  campaignAddress = addresses[0];

  // Second way of writing
  //[campaignAddress] = await factory.methods.getDeployedCampaigns().call();

  // This accesses a contract that has already been deployed.
  campaign = await new web3.eth.Contract(
    JSON.parse(compiledCampaign.interface),
    campaignAddress
  );
});

describe("Campaigns", () => {
  it("Deploys a factory and campaign", () => {
    assert.ok(factory.options.address); // Checks that an address exists
    assert.ok(campaign.options.address);
  });

  it("Marks caller as the campaign manager", async () => {
    const manager = await campaign.methods.manager().call();
    assert.equal(accounts[0], manager);
  });

  it("Successful contribution and mark them as approvers", async () => {
    await campaign.methods.contribute().send({
      from: accounts[1],
      value: "1000",
    });

    const inApprover = await campaign.methods.approvers(accounts[1]).call();
    assert(inApprover);
  });

  it("Requires a minimum contribution", async () => {
    try {
      await campaign.methods.contribute().send({
        from: accounts[1],
        value: "50",
      });
      assert(false);
    } catch (err) {
      assert(err);
    }
  });

  it("Allows manager to make a payment request", async () => {
    await campaign.methods
      .createRequest("Buy", "100", accounts[1])
      .send({ from: accounts[0], gas: "1000000" });

    const request = await campaign.methods.requests(0).call();

    assert.equal("Buy", request.description);
  });

  it("Processes request", async () => {
    await campaign.methods.contribute().send({
      from: accounts[0],
      value: web3.utils.toWei("10", "ether"),
    });

    await campaign.methods
      .createRequest("Buy", web3.utils.toWei("5", "ether"), accounts[1])
      .send({
        from: accounts[0],
        gas: "1000000",
      });

    await campaign.methods.approvalRequest(0).send({
      from: accounts[0],
      gas: "1000000",
    });

    await campaign.methods.finalizeRequest(0).send({
      from: accounts[0],
      gas: "1000000",
    });

    let receipientBalance = await web3.eth.getBalance(accounts[1]);
    receipientBalance = web3.utils.fromWei(receipientBalance, "ether");
    receipientBalance = parseFloat(receipientBalance);
    assert(receipientBalance > 104); // Starting amount + 5 eth
  });
});
