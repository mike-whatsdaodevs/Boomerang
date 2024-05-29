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

import {FlashLoanSimpleReceiverBase} from "@aave/core-v3/contracts/flashloan/base/FlashLoanSimpleReceiverBase.sol";
import {IPoolAddressesProvider} from "@aave/core-v3/contracts/interfaces/IPoolAddressesProvider.sol";

contract Boomerang is FlashLoanSimpleReceiverBase, Ownable {

    using UniswapAdapter for address;
    using TransferHelper for address;
    using Address for address;

    address public weth9;

    uint24[] private fees = [100, 500, 3000, 10000];

    constructor(address _weth, address _addressProvider) 
        FlashLoanSimpleReceiverBase(IPoolAddressesProvider(_addressProvider))
    {
        weth9 = _weth;
    }

    function getSinglePath(address token0, address token1, uint24 fee) public view returns (bytes memory path) {
        path = abi.encodePacked(token0, fee, token1);
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

    function swapV2(
        address uniswapRouter,
        uint256 amountIn,
        uint256 amountOutMin,
        address[] calldata path,
        address to
    ) public payable returns (uint256) {
        require(path.length >= 2, "PA6");
        uint256 amountOut = uniswapRouter.uniswapV2(amountIn, amountOutMin, path, to, msg.value);
        return amountOut;
    }

    function swapV3Single(
        address uniswapRouter,
        ISwapRouter02.ExactInputSingleParams calldata params
    ) external payable returns (uint256) {
        uint256 amountOut = uniswapRouter.uniswapV3Single(params, msg.value);
        return amountOut;
    }

    function swapV3ExactInput(
        address uniswapRouter,
        ISwapRouter02.ExactInputParams calldata params
    ) external payable returns (uint256) {
        uint256 amountOut = uniswapRouter.uniswapV3(params, msg.value);
        return amountOut;
    }


    function safeApprove(address token, address protocol) external {
        token.safeApprove(protocol, type(uint256).max);
    }


    struct Params {
        uint256[] protocolTypes;
        address[] routers;
        bytes[] paths;
        address token;
        uint256 amountIn;
        address pair_address;
        bytes tokenAndAmountOut;
    }

    function encodePair(address token, uint256 amount) external view returns (bytes memory) {
        return abi.encode(token, amount);
    }

    function swapSingleCall(
        Params memory params
    ) external payable returns (uint256 amountOut) {
        uint256 amountIn = params.amountIn;
        if (params.token != weth9 || msg.value == 0) {
            params.token.safeTransferFrom(msg.sender, address(this), amountIn);
        }

        uint256 value = msg.value;
        uint256 length = params.protocolTypes.length;
        for(uint256 i; i < length; i ++) {
            if(i == 1) {
               (address pairToken, uint pairOut) = abi.decode(params.tokenAndAmountOut, (address, uint256));
               pairToken.safeTransfer(params.pair_address, amountIn);
               IUniswapV2Pair(params.pair_address).swap(0, pairOut, address(this), new bytes(0));
               amountIn = pairOut;
            }
            uint256 protocolType = params.protocolTypes[i];
            if(protocolType == 2) {
                address[] memory v2Path = abi.decode(params.paths[i], (address[]));
                amountOut = params.routers[i].uniswapV2(amountIn, 0, v2Path, address(this), value);
            }
            if(protocolType == 3) {
                IV3SwapRouter.ExactInputParams memory exactParams = IV3SwapRouter.ExactInputParams(
                    params.paths[i], 
                    address(this),
                    amountIn,
                    0
                );
                amountOut = params.routers[i].uniswapV3(exactParams, value);
            }
            amountIn = amountOut;
            value = 0;
        }
    }

    function swapSingleCallByFlashLoan(
        Params memory params
    ) public returns (uint256 amountOut) {
        uint256 amountIn = params.amountIn;

        uint256 value = 0;
        uint256 length = params.protocolTypes.length;
        for(uint256 i; i < length; i ++) {
            if(i == 1) {
               (address pairToken, uint pairOut) = abi.decode(params.tokenAndAmountOut, (address, uint256));
               pairToken.safeTransfer(params.pair_address, amountIn);
               IUniswapV2Pair(params.pair_address).swap(0, pairOut, address(this), new bytes(0));
               amountIn = pairOut;
            }
            uint256 protocolType = params.protocolTypes[i];
            if(protocolType == 2) {
                address[] memory v2Path = abi.decode(params.paths[i], (address[]));
                amountOut = params.routers[i].uniswapV2(amountIn, 0, v2Path, address(this), value);
            }
            if(protocolType == 3) {
                IV3SwapRouter.ExactInputParams memory exactParams = IV3SwapRouter.ExactInputParams(
                    params.paths[i], 
                    address(this),
                    amountIn,
                    0
                );
                amountOut = params.routers[i].uniswapV3(exactParams, value);
            }
            amountIn = amountOut;
            value = 0;
        }
    }

          //This function is called after your contract has received the flash loaned amount

    // function encodeV2Calldata(uint256 amountIn, address[] memory path) public view returns (bytes memory data) {
    //     return abi.encodeCall(
    //         IV2SwapRouter.swapExactTokensForTokens,
    //         (
    //             amountIn,
    //             0,
    //             path,
    //             address(this)
    //         )
    //     );
    // }

    // function encodeV3Calldata(uint256 amountIn, bytes memory path) public view returns (bytes memory data) {
    //     IV3SwapRouter.ExactInputParams memory params = IV3SwapRouter.ExactInputParams(
    //         path, 
    //         address(this),
    //         amountIn,
    //         0
    //     );
    //     return abi.encodeCall(
    //         IV3SwapRouter.exactInput,
    //         (
    //             params
    //         )
    //     );
    // }

    function paramsEncode(Params memory params) public view returns (bytes memory d) {
        d = abi.encode(params);
    }

    function paramsDecode(bytes memory params) public view returns (Params memory p) {
        p = abi.decode(params, (Params));
    }

     /// force withdraw token balance
    function recovery(address token, address recipient) external onlyOwner {
        uint256 balance = IERC20(token).balanceOf(address(this));
        token.safeTransfer(recipient, balance);
    }

    /// token 0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619 weth
    /// wmatic 0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270
    function requestFlashLoan(address _token, uint256 _amount, bytes memory params) public {
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
        
        //Logic goes here
        
        uint256 totalAmount = amount + premium;
        IERC20(asset).approve(address(POOL), totalAmount);

        return true;
    }

    receive() external payable {}

}















