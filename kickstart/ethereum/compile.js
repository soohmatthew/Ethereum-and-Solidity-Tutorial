// 1. Delete entire 'build' folder (removes prev compiled script)
// 2. Read campign.sol from the contracts folder
// 3. Compile both contracts with soliditiy compiler
// 4. Write output to 'build' folder
const path = require("path");
const solc = require("solc"); // solidity compiler
const fs = require("fs-extra"); // gives us acess to the file systems (fs-extra has extra functions)

const buildPath = path.resolve(__dirname, "build");
fs.removeSync(buildPath); // Removes build folder

const campaignPath = path.resolve(__dirname, "contracts", "Campaign.sol");
const source = fs.readFileSync(campaignPath, "utf8");
const output = solc.compile(source, 1).contracts;
// Since there are 2 contracts, this will create an object with 2 keys, "Campaign" and "CampaignFactory"

fs.ensureDirSync(buildPath);

for (let contract in output) {
  // Iterates over the keys "Campaign" and "CampaignFactory"
  fs.outputJSONSync(
    path.resolve(buildPath, contract.replace(":", "") + ".json"), // Path
    output[contract] // Object value
  );
}
