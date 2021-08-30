// Specifies the version of solidity that our code is written with
pragma solidity ^0.4.17;

// Defines a new contract (similar to class)
contract Inbox{
    string public message; //Defines a storage variable (or an instance variable and their type)
    
    function Inbox(string initialMessage) public { // Constructor function (something like init), invoked automatically when deployed
        message = initialMessage;
    }
    
    function setMessage(string newMessage) public {
        message = newMessage;
    }
    // function | function name | function type | return types
    function getMessage() public view returns (string){
        return message;
    }
}

// Function Types:
// 1. public = Anyone can call this function
// 2. private = Only this contract can call this function
// 3. view/constant = This function returns data and does not modify the constract's data
// 4. pure = Function will not modify or even read the contract's data
// 5. payable = When someone calls this function, they might send ether along.