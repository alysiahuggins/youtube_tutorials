// SPDX-License-Identifier: MIT

pragma solidity 0.8.18;

contract LevelFive {
    string private greeting = "Hello World";
    string private mostPopularGreeting;
    uint256 private highestCount;

    mapping(string => uint256) private greetingCounts;

    function updateGreeting(string calldata newGreeting) public {
        greeting = newGreeting;

        uint256 count = greetingCounts[newGreeting] + 1;
        greetingCounts[newGreeting] = count;

        if (count > highestCount) {
            highestCount = count;
            mostPopularGreeting = newGreeting;
        } else if (count == highestCount && bytes(newGreeting).length < bytes(mostPopularGreeting).length) {
            mostPopularGreeting = newGreeting;
        }

    }

    function showGreeting() public view returns (string memory) {
        return greeting;
    }

    function getGreetingCount(string calldata _greeting) public view returns (uint256) {
        return greetingCounts[_greeting];
    }

    function getGreetingWithMostCounts() public view returns (string memory, uint256) {
        require(highestCount > 0, "No greetings available.");

        return (mostPopularGreeting, highestCount);
    }
}