// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.4;

import "./ERC20.sol";

contract ERC20Def is ERC20 {
    constructor(string memory name, string memory initials, uint initialAmount) ERC20(name, initials) {
        _mint(msg.sender, initialAmount);
    }

    function mint(address to,uint256 amount) external{
        _mint(to, amount);
    }
}