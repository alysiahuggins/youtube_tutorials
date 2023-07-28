// SPDX-License-Identifier: MIT

pragma solidity 0.8.18;

contract LevelSix {
    mapping(string => uint256) private greetingCounts;
    string private mostPopularGreeting;
    uint256 private highestCount;

    uint256 public constant UPDATE_GREETING_FEE = 0.001 ether;

    event GreetingUpdated(address indexed sender, string newGreeting, uint256 amountPaid);

    function updateGreeting(string calldata newGreeting) public payable {
        require(msg.value >= UPDATE_GREETING_FEE, "Insufficient payment to update greeting.");

        uint256 count = greetingCounts[newGreeting] + 1;
        greetingCounts[newGreeting] = count;

        if (count > highestCount) {
            highestCount = count;
            mostPopularGreeting = newGreeting;
        } else if (count == highestCount && bytes(newGreeting).length < bytes(mostPopularGreeting).length) {
            mostPopularGreeting = newGreeting;
        }

        emit GreetingUpdated(msg.sender, newGreeting, UPDATE_GREETING_FEE);
    }

    function getGreetingCount(string calldata greeting) public view returns (uint256) {
        return greetingCounts[greeting];
    }

    function getGreetingWithMostCounts() public view returns (string memory, uint256) {
        require(highestCount > 0, "No greetings available.");

        return (mostPopularGreeting, highestCount);
    }
}