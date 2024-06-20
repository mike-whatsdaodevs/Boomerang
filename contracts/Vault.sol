// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import {SafeMath} from "@openzeppelin/contracts/utils/math/SafeMath.sol";
import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {PausableUpgradeable} from "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import {IERC20Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import {IVault} from "./interfaces/IVault.sol";
import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

contract Vault is
	IVault,
    OwnableUpgradeable, 
    PausableUpgradeable, 
    UUPSUpgradeable 
{
    using SafeMath for uint256;
    uint256 constant public USDT_DECIMALS = 1E6;
    address immutable public USDT;

    address public boomerang;

	mapping(address => uint256) public members;
	uint256 public totalMembers;
	//// token => member => amount
	mapping(address => mapping(address => uint256)) public profits;
	mapping(address => uint256) public usdtProfits;
	//// token => profit
	mapping(address => uint256) public tokenProfits;
	/// member => timestamp
	mapping(address => uint256) public lastClaimedTimestamp;
	uint256 public interval;
	/// token => amount
	uint256 public maximumProfit;

	struct OracleData {
		address pricefeed;
		uint256 decimals;
	}
	mapping(address => OracleData) public oracles;
	mapping(address => uint256) public tokenDecimals;
	uint256 public totalProfit;

	event Profit(address target, address token, uint256 amount, uint256 timestamp);

    constructor(address usdt_address) {
        _disableInitializers();
        USDT = usdt_address;
    }

    modifier OnlyBoomerang() {
    	require(msg.sender == boomerang, "E: caller is not boomerang");
    	_;
    }

    function verifyTimestamp(address addr) internal {
    	require(
    		nextClaimTimestamp(addr) <= block.timestamp,
    		"E: timestamp error"
    	);
    	lastClaimedTimestamp[addr] = block.timestamp;
    }

    function verifyProfit(uint256 profit) internal {
    	require(profit <= maximumProfit, "E: profit too large");
    }

    receive() external payable {}

    function initialize() external initializer {
        __Pausable_init();
        __Ownable_init();
        __UUPSUpgradeable_init();
        interval = 1 days;
        maximumProfit = 10E6;
    }

    function setBoomerang(address _boomerang) external onlyOwner {
    	boomerang = _boomerang;
    }

	function setMember(address member, uint256 value) external onlyOwner {
		members[member] = value;
	}

	function addMemberValue(address member, uint256 value) public onlyOwner {
		members[member] += value;
		totalMembers ++;
	}

	function batchAddMemberValue(address[] memory memberArr, uint256[] memory valueArr) external onlyOwner {
		uint256 length = memberArr.length;
		for(uint256 i; i < length; i ++) {
			addMemberValue(memberArr[i], valueArr[i]);
		}
	}

	function profit(address target, address token, uint256 amount) external OnlyBoomerang {
		verifyTimestamp(target);
	 	uint256 usdtValue = calculateUSDWealth(token, amount);
	 	verifyProfit(usdtValue);

		profits[token][target] += amount;
		usdtProfits[target] += usdtValue;
		tokenProfits[token] += amount;

		totalProfit += usdtValue;

		require(usdtProfits[target] <= members[target], "E:exceed ceiling");

		emit Profit(target, token, amount, block.timestamp);
	}

	function nextClaimTimestamp(address addr) public view returns (uint256) {
		return lastClaimedTimestamp[addr] + interval;
	}

	function setInterval(uint256 newInterval) external onlyOwner {
		interval = newInterval;
	}

	function setMaximumProfit(uint256 newMaximumProfit) external onlyOwner {
		maximumProfit = newMaximumProfit;
	}

	function setOracle(address token, address pricefeed, uint256 decimals) external onlyOwner {
		OracleData memory oracleData = OracleData(pricefeed, decimals);
		oracles[token] = oracleData;
	}

	function setTokenDecimals(address token, uint256 decimals) external onlyOwner {
		tokenDecimals[token] = decimals;
	}

	function getLinkDecimals(address feed) public view returns (uint8) {
        return AggregatorV3Interface(feed).decimals();
    }

    function getTokenPrice(address pricefeed) internal view returns (int) {
        (
            /* uint80 roundID */,
            int answer,
            /*uint startedAt*/,
            /*uint timeStamp*/,
            /*uint80 answeredInRound*/
        ) = AggregatorV3Interface(pricefeed).latestRoundData();
        return answer;
    }

    function calculateUSDWealth(address tokenIn, uint256 amountIn) public view returns (uint256) {
    	if(tokenIn == USDT) {
    		return amountIn;
    	}
        OracleData memory oracleData = oracles[tokenIn];
        int answer = getTokenPrice(oracleData.pricefeed);
        uint256 tokenInDecimal = tokenDecimals[tokenIn];
        return amountIn.mul(USDT_DECIMALS).mul(uint(answer)) / tokenInDecimal.mul(oracleData.decimals);
    }

	 /// uups interface
    function _authorizeUpgrade(address newImplementation)
        internal
        override
        view
        onlyOwner
    { }
}