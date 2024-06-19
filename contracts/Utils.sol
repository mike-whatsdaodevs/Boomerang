// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import {Path} from "./libraries/Path.sol";

contract Utils {

    using Path for bytes;


    constructor() {}

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

    function decodeMultiPath(bytes memory path) public pure returns (address token0, address token1) {
        (token0, token1) = path.decode();
    }

    struct Params {
        uint256[] protocolTypes;
        address[] routers;
        bytes[] paths;
        address target;
        uint256 amountIn;
    }

    function paramsEncode(Params memory params) public view returns (bytes memory d) {
        d = abi.encode(params);
    }

    function paramsDecode(bytes memory params) public view returns (Params memory p) {
        p = abi.decode(params, (Params));
    }

}















