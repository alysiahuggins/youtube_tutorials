// SPDX-License-Identifier: MIT

pragma solidity 0.8.18;

contract LevelFour {
    string private greeting = "Hello World";
    mapping(string => uint256) private greetingCounts;
    string[] private greetingKeys;


    function updateGreeting(string calldata newGreeting) public {
        greeting = newGreeting;

        if(greetingCounts[newGreeting]==0){
            greetingCounts[newGreeting]=1;
        }else{
            greetingCounts[newGreeting]++;
        }
        greetingKeys.push(greeting);
    }

    function showGreeting() public view returns (string memory) {
        return greeting;
    }

    function getGreetingCount(string calldata _greeting) public view returns (uint256) {
        return greetingCounts[_greeting];
    }

    function getGreetingWithMostCounts() public view returns (string memory, uint256) {
        require(greetingKeys.length > 0, "No greetings available.");

        string memory mostPopularGreeting = greetingKeys[0];
        uint256 highestCount = greetingCounts[mostPopularGreeting];

        for (uint256 i = 1; i < greetingKeys.length; i++){
            string memory _greeting = greetingKeys[i];
            uint256 count = greetingCounts[_greeting];

            if(count>highestCount){
                highestCount = count;
                mostPopularGreeting = _greeting;
            }
        }
        
        return (mostPopularGreeting, highestCount);
    }
}