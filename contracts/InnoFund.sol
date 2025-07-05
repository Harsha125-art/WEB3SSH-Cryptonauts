// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract InnoFund {
    struct Idea {
        address creator;
        string title;
        string description;
        uint256 targetAmount;
        uint256 currentAmount;
        bool isSuccess;
        uint256 deadline; // stored as timestamp
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

    
    function postIdea(
        string memory _title,
        string memory _desc,
        uint256 _target,
        uint256 _durationDays
    ) public {
        uint256 deadline = block.timestamp + (_durationDays * 1 days);

        ideas[ideaCount] = Idea({
            creator: msg.sender,
            title: _title,
            description: _desc,
            targetAmount: _target,
            currentAmount: 0,
            isSuccess: false,
            deadline: deadline
        });

        emit IdeaPosted(ideaCount, msg.sender);
        ideaCount++;
    }

    
    function donate(uint id) public payable {
        require(block.timestamp <= ideas[id].deadline, "Funding period ended");
        require(msg.value > 0, "Must send ETH");

        ideas[id].currentAmount += msg.value;
        donations[msg.sender] += msg.value;

        // Badge logic
        if (donations[msg.sender] >= 5 ether) {
            badges[msg.sender] = "Gold";
        } else if (donations[msg.sender] >= 2 ether) {
            badges[msg.sender] = "Silver";
        } else if (donations[msg.sender] >= 0.5 ether) {
            badges[msg.sender] = "Bronze";
        }

        emit Funded(id, msg.sender, msg.value);
    }

  
    function invest(uint id, uint expectedReturn) public payable {
        require(block.timestamp <= ideas[id].deadline, "Funding period ended");
        require(msg.value > 0, "Investment required");

        investments[id].push(Investment({
            investor: msg.sender,
            amount: msg.value,
            expectedReturn: expectedReturn,
            withdrawn: false
        }));

        emit Invested(id, msg.sender, msg.value, expectedReturn);
    }

   
    function markSuccess(uint id) public {
        Idea storage idea = ideas[id];
        require(msg.sender == admin, "Only admin can mark success");
        require(block.timestamp <= idea.deadline, "Funding time over");
        require(idea.currentAmount >= idea.targetAmount, "Target not reached");

        idea.isSuccess = true;
    }

    
    function claimReturn(uint id) public {
        Investment[] storage invs = investments[id];
        for (uint i = 0; i < invs.length; i++) {
            if (invs[i].investor == msg.sender && !invs[i].withdrawn) {
                require(ideas[id].isSuccess, "Project failed");
                invs[i].withdrawn = true;
                payable(msg.sender).transfer(invs[i].expectedReturn);
            }
        }
    }

    
    function refund(uint id) public {
        Investment[] storage invs = investments[id];
        for (uint i = 0; i < invs.length; i++) {
            if (invs[i].investor == msg.sender && !invs[i].withdrawn) {
                require(!ideas[id].isSuccess, "Project succeeded");
                require(block.timestamp > ideas[id].deadline, "Funding period not over");
                invs[i].withdrawn = true;
                payable(msg.sender).transfer(invs[i].amount);
            }
        }
    }

    
    function withdrawDonations(uint id) public {
        Idea storage idea = ideas[id];
        require(msg.sender == idea.creator, "Only the creator can withdraw");
        require(idea.isSuccess, "Idea not marked successful");
        require(idea.currentAmount >= idea.targetAmount, "Target not met");

        uint amount = idea.currentAmount;
        idea.currentAmount = 0;
        payable(msg.sender).transfer(amount);
    }

    // Lower target amount (only before deadline and under 50%+ funding)
    function lowerTargetAmount(uint id, uint newTarget) public {
        Idea storage idea = ideas[id];
        require(msg.sender == idea.creator, "Only creator can modify target");
        require(block.timestamp <= idea.deadline, "Can't lower after deadline");
        require(idea.currentAmount * 2 >= idea.targetAmount, "At least 50% must be raised");
        require(newTarget >= idea.currentAmount, "New target must be >= current raised amount");
        require(newTarget < idea.targetAmount, "Target can only be lowered");

        idea.targetAmount = newTarget;
    }

    
    function getBadge(address user) public view returns (string memory) {
        return badges[user];
    }

   
    function getDeadline(uint id) public view returns (uint256) {
        return ideas[id].deadline;
    }

    // Get all ideas posted by user
    function getMyIdeas() public view returns (Idea[] memory) {
        uint count = 0;
        for (uint i = 0; i < ideaCount; i++) {
            if (ideas[i].creator == msg.sender) {
                count++;
            }
        }

        Idea[] memory result = new Idea[](count);
        uint index = 0;
        for (uint i = 0; i < ideaCount; i++) {
            if (ideas[i].creator == msg.sender) {
                result[index] = ideas[i];
                index++;
            }
        }
        return result;
    }
}
