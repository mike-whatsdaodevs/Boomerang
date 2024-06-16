// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import {SafeMath} from "@openzeppelin/contracts/utils/math/SafeMath.sol";
import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {PausableUpgradeable} from "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import {IERC20Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import {IVault} from "./interfaces/IVault.sol";
import {IWETH9} from "./interfaces/IWETH9.sol";
contract Vault is
	IVault,
    OwnableUpgradeable, 
    PausableUpgradeable, 
    UUPSUpgradeable 
{
    using SafeMath for uint256;

    address public boomerang;
	
	mapping(address => uint256) public members;
	mapping(address => uint256) public profits;
	mapping(address => uint256) public claimed;
	uint256 public tokenReserve;
	address public profitToken;

	uint256 public totalProfit;
	uint256 public totalClaimed;

	mapping(address => uint256) public lastClaimedTimestamp;
	uint256 public interval;
	uint256 public maximumProfit;

	event Profit(address target, address token, uint256 amount, uint256 currentProfit, uint256 timestamp);

    constructor() {
        _disableInitializers();
    }

    modifier OnlyMembers(address addr) {
    	require(members[addr] > 0, "E: address is not member");
    	_;
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

    function initialize(address _profitToken) external initializer {
        __Pausable_init();
        __Ownable_init();
        __UUPSUpgradeable_init();
        profitToken = _profitToken;
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
	}

	function batchAddMemberValue(address[] memory memberArr, uint256[] memory valueArr) external onlyOwner {
		uint256 length = memberArr.length;
		for(uint256 i; i < length; i ++) {
			addMemberValue(memberArr[i], valueArr[i]);
		}
	}

	function profit(address target, address token, uint256 amount) external OnlyBoomerang OnlyMembers(target) {
		require(token == profitToken, "E: token error");
		verifyTimestamp(target);
		verifyProfit(amount);

		uint256 tokenBalance = IERC20Upgradeable(token).balanceOf(address(this));
		/// save gas
		uint256 currentReserve = tokenReserve + amount;
		require(currentReserve <= tokenBalance, "E: amount error");
		tokenReserve = currentReserve;
		
		uint256 profit = profits[target] + amount;
		require(profit + claimed[target] <= members[target], "E: profit exceed maximum");
		profits[target] = profit;

		totalProfit += profit;
		emit Profit(target, token, amount, profit, block.timestamp);
	}

	function claim() external OnlyMembers(msg.sender) {
		uint256 profit = profits[msg.sender];
		require(profit > 0, "E: profit is zero");

		IERC20Upgradeable(profitToken).transfer(msg.sender, profit);
		profits[msg.sender] = 0;
		claimed[msg.sender] += profit;
		tokenReserve -= profit;
		totalClaimed += profit;
	}

	function forceWithdrawERC20(address token, address recipient) external onlyOwner {
		uint256 balance = IERC20Upgradeable(token).balanceOf(address(this));
		IERC20Upgradeable(token).transfer(recipient, balance);
	}

	function forceWithdrawNative(address weth9, address recipient) external onlyOwner {
		uint256 balance = IERC20Upgradeable(weth9).balanceOf(address(this));
        if (balance > 0) {
            IWETH9(weth9).withdraw(balance);
        }

        uint256 ethBalance = address(this).balance;
       	payable(recipient).transfer(balance + ethBalance);
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

	function sync() external {
		tokenReserve = IERC20Upgradeable(profitToken).balanceOf(address(this));
    }

	 /// uups interface
    function _authorizeUpgrade(address newImplementation)
        internal
        override
        view
        onlyOwner
    { }
}