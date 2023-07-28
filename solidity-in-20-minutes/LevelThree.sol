// SPDX-License-Identifier: MIT

pragma solidity 0.8.18;

contract LevelThree{
	string public greeting="Hello World";
    mapping(string => uint256) private greetingCounts;

    function updateGreeting(string calldata newGreeting) public{
        greeting = newGreeting;

        if(greetingCounts[newGreeting]==0){
            greetingCounts[newGreeting]=1;
        }else{
            greetingCounts[newGreeting]++;
        }
    }

    function showGreeting() public view returns (string memory){
        return greeting;
    }

    function getGreetingCount(string calldata _greeting) public view returns (uint256){
        return greetingCounts[_greeting];
    }
}