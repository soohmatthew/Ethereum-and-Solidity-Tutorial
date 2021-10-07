pragma solidity ^0.4.17;

// Ways to deploy
// 1. Give users the source code, ask them to deploy themselves 
// - Problem: Users can change the requirements
// 2. Deploy it ourselves, and give the contract address to user 
// - Problem: We are deploying, thus the cost of deployment is beared by us
// 3. Create a "factory" contract, that has the function of creating new contracts. 
// User will need to invoke transaction to create a new contract, thus he will bear the deployment costs.
// We can get a list of all deployed campaigns.

contract CampaignFactory{
    
    address[] public deployedCampaigns;
    
    function createCampaign(uint minimumContribution) public {
        address newCampaign = new Campaign(minimumContribution, msg.sender);
        // This deploys a new Campaign, and returns the Campaign address
        
        deployedCampaigns.push(newCampaign);
    }
    
    function getDeployedCampaigns() public view returns (address[]) {
        return deployedCampaigns;
    }
    
}

contract Campaign {
    struct Request {
        string description;
        uint value;
        address recipient;
        bool complete;
        uint approvalCount;
        mapping(address => bool) approvals; // Mapping of addresses that have approved the request.
    } // This is a definition, it still needs to be instantiated later on.
    
    Request[] public requests;
    address public manager;
    uint public minimumContribution;
    // address[] public approvers; Arrays are dangerous for contracts, as arrays may grow 
    // to a large size, and cost a lot of gas to iterate
    
    // Array will have a linear time search
    // Mapping will have a constant time search
    // In solidity, 
    // (i) keys are not stored - You will have to enter the key in the mapping to check if it's there.
    // (ii) values are not iterable (cannot fetch all values)
    // (iii) all values exist - A default value will be returned if a key that does not exist is searched.
    mapping(address => bool) public approvers;
    uint public approversCount;
    
    modifier restricted() {
        require(msg.sender == manager);
        _;
    }
    
    function Campaign(uint minimum, address creator) public{
        manager = creator;
        minimumContribution = minimum;
    }
    
    function contribute() public payable {
        require(msg.value > minimumContribution);
        
        approvers[msg.sender] = true;
        approversCount++;
    }
    
    function createRequest(string description, uint value, address recipient) public restricted {
            
            Request memory newRequest = Request({
                // Memory vs storage
                // Storage points to the original variables, while memory creates a copy of the variable.
               description: description,
               value: value,
               recipient: recipient,
               complete: false,
               approvalCount: 0

            });
            
            requests.push(newRequest);
    }
    
    function approvalRequest(uint index) public {
        Request storage request = requests[index];
        
        require(approvers[msg.sender]); // Require that the person is on list of approvers
        require(!request.approvals[msg.sender]); // Require that the person not have voted for the current requests
        
        request.approvals[msg.sender] = true;
        request.approvalCount++;
        
    }
    
    function finalizeRequest(uint index) public restricted {
        Request storage request = requests[index];
        
        require(!request.complete); // Confirm that the request has not been approved yet.
        require(request.approvalCount > (approversCount/2));
        
        request.recipient.transfer(request.value);
        request.complete = true;
    }
    
}