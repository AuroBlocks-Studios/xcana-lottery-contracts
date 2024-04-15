// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";

interface IERC20Def{
    function mint(address to,uint256 amount) external;
}

/// @title VibeCheck Contract for Guessing
contract VibeCheck is Ownable {
    IERC20Def public token;    //TEN Token Address
    string public question; //Questions string
    address private ownerAddress;   //Owner Address   

    uint256 public startTime;   //Start Time
    uint256 public endTime;     //End Time

    uint256 public feeAmount;   //Fee amount for guessing

    uint256 private currentAverage;     //Current Average Value
    uint256 public narrowLimit;         //Narrow Range Limit
    uint256 public broadLimit;          //Broad Range Limit
    uint256 public narrowReward;        //Narrow Reward in tokens
    uint256 public broadReward;         //Broad Reward in tokens
    uint256 public referralReward = 10;         //Referral Reward in percent

    uint256 public totalGuesses;        //Total guesses since start time

    mapping(address => uint256) private guesses; // Mapping of guesser addresses to their guesses
    mapping(address => uint256) private winnings; // Mapping of guesser addresses to their winnings
    mapping(address => address) private referrals; // Mapping of guesser addresses to their winnings

    address[] private  playersList;
    uint256[] private  winningsList;
    uint256 listIndex;

    /// @notice Event triggered when parameters are set
    event ParamSet(
        address setter,
        address token, 
        string question, 
        uint256 duration, 
        uint256 feeAmount,
        uint256 newAverage, 
        uint256 narrowLimit, 
        uint256 broadLimit,
        uint256 narrowReward,
        uint256 broadReward);

    /// @notice Event triggered when player makes a guess
    event GuessMade(
        address guesser,
        uint256 oldAverage,
        uint256 newAverage,
        uint256 tokensMinted,
        uint256 guess);    

    constructor(
        address _token, //ERC20 Token Address
        string memory _question, //Ques String
        uint256 _duration, //Change to start and end 
        uint256 _feeAmount, //Fee for guessing
        uint256 _initialAverage, //Initial Average 
        uint256 _narrowLimit, //Narrow Range Limit 
        uint256 _broadLimit, //Broad Range Limit
        uint256 _narrowReward, //Narrow Reward in tokens
         uint256 _broadReward //Broad Reward in tokens
    ) Ownable() {
        ownerAddress = msg.sender;
        token = IERC20Def(_token);
        question = _question;
        startTime = block.timestamp;
        endTime = startTime + _duration;
        feeAmount = _feeAmount;
        currentAverage = _initialAverage;
        narrowLimit = _narrowLimit;
        broadLimit = _broadLimit;
        narrowReward = _narrowReward;
        broadReward = _broadReward;

        emit ParamSet(msg.sender,_token, _question, _duration, _feeAmount, _initialAverage, _narrowLimit, _broadLimit, _narrowReward, _broadReward);
        //Contract Initialized 
    }

    /// @notice Make a guess for a certain fee
    /// @param referral Referral Address
    /// @param value Guess Number
    /// @dev Requires that the value is between 1-100, only one attempt per address
    function guess(address referral, uint256 value) public payable {
        require(referral != msg.sender,"Referral address cant be own address");
        require(value >0 && value<=100, "Value must be between 0-100"); //Check if guess is within range
        require(msg.value == feeAmount, "Incorrect fee amount"); //Check if correct fee amt is sent
        require(block.timestamp >= startTime && block.timestamp <= endTime, "Game not active"); //Check if game is active
        require(guesses[msg.sender] == 0, "You have already guessed"); // Check if the guesser has already made a guess

        if(referral != address(0))
            referrals[msg.sender] = referral;
        
        totalGuesses++;

        if (value >= (currentAverage - narrowLimit) && value <= (currentAverage + narrowLimit)) {
            // User's guess is within narrow limit
            // Transfer tokens to the user
            uint userReward = narrowReward; 
            uint referReward = (narrowReward * referralReward) / 100;
            token.mint(msg.sender, userReward); // Transfer 100 tokens to the user as a reward
            if(referral != address(0))
                token.mint(referral, referReward); // Transfer x tokens to the referral as a reward
            // Calculate new average including this guess
            uint256 newAverage = ((currentAverage * totalGuesses) + value) / (totalGuesses+1);
            currentAverage = newAverage;

            guesses[msg.sender] = value;
            winnings[msg.sender] = narrowReward;
            playersList.push(msg.sender);
            winningsList.push(narrowReward);
            listIndex = listIndex + 1;

            emit GuessMade(msg.sender, currentAverage, newAverage, narrowReward, value);
        } else if (value >= currentAverage - broadLimit && value <= currentAverage + broadLimit) {
            // User's guess is within broad limit
            uint userReward = broadReward;
            uint referReward = (broadReward * referralReward) / 100;
            token.mint(msg.sender, userReward); // Transfer 45 tokens to the user as a reward
            if(referral != address(0))
                token.mint(referral, referReward); // Transfer 5 tokens to the referral as a reward
            uint256 newAverage = ((currentAverage * totalGuesses) + value) / (totalGuesses+1);
            currentAverage = newAverage;
            guesses[msg.sender] = value;
            winnings[msg.sender] = broadReward;
            playersList.push(msg.sender);
            winningsList.push(broadReward);
            listIndex = listIndex + 1;
            emit GuessMade(msg.sender, currentAverage, newAverage, broadReward, value);
        }
        else{
            uint256 newAverage = ((currentAverage * totalGuesses) + value) / (totalGuesses+1);
            currentAverage = newAverage;

            guesses[msg.sender] = value;
            winnings[msg.sender] = 0;
            playersList.push(msg.sender);
            winningsList.push(0);
            listIndex = listIndex + 1;

            emit GuessMade(msg.sender, currentAverage, newAverage, 0, value);
        }
    }

    /// @notice Check your guessed number
    /// @param guesser Address of guesser
    /// @dev Requires that caller is the guesser(guess is private to each player)
    function checkMyGuess(address guesser) external view returns (uint256) {
        require(msg.sender == guesser,"Can only check own guess");
        return guesses[guesser];
    }

    /// @notice Check your referral address
    /// @param guesser Address of guesser
    /// @dev Requires that caller is the guesser(referral is private to each player)
    function checkMyReferral(address guesser) external view returns (address) {
        require(msg.sender == guesser,"Can only check own referral");
        return referrals[guesser];
    }

    /// @notice Check if player has guessed
    /// @param guesser Address of guesser
    /// @dev Requires that caller is the guesser(guess is private to each player)
    function checkIfPlayed(address guesser) external view returns (bool) {
        require(msg.sender == guesser,"Can only check own guess");
        if(guesses[guesser] == 0)
            return false;
        else 
            return true;    
    }

    /// @notice Check your guessed number
    /// @param guesser Address of guesser
    /// @dev Requires that caller is the guesser(guess is private to each player)
    function checkMyWinnings(address guesser) external view returns (uint256) {
        require(msg.sender == guesser || msg.sender == ownerAddress,"Can only check own winnings");
        return winnings[guesser];
    }

    /// @notice Check the current average
    /// @dev Requires that caller is owner
    function checkCurrentAverage() external view returns (uint256) {
        require(msg.sender == ownerAddress,"Only owner can check");
        return currentAverage;
    }

    /// @notice Check the current fee for guessing
    function checkFee() external view returns (uint256) {
        return feeAmount;
    }

    /// @notice Check the current total number of guesses made
    function checkTotalGuesses() external view returns (uint256) {
        return totalGuesses;
    }

    /// @notice Check the current total fees collected
    /// @dev Requires that caller is owner
    function getContractBalance() external view returns (uint256) {
        require(msg.sender == ownerAddress,"Only owner can check");
        return address(this).balance;
    }

    /// @notice Set new narrow and broad range limits
    /// @dev Requires that caller is owner
    function setLimits(uint256 _narrowLimit, uint256 _broadLimit) public onlyOwner {
        narrowLimit = _narrowLimit;
        broadLimit = _broadLimit;
    }

    /// @notice Set new narrow and broad range rewards
    /// @dev Requires that caller is owner
    function setRewards(uint256 _narrowReward, uint256 _broadReward) public onlyOwner {
        narrowReward = _narrowReward;
        broadReward = _broadReward;
    }

    /// @notice Set referral rewards
    /// @dev Requires that caller is owner
    function setReferralRewards(uint256 _referralReward) public onlyOwner {
        referralReward = _referralReward;
    }

    /// @notice Set new fees for guessing
    /// @dev Requires that caller is owner
    function setFeeAmount(uint256 _feeAmount) public onlyOwner {
        feeAmount = _feeAmount;
    }

    /// @notice Set new ERC20 Token Address
    /// @dev Requires that caller is owner
    function setTenTokenAddress(address _token) public onlyOwner {
        token = IERC20Def(_token);
    }

    function readAllWinnings() public view returns (address[] memory, uint256[] memory) {
        require(msg.sender == ownerAddress, "Owner only");
        return (playersList, winningsList);
    }
    
    /// @notice Set new params for the game
    /// @dev Requires that caller is owner
    function setParams(
        address _token, 
        string memory _question, 
        uint256 _duration, 
        uint256 _feeAmount,
        uint256 _initialAverage, 
        uint256 _narrowLimit, 
        uint256 _broadLimit,
        uint256 _narrowReward,
         uint256 _broadReward
    ) public onlyOwner {
        token = IERC20Def(_token);
        question = _question;
        startTime = block.timestamp;
        endTime = startTime + _duration;
        feeAmount = _feeAmount;
        currentAverage = _initialAverage;
        narrowLimit = _narrowLimit;
        broadLimit = _broadLimit;
        narrowReward = _narrowReward;
        broadReward = _broadReward;

        emit ParamSet(msg.sender,_token, _question, _duration, _feeAmount, _initialAverage, _narrowLimit, _broadLimit, _narrowReward, _broadReward);
    }

    /// @notice Check the question details
    function checkQuestionDetails() external view returns (string memory, uint256, uint256, uint256) {
        return (question,startTime,endTime,feeAmount);
    }

    /// @notice Withdraw collected fees from contract
    /// @param recipient Address of recipient
    /// @dev Requires that caller is owner
    function withdrawFees(address payable recipient) external onlyOwner {
        uint256 contractBalance = address(this).balance;
        require(contractBalance > 0, "Contract balance is zero");

        recipient.transfer(contractBalance);
    }
}


// Should reset functionality be available
// Can average be reset by owner
// Change constructor params to start and end time
