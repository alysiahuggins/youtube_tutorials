// SPDX-License-Identifier: MIT

pragma solidity 0.8.18;

contract LevelTwo{
	string public greeting="Hello World";

    function updateGreeting(string calldata newGreeting) public{
        greeting = newGreeting;
    }

    function showGreeting() public view returns (string memory){
        return greeting;
    }
}