// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@spookyswap/core/contracts/interfaces/IUniswapV2Router02.sol";

contract HellKitten is ERC20 {
    IUniswapV2Router02 public routerContract;
    address public routerAddress;

    struct ProgrammedBurn {
        address fromToken;
        uint256 fromTokenAmount;
        uint256 amountOutOfRKITTEN;
        uint256 dateOfBurn;
        uint256 burnedAt;
        address sender;
    }

    address rKITTEN = 0x07e796368aC8480F74B57EBA6391733eDE0dCad7;

    mapping(uint256 => ProgrammedBurn) public programmedBurns;

    constructor() public ERC20("Hell Kitten", "hKITTEN") {
        routerAddress = 0xF491e7B69E4244ad4002BC14e878a34207E38c29;
        routerContract = IUniswapV2Router02(routerAddress);
    }

    function burn(uint256 burnId) external {
        require(programmedBurns[burnId].dateOfBurn != 0, "Burn doesn't exist");
        ProgrammedBurn memory programmedBurn = programmedBurns[burnId];
        require(programmedBurn.dateOfBurn >= block.timestamp, "Not yet");

        uint256 minTokensToBurn = estimateRKITTENToBurnFromLPReserves(
            programmedBurn.fromToken,
            programmedBurn.fromTokenAmount
        );

        // interactions
        programmedBurns[burnId].burnedAt = block.timestamp;
        programmedBurns[burnId].sender = msg.sender;
        programmedBurns[burnId].amountOutOfRKITTEN = minTokensToBurn;

        // effects
        swapTokenForRKITTEN(
            programmedBurn.fromToken,
            programmedBurn.fromTokenAmount,
            minTokensToBurn
        );

        uint256 totalRKITTEN = ERC20(rKITTEN).balanceOf(address(this));

        // burn all kittens to the rKITTEN contract. Am I going to hell for this?
        ERC20(rKITTEN).transferFrom(address(this), rKITTEN, totalRKITTEN);

        // mint the same amount of hKITTEN to the sender as a reward
        _mint(msg.sender, totalRKITTEN);
    }

    function estimateRKITTENToBurnFromLPReserves(
        address token,
        uint256 amountIn
    ) public view returns (uint256) {
        address[] memory path = new address[](3);

        path[0] = token;
        path[1] = routerContract.WETH();
        path[2] = rKITTEN;

        uint256[] memory amounts = routerContract.getAmountsOut(amountIn, path);

        return amounts[2];
    }

    function swapTokenForRKITTEN(
        address token,
        uint256 amountIn,
        uint256 amountOutMin
    ) internal {
        address[] memory path = new address[](3);
        path[0] = token;
        path[1] = routerContract.WETH();
        path[2] = rKITTEN;

        // effects
        routerContract.swapExactTokensForTokens(
            amountIn,
            amountOutMin,
            path,
            address(this),
            block.timestamp
        );
    }
}
