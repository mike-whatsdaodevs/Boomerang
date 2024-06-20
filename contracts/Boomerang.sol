// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import {IQuoterV2} from "./interfaces/IQuoterV2.sol";
import {UniswapV2Library} from "./libraries/UniswapV2Library.sol";
import {SushiV2Library} from "./libraries/SushiV2Library.sol";
import {UniswapAdapter, ISwapRouter02} from "./UniswapAdapter.sol";
import {IV2SwapRouter} from "./interfaces/IV2SwapRouter.sol";
import {IV3SwapRouter} from "./interfaces/IV3SwapRouter.sol";
import {TransferHelper, IERC20} from "./TransferHelper.sol";
import {Address} from '@openzeppelin/contracts/utils/Address.sol';
import {IUniswapV2Pair} from "./interfaces/IUniswapV2Pair.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IVault} from "./interfaces/IVault.sol";
import {IWETH9} from "./interfaces/IWETH9.sol";

import {FlashLoanSimpleReceiverBase} from "@aave/core-v3/contracts/flashloan/base/FlashLoanSimpleReceiverBase.sol";
import {IPoolAddressesProvider} from "@aave/core-v3/contracts/interfaces/IPoolAddressesProvider.sol";

contract Boomerang is FlashLoanSimpleReceiverBase, Ownable {

    using UniswapAdapter for address;
    using TransferHelper for address;
    using Address for address;

    address public weth9;
    address public vault;

    uint24[] private fees = [100, 500, 3000, 10000];

    error PairError(address token, address pair);

    mapping(address => bool) public whitelistProtocol;

    mapping(address => uint256) public volume;

    constructor(address _weth, address _vault, address _addressProvider) 
        FlashLoanSimpleReceiverBase(IPoolAddressesProvider(_addressProvider))
    {
        weth9 = _weth;
        vault = _vault;
    }

    modifier onlyWhiltelist(address protocol) {
        require(whitelistProtocol[protocol], "E: protocol is not allowed");
        _;
    }

    function getSinglePath(address token0, address token1, uint24 fee) public view returns (bytes memory path) {
        path = abi.encodePacked(token0, fee, token1);
    }

    function setProtocolWhitelist(address protocol, bool status) external onlyOwner {
        whitelistProtocol[protocol] = status;
    }

    function getMultiPath(address[] memory tokens, uint24[] memory fees) public view returns (bytes memory path) {
        uint256 length = tokens.length;
        require(length >= 2, "E: length error");
        path = abi.encodePacked(tokens[0], fees[0], tokens[1]);

        for(uint256 i = 2; i < length; ++i) {
            path = abi.encodePacked(path, fees[i - 1], tokens[i]);
        }
    }

    function getExactInAmountOut(
        IQuoterV2 quoter,
        bytes memory path,
        uint256 amount
    )
        public
        returns (
            uint256 expectedAmount,
            uint160[] memory sqrtPriceX96AfterList,
            uint32[] memory initializedTicksCrossedList,
            uint256 gasEstimate
        )
    {
        try quoter.quoteExactInput(path, amount) returns (
            uint256 amountOut,
            uint160[] memory afterList,
            uint32[] memory crossedList,
            uint256 gas
        ) {
            expectedAmount = amountOut;
            sqrtPriceX96AfterList = afterList;
            initializedTicksCrossedList = crossedList;
            gasEstimate = gas;
        } catch {}
     
    }


    function getExactInputSingleAmountOut(
        IQuoterV2 quoter,
        IQuoterV2.QuoteExactInputSingleParams memory params
    ) public returns (
        uint256 eAmount,
        uint160 eSqrtPriceX96After,
        uint32 eInitializedTicksCrossed,
        uint256 eGasEstimate
    ) {
        try quoter.quoteExactInputSingle(params) returns (
            uint256 amountOut,
            uint160 sqrtPriceX96After,
            uint32 initializedTicksCrossed,
            uint256 gasEstimate
        ) {
            eAmount = amountOut;
            eSqrtPriceX96After = sqrtPriceX96After;
            eInitializedTicksCrossed = initializedTicksCrossed;
            eGasEstimate = gasEstimate;
        } catch {}
    }

    function getUniswapV2AmountOut(
        address uniswapV2Factory,
        address token0,
        address token1,
        uint256 amount
    ) public view returns (uint256 amountOut) {
        (uint reserve0, uint reserve1) = UniswapV2Library.getReserves(uniswapV2Factory, token0, token1);
        amountOut = UniswapV2Library.getAmountOut(amount, reserve0, reserve1);
    }

    function getUniswapV2AmountsOut(
        address uniswapV2Factory,
        address[] memory path,
        uint256 amount
    ) public view returns (uint256[] memory amountsOut) {
        amountsOut = UniswapV2Library.getAmountsOut(uniswapV2Factory, amount, path);
    }

    function getSushiV2AmountOut(
        address uniswapV2Factory,
        address token0,
        address token1,
        uint256 amount
    ) public view returns (uint256 amountOut) {
        (uint reserve0, uint reserve1) = SushiV2Library.getReserves(uniswapV2Factory, token0, token1);
        amountOut = SushiV2Library.getAmountOut(amount, reserve0, reserve1);
    }

    function getSushiV2AmountsOut(
        address uniswapV2Factory,
        address[] memory path,
        uint256 amount
    ) public view returns (uint256[] memory amountsOut) {
        amountsOut = SushiV2Library.getAmountsOut(uniswapV2Factory, amount, path);
    }

    function safeApprove(address token, address protocol) external onlyWhiltelist(protocol) {
        token.safeApprove(protocol, type(uint256).max);
    }

    struct Params {
        uint256[] protocolTypes;
        address[] routers;
        bytes[] paths;
        address target;
        uint256 amountIn;
    }

    // function swapSingleCall(
    //     Params memory params
    // ) internal payable returns (uint256 amountOut) {
    //     uint256 amountIn = params.amountIn;
    //     // if (params.token != weth9 || msg.value == 0) {
    //     //     params.token.safeTransferFrom(msg.sender, address(this), amountIn);
    //     // }
    //     uint256 value = msg.value;
    //     uint256 length = params.protocolTypes.length;
    //     for(uint256 i; i < length; i ++) {
    //         uint256 protocolType = params.protocolTypes[i];
    //         if(protocolType == 1) {
    //            amountOut = pairSwap(params.routers[i], amountIn, params.paths[i]);
    //         }
    //         if(protocolType == 2) {
    //             amountOut = univ2Swap(params.routers[i], amountIn, value, params.paths[i]);
    //         }
    //         if(protocolType == 3) {
    //             amountOut = univ3Swap(params.routers[i], amountIn, value, params.paths[i]);
    //         }
    //         amountIn = amountOut;
    //         value = 0;
    //     }
    // }

    function pairSwap(address pair, uint256 amountIn, bytes memory data) internal returns (uint256 amountOut) {
        (uint256 requiredAmountOut, address requiredTokenOut) = abi.decode(data, (uint, address));
        address token0 = IUniswapV2Pair(pair).token0();
        address token1 = IUniswapV2Pair(pair).token1();
        uint256 amount0Out;
        uint256 amount1Out;
        if (requiredTokenOut == token0) {
            token1.safeTransfer(pair, amountIn);
            amount0Out = requiredAmountOut;
        } else if (requiredTokenOut == token1) {
            token0.safeTransfer(pair, amountIn);
            amount1Out = requiredAmountOut;
        } else {
            revert PairError(requiredTokenOut, pair);
        }
        IUniswapV2Pair(pair).swap(amount0Out, amount1Out, address(this), new bytes(0));
        amountOut = requiredAmountOut;
    }

    function univ2Swap(address router, uint256 amountIn, uint256 value, bytes memory data) internal returns (uint256 amountOut) {
        (address[] memory v2Path, uint256 amountOutMin) = abi.decode(data, (address[], uint256));
        amountOut = router.uniswapV2(amountIn, amountOutMin, v2Path, address(this), value);
    }

    function univ3Swap(address router, uint256 amountIn, uint256 value, bytes memory data) internal returns (uint256 amountOut) {
        (bytes memory path, uint256 amountOutMin) = abi.decode(data, (bytes, uint256));
        IV3SwapRouter.ExactInputParams memory exactParams = IV3SwapRouter.ExactInputParams(
            path, 
            address(this),
            amountIn,
            amountOutMin
        );
        amountOut = router.uniswapV3(exactParams, value);
    }

    function swapSingleCallByFlashLoan(
        Params memory params
    ) internal returns (uint256 amountOut) {
        uint256 amountIn = params.amountIn;
        uint256 length = params.protocolTypes.length;
        for(uint256 i; i < length; i ++) {
            uint256 protocolType = params.protocolTypes[i];
            if(protocolType == 1) {
               amountOut = pairSwap(params.routers[i], amountIn, params.paths[i]);
            }
            if(protocolType == 2) {
                amountOut = univ2Swap(params.routers[i], amountIn, 0, params.paths[i]);
            }
            if(protocolType == 3) {
                amountOut = univ3Swap(params.routers[i], amountIn, 0, params.paths[i]);
            }
            amountIn = amountOut;
        }
    }

    function paramsEncode(Params memory params) public view returns (bytes memory d) {
        d = abi.encode(params);
    }

    function paramsDecode(bytes memory params) public view returns (Params memory p) {
        p = abi.decode(params, (Params));
    }

    //  /// force withdraw token balance
    // function recovery(address token, address recipient) external onlyOwner {
    //     uint256 balance = IERC20(token).balanceOf(address(this));
    //     token.safeTransfer(recipient, balance);
    // }

    function requestFlashLoan(address _token, uint256 _amount, bytes memory params) external {
        volume[_token] += _amount;
        address receiverAddress = address(this);
        address asset = _token;
        uint256 amount = _amount;
        /// bytes memory params = "";
        uint16 referralCode = 0;

        POOL.flashLoanSimple(
            receiverAddress,
            asset,
            amount,
            params,
            referralCode
        );
    }

    function  executeOperation(
        address asset,
        uint256 amount,
        uint256 premium,
        address initiator,
        bytes calldata params
    )  external override returns (bool) {

        Params memory p = paramsDecode(params);
        swapSingleCallByFlashLoan(p);
        
        uint256 totalAmount = amount + premium;
        IERC20(asset).approve(address(POOL), totalAmount);

        uint256 tokenBalance = IERC20(asset).balanceOf(address(this));

        uint256 profit = tokenBalance - totalAmount;
        IVault(vault).profit(p.target, asset, profit);

        if(asset == weth9) {
            IWETH9(asset).withdraw(profit);
            payable(p.target).transfer(profit);
            return true;
        } 
        IERC20(asset).transfer(p.target, profit);
        return true;
    }


    function setVault(address _vault) external onlyOwner {
        vault = _vault;
    }

    receive() external payable {}

}















