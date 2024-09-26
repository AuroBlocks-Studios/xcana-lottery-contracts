// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import {VRFConsumerBaseV2Plus} from "@chainlink/contracts/src/v0.8/vrf/dev/VRFConsumerBaseV2Plus.sol";
import {VRFV2PlusClient} from "@chainlink/contracts/src/v0.8/vrf/dev/libraries/VRFV2PlusClient.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

/**
 * @dev Contract module that helps prevent reentrant calls to a function.
 *
 * Inheriting from `ReentrancyGuard` will make the {nonReentrant} modifier
 * available, which can be applied to functions to make sure there are no nested
 * (reentrant) calls to them.
 *
 * Note that because there is a single `nonReentrant` guard, functions marked as
 * `nonReentrant` may not call one another. This can be worked around by making
 * those functions `private`, and then adding `external` `nonReentrant` entry
 * points to them.
 *
 * TIP: If you would like to learn more about reentrancy and alternative ways
 * to protect against it, check out our blog post
 * https://blog.openzeppelin.com/reentrancy-after-istanbul/[Reentrancy After Istanbul].
 */
abstract contract ReentrancyGuard {
    // Booleans are more expensive than uint256 or any type that takes up a full
    // word because each write operation emits an extra SLOAD to first read the
    // slot's contents, replace the bits taken up by the boolean, and then write
    // back. This is the compiler's defense against contract upgrades and
    // pointer aliasing, and it cannot be disabled.

    // The values being non-zero value makes deployment a bit more expensive,
    // but in exchange the refund on every call to nonReentrant will be lower in
    // amount. Since refunds are capped to a percentage of the total
    // transaction's gas, it is best to keep them low in cases like this one, to
    // increase the likelihood of the full refund coming into effect.
    uint256 private constant _NOT_ENTERED = 1;
    uint256 private constant _ENTERED = 2;

    uint256 private _status;

    constructor() {
        _status = _NOT_ENTERED;
    }

    /**
     * @dev Prevents a contract from calling itself, directly or indirectly.
     * Calling a `nonReentrant` function from another `nonReentrant`
     * function is not supported. It is possible to prevent this from happening
     * by making the `nonReentrant` function external, and make it call a
     * `private` function that does the actual work.
     */
    modifier nonReentrant() {
        // On the first call to nonReentrant, _notEntered will be true
        require(_status != _ENTERED, "ReentrancyGuard: reentrant call");

        // Any calls to nonReentrant after this point will fail
        _status = _ENTERED;

        _;

        // By storing the original value once again, a refund is triggered (see
        // https://eips.ethereum.org/EIPS/eip-2200)
        _status = _NOT_ENTERED;
    }
}

/**
 * @dev Collection of functions related to the address type
 */
library Address {
    /**
     * @dev Returns true if `account` is a contract.
     *
     * [IMPORTANT]
     * ====
     * It is unsafe to assume that an address for which this function returns
     * false is an externally-owned account (EOA) and not a contract.
     *
     * Among others, `isContract` will return false for the following
     * types of addresses:
     *
     *  - an externally-owned account
     *  - a contract in construction
     *  - an address where a contract will be created
     *  - an address where a contract lived, but was destroyed
     * ====
     */
    function isContract(address account) internal view returns (bool) {
        // This method relies on extcodesize, which returns 0 for contracts in
        // construction, since the code is only stored at the end of the
        // constructor execution.

        uint256 size;
        // solhint-disable-next-line no-inline-assembly
        assembly {
            size := extcodesize(account)
        }
        return size > 0;
    }

    /**
     * @dev Replacement for Solidity's `transfer`: sends `amount` wei to
     * `recipient`, forwarding all available gas and reverting on errors.
     *
     * https://eips.ethereum.org/EIPS/eip-1884[EIP1884] increases the gas cost
     * of certain opcodes, possibly making contracts go over the 2300 gas limit
     * imposed by `transfer`, making them unable to receive funds via
     * `transfer`. {sendValue} removes this limitation.
     *
     * https://diligence.consensys.net/posts/2019/09/stop-using-soliditys-transfer-now/[Learn more].
     *
     * IMPORTANT: because control is transferred to `recipient`, care must be
     * taken to not create reentrancy vulnerabilities. Consider using
     * {ReentrancyGuard} or the
     * https://solidity.readthedocs.io/en/v0.5.11/security-considerations.html#use-the-checks-effects-interactions-pattern[checks-effects-interactions pattern].
     */
    function sendValue(address payable recipient, uint256 amount) internal {
        require(
            address(this).balance >= amount,
            "Address: insufficient balance"
        );

        // solhint-disable-next-line avoid-low-level-calls, avoid-call-value
        (bool success, ) = recipient.call{value: amount}("");
        require(
            success,
            "Address: unable to send value, recipient may have reverted"
        );
    }

    /**
     * @dev Performs a Solidity function call using a low level `call`. A
     * plain`call` is an unsafe replacement for a function call: use this
     * function instead.
     *
     * If `target` reverts with a revert reason, it is bubbled up by this
     * function (like regular Solidity function calls).
     *
     * Returns the raw returned data. To convert to the expected return value,
     * use https://solidity.readthedocs.io/en/latest/units-and-global-variables.html?highlight=abi.decode#abi-encoding-and-decoding-functions[`abi.decode`].
     *
     * Requirements:
     *
     * - `target` must be a contract.
     * - calling `target` with `data` must not revert.
     *
     * _Available since v3.1._
     */
    function functionCall(address target, bytes memory data)
        internal
        returns (bytes memory)
    {
        return functionCall(target, data, "Address: low-level call failed");
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`], but with
     * `errorMessage` as a fallback revert reason when `target` reverts.
     *
     * _Available since v3.1._
     */
    function functionCall(
        address target,
        bytes memory data,
        string memory errorMessage
    ) internal returns (bytes memory) {
        return functionCallWithValue(target, data, 0, errorMessage);
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`],
     * but also transferring `value` wei to `target`.
     *
     * Requirements:
     *
     * - the calling contract must have an ETH balance of at least `value`.
     * - the called Solidity function must be `payable`.
     *
     * _Available since v3.1._
     */
    function functionCallWithValue(
        address target,
        bytes memory data,
        uint256 value
    ) internal returns (bytes memory) {
        return
            functionCallWithValue(
                target,
                data,
                value,
                "Address: low-level call with value failed"
            );
    }

    /**
     * @dev Same as {xref-Address-functionCallWithValue-address-bytes-uint256-}[`functionCallWithValue`], but
     * with `errorMessage` as a fallback revert reason when `target` reverts.
     *
     * _Available since v3.1._
     */
    function functionCallWithValue(
        address target,
        bytes memory data,
        uint256 value,
        string memory errorMessage
    ) internal returns (bytes memory) {
        require(
            address(this).balance >= value,
            "Address: insufficient balance for call"
        );
        require(isContract(target), "Address: call to non-contract");

        // solhint-disable-next-line avoid-low-level-calls
        (bool success, bytes memory returndata) = target.call{value: value}(
            data
        );
        return _verifyCallResult(success, returndata, errorMessage);
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`],
     * but performing a static call.
     *
     * _Available since v3.3._
     */
    function functionStaticCall(address target, bytes memory data)
        internal
        view
        returns (bytes memory)
    {
        return
            functionStaticCall(
                target,
                data,
                "Address: low-level static call failed"
            );
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-string-}[`functionCall`],
     * but performing a static call.
     *
     * _Available since v3.3._
     */
    function functionStaticCall(
        address target,
        bytes memory data,
        string memory errorMessage
    ) internal view returns (bytes memory) {
        require(isContract(target), "Address: static call to non-contract");

        // solhint-disable-next-line avoid-low-level-calls
        (bool success, bytes memory returndata) = target.staticcall(data);
        return _verifyCallResult(success, returndata, errorMessage);
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`],
     * but performing a delegate call.
     *
     * _Available since v3.4._
     */
    function functionDelegateCall(address target, bytes memory data)
        internal
        returns (bytes memory)
    {
        return
            functionDelegateCall(
                target,
                data,
                "Address: low-level delegate call failed"
            );
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-string-}[`functionCall`],
     * but performing a delegate call.
     *
     * _Available since v3.4._
     */
    function functionDelegateCall(
        address target,
        bytes memory data,
        string memory errorMessage
    ) internal returns (bytes memory) {
        require(isContract(target), "Address: delegate call to non-contract");

        // solhint-disable-next-line avoid-low-level-calls
        (bool success, bytes memory returndata) = target.delegatecall(data);
        return _verifyCallResult(success, returndata, errorMessage);
    }

    function _verifyCallResult(
        bool success,
        bytes memory returndata,
        string memory errorMessage
    ) private pure returns (bytes memory) {
        if (success) {
            return returndata;
        } else {
            // Look for revert reason and bubble it up if present
            if (returndata.length > 0) {
                // The easiest way to bubble the revert reason is using memory via assembly

                // solhint-disable-next-line no-inline-assembly
                assembly {
                    let returndata_size := mload(returndata)
                    revert(add(32, returndata), returndata_size)
                }
            } else {
                revert(errorMessage);
            }
        }
    }
}




// File: browser/SafeMath.sol

pragma solidity ^0.8.0;

/**
 * @dev Wrappers over Solidity's arithmetic operations with added overflow
 * checks.
 *
 * Arithmetic operations in Solidity wrap on overflow. This can easily result
 * in bugs, because programmers usually assume that an overflow raises an
 * error, which is the standard behavior in high level programming languages.
 * `SafeMath` restores this intuition by reverting the transaction when an
 * operation overflows.
 *
 * Using this library instead of the unchecked operations eliminates an entire
 * class of bugs, so it's recommended to use it always.
 */
library SafeMath {
    /**
     * @dev Returns the addition of two unsigned integers, with an overflow flag.
     */
    function tryAdd(uint256 a, uint256 b)
        internal
        pure
        returns (bool, uint256)
    {
        uint256 c = a + b;
        if (c < a) return (false, 0);
        return (true, c);
    }

    /**
     * @dev Returns the substraction of two unsigned integers, with an overflow flag.
     */
    function trySub(uint256 a, uint256 b)
        internal
        pure
        returns (bool, uint256)
    {
        if (b > a) return (false, 0);
        return (true, a - b);
    }

    /**
     * @dev Returns the multiplication of two unsigned integers, with an overflow flag.
     */
    function tryMul(uint256 a, uint256 b)
        internal
        pure
        returns (bool, uint256)
    {
        // Gas optimization: this is cheaper than requiring 'a' not being zero, but the
        // benefit is lost if 'b' is also tested.
        // See: https://github.com/OpenZeppelin/openzeppelin-contracts/pull/522
        if (a == 0) return (true, 0);
        uint256 c = a * b;
        if (c / a != b) return (false, 0);
        return (true, c);
    }

    /**
     * @dev Returns the division of two unsigned integers, with a division by zero flag.
     */
    function tryDiv(uint256 a, uint256 b)
        internal
        pure
        returns (bool, uint256)
    {
        if (b == 0) return (false, 0);
        return (true, a / b);
    }

    /**
     * @dev Returns the remainder of dividing two unsigned integers, with a division by zero flag.
     */
    function tryMod(uint256 a, uint256 b)
        internal
        pure
        returns (bool, uint256)
    {
        if (b == 0) return (false, 0);
        return (true, a % b);
    }

    /**
     * @dev Returns the addition of two unsigned integers, reverting on
     * overflow.
     *
     * Counterpart to Solidity's `+` operator.
     *
     * Requirements:
     *
     * - Addition cannot overflow.
     */
    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        require(c >= a, "SafeMath: addition overflow");
        return c;
    }

    /**
     * @dev Returns the subtraction of two unsigned integers, reverting on
     * overflow (when the result is negative).
     *
     * Counterpart to Solidity's `-` operator.
     *
     * Requirements:
     *
     * - Subtraction cannot overflow.
     */
    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b <= a, "SafeMath: subtraction overflow");
        return a - b;
    }

    /**
     * @dev Returns the multiplication of two unsigned integers, reverting on
     * overflow.
     *
     * Counterpart to Solidity's `*` operator.
     *
     * Requirements:
     *
     * - Multiplication cannot overflow.
     */
    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        if (a == 0) return 0;
        uint256 c = a * b;
        require(c / a == b, "SafeMath: multiplication overflow");
        return c;
    }

    /**
     * @dev Returns the integer division of two unsigned integers, reverting on
     * division by zero. The result is rounded towards zero.
     *
     * Counterpart to Solidity's `/` operator. Note: this function uses a
     * `revert` opcode (which leaves remaining gas untouched) while Solidity
     * uses an invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     *
     * - The divisor cannot be zero.
     */
    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b > 0, "SafeMath: division by zero");
        return a / b;
    }

    /**
     * @dev Returns the remainder of dividing two unsigned integers. (unsigned integer modulo),
     * reverting when dividing by zero.
     *
     * Counterpart to Solidity's `%` operator. This function uses a `revert`
     * opcode (which leaves remaining gas untouched) while Solidity uses an
     * invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     *
     * - The divisor cannot be zero.
     */
    function mod(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b > 0, "SafeMath: modulo by zero");
        return a % b;
    }

    /**
     * @dev Returns the subtraction of two unsigned integers, reverting with custom message on
     * overflow (when the result is negative).
     *
     * CAUTION: This function is deprecated because it requires allocating memory for the error
     * message unnecessarily. For custom revert reasons use {trySub}.
     *
     * Counterpart to Solidity's `-` operator.
     *
     * Requirements:
     *
     * - Subtraction cannot overflow.
     */
    function sub(
        uint256 a,
        uint256 b,
        string memory errorMessage
    ) internal pure returns (uint256) {
        require(b <= a, errorMessage);
        return a - b;
    }

    /**
     * @dev Returns the integer division of two unsigned integers, reverting with custom message on
     * division by zero. The result is rounded towards zero.
     *
     * CAUTION: This function is deprecated because it requires allocating memory for the error
     * message unnecessarily. For custom revert reasons use {tryDiv}.
     *
     * Counterpart to Solidity's `/` operator. Note: this function uses a
     * `revert` opcode (which leaves remaining gas untouched) while Solidity
     * uses an invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     *
     * - The divisor cannot be zero.
     */
    function div(
        uint256 a,
        uint256 b,
        string memory errorMessage
    ) internal pure returns (uint256) {
        require(b > 0, errorMessage);
        return a / b;
    }

    /**
     * @dev Returns the remainder of dividing two unsigned integers. (unsigned integer modulo),
     * reverting with custom message when dividing by zero.
     *
     * CAUTION: This function is deprecated because it requires allocating memory for the error
     * message unnecessarily. For custom revert reasons use {tryMod}.
     *
     * Counterpart to Solidity's `%` operator. This function uses a `revert`
     * opcode (which leaves remaining gas untouched) while Solidity uses an
     * invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     *
     * - The divisor cannot be zero.
     */
    function mod(
        uint256 a,
        uint256 b,
        string memory errorMessage
    ) internal pure returns (uint256) {
        require(b > 0, errorMessage);
        return a % b;
    }
}

// File: browser/IERC20.sol

pragma solidity ^0.8.0;

/**
 * @dev Interface of the ERC20 standard as defined in the EIP.
 */
interface IERC20 {
    /**
     * @dev Returns the amount of tokens in existence.
     */
    function totalSupply() external view returns (uint256);

    /**
     * @dev Returns the amount of tokens owned by `account`.
     */
    function balanceOf(address account) external view returns (uint256);

    /**
     * @dev Moves `amount` tokens from the caller's account to `recipient`.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transfer(address recipient, uint256 amount)
        external
        returns (bool);

    /**
     * @dev Returns the remaining number of tokens that `spender` will be
     * allowed to spend on behalf of `owner` through {transferFrom}. This is
     * zero by default.
     *
     * This value changes when {approve} or {transferFrom} are called.
     */
    function allowance(address owner, address spender)
        external
        view
        returns (uint256);

    /**
     * @dev Sets `amount` as the allowance of `spender` over the caller's tokens.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * IMPORTANT: Beware that changing an allowance with this method brings the risk
     * that someone may use both the old and the new allowance by unfortunate
     * transaction ordering. One possible solution to mitigate this race
     * condition is to first reduce the spender's allowance to 0 and set the
     * desired value afterwards:
     * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
     *
     * Emits an {Approval} event.
     */
    function approve(address spender, uint256 amount) external returns (bool);

    function mint(address receipient, uint256 amount) external returns (bool);

    function burnFrom(address from, uint256 amount) external;

    /**
     * @dev Moves `amount` tokens from `sender` to `recipient` using the
     * allowance mechanism. `amount` is then deducted from the caller's
     * allowance.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external returns (bool);

    /**
     * @dev Emitted when `value` tokens are moved from one account (`from`) to
     * another (`to`).
     *
     * Note that `value` may be zero.
     */
    event Transfer(address indexed from, address indexed to, uint256 value);

    /**
     * @dev Emitted when the allowance of a `spender` for an `owner` is set by
     * a call to {approve}. `value` is the new allowance.
     */
    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );
}
// File: browser/LoserLotteryContract.sol

pragma solidity ^0.8.0;

contract LoserLotteryContract is IERC721Receiver,VRFConsumerBaseV2Plus, ReentrancyGuard {
    using Address for address;
    using SafeMath for uint256;

    struct LotteryConfig {
        uint256 numOfWinners;
        uint256 playersLimit;
        uint256 registrationAmount;
        uint256 adminFeePercentage;
        uint256 randomSeed;
        uint256 startedAt;
    }

    address[] public lotteryPlayers;
    address public feeAddress;
    enum LotteryStatus {
        NOTSTARTED,
        INPROGRESS,
        CLOSED
    }
    mapping(uint256 => address) public winnerAddresses;
    uint256[] public winnerIndexes;
    uint256 public totalLotteryPool;
    uint256 public adminFeesAmount;
    uint256 public rewardPoolAmount;

    uint256 public nftStartIndex;
    uint256 public nftEndIndex;
    uint256 public currentRewardIndex;

    IERC20 public lotteryToken;
    IERC20 public buyToken;
    ERC721 public rewardNFT;
    LotteryStatus public lotteryStatus;
    LotteryConfig public lotteryConfig;

    bytes32 internal keyHash;
    uint256 public currentReqId;
    uint256 public s_subscriptionId;
    uint256 internal randomResult;
    uint32 public callbackGasLimit = 100000;
    uint16 public requestConfirmations = 3;
    uint32 public numWords = 1;
    bool internal areWinnersGenerated;
    bool internal isRandomNumberGenerated;
    bool public pauseLottery;

    event MaxParticipationCompleted(address indexed _from);

    event RandomNumberGenerated(uint256 indexed randomness);

    event RequestSent(uint256 requestId, uint32 numWords);

    event WinnersGenerated(uint256[] winnerIndexes);

    event LotterySettled(
        uint256 _rewardId,
        uint256 _players,
        uint256 _adminFees
    );

    event LotteryPaused();

    event LotteryUnPaused();

    event EmergencyWithdrawn();

    event LotteryStarted(
        uint256 playersLimit,
        uint256 numOfWinners,
        uint256 registrationAmount,
        uint256 startedAt
    );

    event LotteryReset();

    /**
     * @dev Sets the value for adminAddress which establishes the Admin of the contract
     * Only the adminAddress will be able to set the lottery configuration,
     * start the lottery and reset the lottery.
     *
     * It also sets the required fees, keyHash etc. for the ChainLink Oracle RNG
     *
     * Also initializes the LOT ERC20 TOKEN that is minted/burned by the participating lottery players.
     *
     * The adminAdress value is immutable along with the initial
     * configuration of VRF Smart Contract. They can only be set once during
     * construction.
     */
    constructor(
        ERC721 _rewardNFT,
        IERC20 _lotteryToken, // Rechance Lottery token
        address _feeAddress,
        address _vrfCoordinator,
        bytes32 _keyHash,
        uint256 _subid
    )
        VRFConsumerBaseV2Plus(_vrfCoordinator)
    {
        // adminAddress = msg.sender;
        feeAddress = _feeAddress;
        lotteryStatus = LotteryStatus.NOTSTARTED;
        totalLotteryPool = 0;
        keyHash = _keyHash; // 0x6e75b569a01ef56d18cab6a8e71e6600d6ce853834d4a5748b720d06f878b3a4;
        areWinnersGenerated = false;
        isRandomNumberGenerated = false;
        rewardNFT = _rewardNFT;
        lotteryToken = _lotteryToken; // ERC20 contract
        s_subscriptionId = _subid;
    }


    function changeRewardNFT(ERC721 _newRewardNFT)
        public
        onlyOwner
    {
        rewardNFT = _newRewardNFT;
    }

    function pauseNextLottery() public onlyOwner {
        // require(
        //     msg.sender == adminAddress,
        //     "Starting the Lottery requires Admin Access"
        // );
        pauseLottery = true;
        emit LotteryPaused();
    }

    function unPauseNextLottery() public onlyOwner {
        // require(
        //     msg.sender == adminAddress,
        //     "Starting the Lottery requires Admin Access"
        // );
        pauseLottery = false;
        emit LotteryUnPaused();
        // resetLottery();
    }

    function changeFeeAddress(address _feeAddress) public onlyOwner {
        require(_feeAddress != address(0), "Incorrect fee address");
        feeAddress = _feeAddress;
    }

    function requestRandomWords(
        bool enableNativePayment
    ) internal returns (uint256 requestId) {
        // Will revert if subscription is not set and funded.
        requestId = s_vrfCoordinator.requestRandomWords(
            VRFV2PlusClient.RandomWordsRequest({
                keyHash: keyHash,
                subId: s_subscriptionId,
                requestConfirmations: requestConfirmations,
                callbackGasLimit: callbackGasLimit,
                numWords: numWords,
                extraArgs: VRFV2PlusClient._argsToBytes(
                    VRFV2PlusClient.ExtraArgsV1({
                        nativePayment: enableNativePayment
                    })
                )
            })
        );
        currentReqId = requestId;
        emit RequestSent(requestId, numWords);
        return requestId;
    }


    /**
     * @dev Calls ChainLink Oracle's inherited function for
     * Random Number Generation.
     *
     * Requirements:
     *
     * - the contract must have a balance of at least `fee` required for VRF.
     */
    function getRandomNumber()
        internal
        returns (uint256 requestId)
    {

        isRandomNumberGenerated = false;
        return requestRandomWords(false);
    }

    /**
     * @dev The callback function of ChainLink Oracle when the
     * Random Number Generation is completed. An event is fired
     * to notify the same and the randomResult is saved.
     *
     * Emits an {RandomNumberGenerated} event indicating the random number is
     * generated by the Oracle.
     *
     */
    function fulfillRandomWords(
        uint256 _requestId,
        uint256[] calldata _randomWords
    ) internal override {
        require(currentReqId == _requestId, "request not found");
        randomResult = _randomWords[0];

        if(randomResult < (10**lotteryConfig.numOfWinners)){
            randomResult = type(uint).max - randomResult;
        }
        isRandomNumberGenerated = true;

        emit RandomNumberGenerated(randomResult);
    }

    /**
     * @dev Sets the Lottery Config, initializes an instance of
     * ERC20 contract that the lottery is based on and starts the lottery.
     *
     * Emits an {LotteryStarted} event indicating the Admin has started the Lottery.
     *
     * Requirements:
     *
     * - Cannot be called if the lottery is in progress.
     * - Only the address set at `adminAddress` can call this function.
     * - Number of winners `numOfWinners` should be less than or equal to half the number of
     *   players `playersLimit`.
     */
    function setLotteryRules(
        uint256 numOfWinners,
        uint256 playersLimit,
        uint256 registrationAmount,
        uint256 adminFeePercentage,
        uint256 randomSeed
    ) public onlyOwner {
        // require(
        //     msg.sender == adminAddress,
        //     "Starting the Lottery requires Admin Access"
        // );
        require(
            lotteryStatus == LotteryStatus.NOTSTARTED,
            "Error: An existing lottery is in progress"
        );
        require(
            numOfWinners <= playersLimit.div(2),
            "Number of winners should be less than or equal to half the number of players"
        );
        lotteryConfig = LotteryConfig(
            numOfWinners,
            playersLimit,
            registrationAmount,
            adminFeePercentage,
            // lotteryTokenAddress,
            randomSeed,
            block.timestamp
        );
        lotteryStatus = LotteryStatus.INPROGRESS;
        // lotteryToken = IERC20(lotteryTokenAddress);
        emit LotteryStarted(
            // lotteryTokenAddress,
            playersLimit,
            numOfWinners,
            registrationAmount,
            block.timestamp
        );
    }

    /**
     * @dev Player enters the lottery and the registration amount is
     * transferred from the player to the contract.
     *
     * Returns participant's index. This is similar to unique registration id.
     * Emits an {MaxParticipationCompleted} event indicating that all the required players have entered the lottery.
     *
     * The participant is also issued an equal amount of LOT tokens once he registers for the lottery.
     * This LOT tokens are fundamental to the lottery contract and are used internally.
     * The winners will need to burn their LOT tokens to claim the lottery winnings.
     * The other participants of the lottery can keep hold of these tokens and use for other applications.
     *
     * Requirements:
     *
     * - The player has set the necessary allowance to the Contract.
     * - The Lottery is in progress.
     * - Number of players allowed to enter in the lottery should be
     *   less than or equal to the allowed players `lotteryConfig.playersLimit`.
     */
    function enterLottery() public returns (uint256) {
        require(
            lotteryPlayers.length < lotteryConfig.playersLimit,
            "Max Participation for the Lottery Reached"
        );

        // If lottery is paused, then do allow anyone to enter the lottery.
        if (lotteryPlayers.length == 0) {
            require(!pauseLottery, "Lottery is paused");
        }
        require(
            lotteryStatus == LotteryStatus.INPROGRESS,
            "The Lottery is not started or closed"
        );
        lotteryPlayers.push(msg.sender);

        lotteryToken.burnFrom(msg.sender, lotteryConfig.registrationAmount);
        totalLotteryPool = totalLotteryPool.add(
            lotteryConfig.registrationAmount
        );

        if (lotteryPlayers.length == lotteryConfig.playersLimit) {
            // emit MaxParticipationCompleted(msg.sender);
            getRandomNumber();
            // settleLottery();
        }
        return (lotteryPlayers.length).sub(1);
    }

    /**
     * @dev Settles the lottery, the winners are calculated based on
     * the random number generated. The Admin fee is calculated and
     * transferred back to Admin `adminAddress`.
     *
     * Emits an {WinnersGenerated} event indicating that the winners for the lottery have been generated.
     * Emits {LotterySettled} event indicating that the winnings have been transferred to the Admin and the Lottery is closed.
     *
     * Requirements:
     *
     * - The random number has been generated
     * - The Lottery is in progress.
     */
    function settleLottery() external {
        require(
            isRandomNumberGenerated,
            "Lottery Configuration still in progress. Please try in a short while"
        );
        require(
            lotteryStatus == LotteryStatus.INPROGRESS,
            "The Lottery is not started or closed"
        );
        uint256 winningIndex = 0;
        uint256 step = 1;
        for (uint256 i = 0; i < lotteryConfig.numOfWinners; i = i.add(1)) {
            winningIndex = randomResult.mod(lotteryConfig.playersLimit);
            if(winnerAddresses[winningIndex] != address(0)){
                randomResult = randomResult - step;
                winningIndex = randomResult.mod(lotteryConfig.playersLimit);
                while(winnerAddresses[winningIndex] != address(0)){
                    randomResult = randomResult + 1;
                    winningIndex = randomResult.mod(lotteryConfig.playersLimit);
                }    
            }

            winnerAddresses[winningIndex] = lotteryPlayers[winningIndex];
            winnerIndexes.push(winningIndex);
            step = randomResult % 10;
            randomResult = randomResult/10;
        }
        areWinnersGenerated = true;
        emit WinnersGenerated(winnerIndexes);
        // adminFeesAmount = (
        //     (totalLotteryPool.mul(lotteryConfig.adminFeePercentage)).div(100)
        // );
        // rewardPoolAmount = (totalLotteryPool.sub(adminFeesAmount)).div(
        //     lotteryConfig.numOfWinners
        // );
        lotteryStatus = LotteryStatus.CLOSED;

        emit LotterySettled(
            currentRewardIndex,
            lotteryConfig.numOfWinners,
            adminFeesAmount
        );
        // buyToken.transfer(adminAddress, adminFeesAmount);
        collectRewards();
    }

    function getCurrentlyActivePlayers() public view returns (uint256) {
        return lotteryPlayers.length;
    }

    /**
     * @dev The winners of the lottery can call this function to transfer their winnings
     * from the lottery contract to their own address. The winners will need to burn their
     * LOT tokens to claim the lottery rewards. This is executed by the lottery contract itself.
     *
     *
     * Requirements:
     *
     * - The Lottery is settled i.e. the lotteryStatus is CLOSED.
     */
    function collectRewards() private nonReentrant {
        // require(
        //     lotteryStatus == LotteryStatus.CLOSED,
        //     "The Lottery is not settled. Please try in a short while."
        // );
        bool isWinner = false;
        for (uint256 i = 0; i < lotteryConfig.playersLimit; i = i.add(1)) {
            address player = lotteryPlayers[i];
            // if (address(msg.sender) == winnerAddresses[winnerIndexes[i]]) {
            for (uint256 j = 0; j < lotteryConfig.numOfWinners; j = j.add(1)) {
                address winner = winnerAddresses[winnerIndexes[j]];

                if (winner != address(0) && winner == player) {
                    isWinner = true;
                    winnerAddresses[winnerIndexes[j]] = address(0);
                    break;
                }
            }

            if (isWinner) {
                // _burn(address(msg.sender), lotteryConfig.registrationAmount);
                // lotteryToken.burnFrom(msg.sender, lotteryConfig.registrationAmount);
                // if (isOnlyETHAccepted) {
                //     (bool status, ) = payable(player).call{
                //         value: rewardPoolAmount
                //     }("");
                //     require(status, "Amount not transferred to winner");
                // } else {
                rewardNFT.safeTransferFrom(address(this),address(player), currentRewardIndex);
                currentRewardIndex = currentRewardIndex + 1;
                // }
            }

            isWinner = false;
        }

        // If the lottery is not paused, then reset lottery to be playable continously
        // if (!pauseLottery) {
        resetLottery();
        // }
    }

    /**
     * @dev Generates a random number based on the blockHash and random offset
     */
    // function getRandomNumberBlockchain(uint256 offset, uint256 randomness)
    //     internal
    //     view
    //     returns (uint256)
    // {
    //     bytes32 offsetBlockhash = blockhash(block.number.sub(offset));
    //     uint256 randomBlockchainNumber = uint256(offsetBlockhash);
    //     uint256 finalRandomNumber = randomness + randomBlockchainNumber;
    //     if (finalRandomNumber >= randomness) {
    //         return finalRandomNumber;
    //     } else {
    //         if (randomness >= randomBlockchainNumber) {
    //             return randomness.sub(randomBlockchainNumber);
    //         }
    //         return randomBlockchainNumber.sub(randomness);
    //     }
    // }

    /**
     * It can be called by admin to withdraw all the amount in case of
     * any failure to play lottery. It will be distributed later on amongst the
     * participants.
     */
    function emergencyWithdraw() external onlyOwner {
        lotteryToken.transfer(
            msg.sender,
            lotteryToken.balanceOf(address(this))
        );

        emit EmergencyWithdrawn();
    }

    function rewardNFTWithdrawal(address _nft, uint tokenId) external onlyOwner {
        ERC721(_nft).safeTransferFrom(address(this),msg.sender, tokenId);
    }

    /**
     * @dev Resets the lottery, clears the existing state variable values and the lottery
     * can be initialized again.
     *
     * Emits {LotteryReset} event indicating that the lottery config and contract state is reset.
     *
     * Requirements:
     *
     * - Only the address set at `adminAddress` can call this function.
     * - The Lottery has closed.
     */
    function resetLottery() private {
        // require(
        //     msg.sender == adminAddress,
        //     "Resetting the Lottery requires Admin Access"
        // );
        // require(
        //     lotteryStatus == LotteryStatus.CLOSED,
        //     "Lottery Still in Progress"
        // );
        uint256 tokenBalance = lotteryToken.balanceOf(address(this));
        if (tokenBalance > 0) {
            buyToken.transfer(feeAddress, tokenBalance);
        }
        // delete lotteryConfig;
        delete randomResult;
        lotteryStatus = LotteryStatus.INPROGRESS;
        delete totalLotteryPool;
        delete adminFeesAmount;
        delete rewardPoolAmount;
        for (uint256 i = 0; i < lotteryPlayers.length; i = i.add(1)) {
            delete winnerAddresses[i];
        }
        isRandomNumberGenerated = false;
        areWinnersGenerated = false;
        delete winnerIndexes;
        delete lotteryPlayers;
        emit LotteryReset();
    }

    function onERC721Received(
        address operator, 
        address from, 
        uint256 id, 
        bytes calldata data
    ) external override returns (bytes4) {
        require(msg.sender == address(rewardNFT), "Wrong NFT");
        return this.onERC721Received.selector;
    }
}
