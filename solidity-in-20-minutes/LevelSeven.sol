// SPDX-License-Identifier: MIT

pragma solidity 0.8.18;

contract LevelSeven {
    mapping(string => uint256) private greetingCounts;
    string private mostPopularGreeting;
    uint256 private highestCount;
    address private owner;

    uint256 private constant UPDATE_GREETING_FEE = 0.001 ether;

    event GreetingUpdated(address indexed sender, string newGreeting, uint256 amountPaid);
    event FundsWithdrawn(address indexed owner, uint256 amount);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the contract owner can call this function.");
        _;
    }

    function updateGreeting(string calldata newGreeting) external payable {
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

    function getGreetingCount(string calldata greeting) external view returns (uint256) {
        return greetingCounts[greeting];
    }

    function getGreetingWithMostCounts() external view returns (string memory, uint256) {
        require(highestCount > 0, "No greetings available.");

        return (mostPopularGreeting, highestCount);
    }

    function withdrawFunds(uint256 amount) external onlyOwner {
        require(amount <= address(this).balance, "Insufficient contract balance.");

        payable(owner).transfer(amount);
        emit FundsWithdrawn(owner, amount);
    }
}