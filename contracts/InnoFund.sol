// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract StartupFunding {
    struct Idea {
        address creator;
        string title;
        string description;
        uint256 targetAmount;
        uint256 currentAmount;
        bool isSuccess;
        uint256 deadline; // 👈 new field
    }

    struct Investment {
        address investor;
        uint256 amount;
        uint256 expectedReturn;
        bool withdrawn;
    }

    mapping(uint => Idea) public ideas;
    mapping(uint => Investment[]) public investments;
    mapping(address => uint256) public donations;
    mapping(address => string) public badges;

    uint public ideaCount = 0;

    address public admin;

    constructor() {
        admin = msg.sender;
    }

    event IdeaPosted(uint id, address creator);
    event Funded(uint id, address funder, uint amount);
    event Invested(uint id, address investor, uint amount, uint expectedReturn);

    function postIdea(string memory _title, string memory _desc, uint256 _target, uint256 _durationDays) public {
        uint256 deadline = block.timestamp + (_durationDays * 1 days);
        ideas[ideaCount] = Idea(msg.sender, _title, _desc, _target, 0, false, deadline);
        emit IdeaPosted(ideaCount, msg.sender);
        ideaCount++;
    }

    function donate(uint id) public payable {
        require(block.timestamp <= ideas[id].deadline, "Funding period ended");
        require(msg.value > 0, "Must send ETH");
        ideas[id].currentAmount += msg.value;
        donations[msg.sender] += msg.value;

        // Assign badge
        if (donations[msg.sender] >= 10 ether) {
            badges[msg.sender] = "Gold";
        } else if (donations[msg.sender] >= 5 ether) {
            badges[msg.sender] = "Silver";
        } else if (donations[msg.sender] >= 2 ether) {
            badges[msg.sender] = "Bronze";
        }

        emit Funded(id, msg.sender, msg.value);
    }

    function invest(uint id, uint expectedReturn) public payable {
        require(block.timestamp <= ideas[id].deadline, "Funding period ended");
        require(msg.value > 0, "Investment required");
        investments[id].push(Investment(msg.sender, msg.value, expectedReturn, false));
        emit Invested(id, msg.sender, msg.value, expectedReturn);
    }

    function markSuccess(uint id) public {
        Idea storage idea = ideas[id];
        require(msg.sender == admin, "Only admin can mark success"); // ✅ safer
        require(block.timestamp <= idea.deadline, "Funding time over");
        require(idea.currentAmount >= idea.targetAmount, "Target not reached");
        idea.isSuccess = true;
    }

    function claimReturn(uint id) public {
        Investment[] storage invs = investments[id];
        for (uint i = 0; i < invs.length; i++) {
            if (invs[i].investor == msg.sender && !invs[i].withdrawn) {
                require(ideas[id].isSuccess, "Project failed");
                payable(msg.sender).transfer(invs[i].expectedReturn);
                invs[i].withdrawn = true;
            }
        }
    }

    function refund(uint id) public {
        Investment[] storage invs = investments[id];
        for (uint i = 0; i < invs.length; i++) {
            if (invs[i].investor == msg.sender && !invs[i].withdrawn) {
                require(!ideas[id].isSuccess, "Project succeeded");
                require(block.timestamp > ideas[id].deadline, "Funding period not over");
                payable(msg.sender).transfer(invs[i].amount);
                invs[i].withdrawn = true;
            }
        }
    }

    function withdrawDonations(uint id) public {
        Idea storage idea = ideas[id];
        require(msg.sender == idea.creator, "Only the creator can withdraw");
        require(idea.isSuccess == true, "Idea not marked successful");
        require(idea.currentAmount >= idea.targetAmount, "Target not met");

        uint amount = idea.currentAmount;
        idea.currentAmount = 0;
        payable(msg.sender).transfer(amount);
    }

    function getBadge(address user) public view returns (string memory) {
        return badges[user];
    }

    function getDeadline(uint id) public view returns (uint256) {
        return ideas[id].deadline;
    }

    function lowerTargetAmount(uint id, uint newTarget) public {
    Idea storage idea = ideas[id];
    require(msg.sender == idea.creator, "Only creator can modify target");
    require(block.timestamp <= idea.deadline, "Can't lower after deadline");
    require(idea.currentAmount * 2 >= idea.targetAmount, "At least 50% must be raised");
    require(newTarget >= idea.currentAmount, "New target must be >= current raised amount");
    require(newTarget < idea.targetAmount, "Target can only be lowered");

    idea.targetAmount = newTarget;
}

}
