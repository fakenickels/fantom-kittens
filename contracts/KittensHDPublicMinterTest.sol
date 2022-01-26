// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
import "./KittensHD.sol";
import "./KittensHDPublicMinter.sol";

interface Cheater {
  function startPrank(address sender) external;

  function prank(address sender) external;

  function deal(address who, uint256 amount) external;
}

contract KittensHDPublicMinterTest {
  KittensHDPublicMinter publicKittensHD;
  Cheater cheater;
  address depositAddress = 0xC748E6dE30222F4e9bC01812860FF005A82543E6;

  function setUp() public {
    KittensHD kittensHD = new KittensHD();
    publicKittensHD = new KittensHDPublicMinter(
      address(kittensHD),
      depositAddress
    );

    cheater = Cheater(0x7109709ECfa91a80626fF3989D68f67F5b1DD12D);

    kittensHD.grantDAOMemberRole(address(publicKittensHD));
  }

  function testClaim() public {
    cheater.startPrank(0xC10F558700972312119afBc7b6eBEdDc8e8ef4BC);
    cheater.deal(0xC10F558700972312119afBc7b6eBEdDc8e8ef4BC, 4.2 ether);
    publicKittensHD.claim{value: 4.2 ether}(1);
    require(depositAddress.balance == 4.2 ether, "profit not received");
  }
}
