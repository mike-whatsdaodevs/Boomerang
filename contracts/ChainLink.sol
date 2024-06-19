// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";
import {SafeMath} from "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
/**
 * THIS IS AN EXAMPLE CONTRACT THAT USES HARDCODED
 * VALUES FOR CLARITY.
 * THIS IS AN EXAMPLE CONTRACT THAT USES UN-AUDITED CODE.
 * DO NOT USE THIS CODE IN PRODUCTION.
 */

/**
 * If you are reading data feeds on L2 networks, you must
 * check the latest answer from the L2 Sequencer Uptime
 * Feed to ensure that the data is accurate in the event
 * of an L2 sequencer outage. See the
 * https://docs.chain.link/data-feeds/l2-sequencer-feeds
 * page for details.
 */

contract ChainLink {

    using SafeMath for uint256;
    uint256 constant public USDT_DECIMALS = 1E6;
    struct OracleData {
        address pricefeed;
        uint256 decimals;
    }
    mapping(address => OracleData) public oracles;
    mapping(address => uint256) public tokenDecimals;

    /**
     * Returns the latest answer.
     */
    function getChainlinkDataFeedLatestAnswer(address feed) public view returns (int) {
        // prettier-ignore
        (
            /* uint80 roundID */,
            int answer,
            /*uint startedAt*/,
            /*uint timeStamp*/,
            /*uint80 answeredInRound*/
        ) = AggregatorV3Interface(feed).latestRoundData();
        return answer;
    }

    function getLinkDecimals(address feed) public view returns (uint8) {
        return AggregatorV3Interface(feed).decimals();
    }

    function setOracle(address token, address pricefeed, uint256 decimals) external {
        OracleData memory oracleData = OracleData(pricefeed, decimals);
        oracles[token] = oracleData;
    }

    function setTokenDecimals(address token, uint256 decimals) external {
        tokenDecimals[token] = decimals;
    }

    function getTokenPrice(address pricefeed) public view returns (int) {
        (
            /* uint80 roundID */,
            int answer,
            /*uint startedAt*/,
            /*uint timeStamp*/,
            /*uint80 answeredInRound*/
        ) = AggregatorV3Interface(pricefeed).latestRoundData();
        return answer;
    }

    function calculateUSDWealth(address tokenIn, uint256 amountIn) public view returns (uint256 amountOut) {
        OracleData memory oracleData = oracles[tokenIn];
        int answer = getTokenPrice(oracleData.pricefeed);
        uint256 tokenInDecimal = tokenDecimals[tokenIn];
        amountOut = amountIn.mul(USDT_DECIMALS).mul(uint(answer)) / tokenInDecimal.mul(oracleData.decimals);
    }

  
}