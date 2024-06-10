// SPDX-License-Identifier: MIT
pragma solidity >=0.8.14;

interface IVault {
    function profit(address target, address token, uint256 amount) external;
}
