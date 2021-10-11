// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import '@openzeppelin/contracts/utils/math/SafeMath.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import "./RKITTEN.sol"; 

// The MasterKitten is a fork of MasterChef by SushiSwap and SpookySwap's version of it
// The biggest change made by SpookySwap's team is using per second instead of per block for rewards
// As stated in their original comments:
// "This is due to Fantoms extremely inconsistent block times
// The other biggest change was the removal of the migration functions"
//
// Note that it's ownable and the owner wields tremendous power.
// We have adapted the code for our specific purposes but we would like to thank SpookySwap's team for leading da way
// The biggest change we made is that our tokens were pre-minted and not emited during rewards only distributed accordingly
//

contract MasterKitten is Ownable {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    // Info of each user.
    struct UserInfo {
        uint256 amount;     // How many LP tokens the user has provided.
        uint256 rewardDebt; // Reward debt. See explanation below.
        //
        // We do some fancy math here. Basically, any point in time, the amount of RKITTENs
        // entitled to a user but is pending to be distributed is:
        //
        //   pending reward = (user.amount * pool.accRKITTENPerShare) - user.rewardDebt
        //
        // Whenever a user deposits or withdraws LP tokens to a pool. Here's what happens:
        //   1. The pool's `accRKITTENPerShare` (and `lastRewardBlock`) gets updated.
        //   2. User receives the pending reward sent to his/her address.
        //   3. User's `amount` gets updated.
        //   4. User's `rewardDebt` gets updated.
    }

    // Info of each pool.
    struct PoolInfo {
        IERC20 lpToken;           // Address of LP token contract.
        uint256 allocPoint;       // How many allocation points assigned to this pool. RKITTENs to distribute per block.
        uint256 lastRewardTime;  // Last block time that RKITTENs distribution occurs.
        uint256 accRKITTENPerShare; // Accumulated RKITTENs per share, times 1e12. See below.
    }

    // such a cute token!
    RKITTEN public rKITTEN;

    // Dev address.
    address public devaddr;
    // rKITTEN tokens created per block.
    uint256 public rKITTENPerSecond;

    // set a max rKITTEN per second, which can never be higher than 1 per second
    uint256 public constant maxRKittenPerSecond = 1e18;

    uint256 public constant MaxAllocPoint = 4000;

    // Info of each pool.
    PoolInfo[] public poolInfo;
    // Info of each user that stakes LP tokens.
    mapping (uint256 => mapping (address => UserInfo)) public userInfo;
    // Total allocation points. Must be the sum of all allocation points in all pools.
    uint256 public totalAllocPoint = 0;
    // The block time when rKITTEN mining starts.
    uint256 public immutable startTime;

    event Deposit(address indexed user, uint256 indexed pid, uint256 amount);
    event Withdraw(address indexed user, uint256 indexed pid, uint256 amount);
    event EmergencyWithdraw(address indexed user, uint256 indexed pid, uint256 amount);

    constructor(
        RKITTEN _rKITTEN,
        address _devaddr,
        uint256 _rKITTENPerSecond
    ) {
        rKITTEN = _rKITTEN;
        devaddr = _devaddr;
        rKITTENPerSecond = _rKITTENPerSecond;
        startTime = block.timestamp;
    }

    function poolLength() external view returns (uint256) {
        return poolInfo.length;
    }

    // Changes rKITTEN token reward per second, with a cap of maxrKITTEN per second
    // Good practice to update pools without messing up the contract
    function setRKittenPerSecond(uint256 _rKITTENPerSecond) external onlyOwner {
        require(_rKITTENPerSecond <= maxRKittenPerSecond, "setRKittenPerSecond: too many rKITTENs!");

        // This MUST be done or pool rewards will be calculated with new rKITTEN per second
        // This could unfairly punish small pools that dont have frequent deposits/withdraws/harvests
        massUpdatePools(); 

        rKITTENPerSecond = _rKITTENPerSecond;
    }

    function checkForDuplicate(IERC20 _lpToken) internal view {
        uint256 length = poolInfo.length;
        for (uint256 _pid = 0; _pid < length; _pid++) {
            require(poolInfo[_pid].lpToken != _lpToken, "add: pool already exists!!!!");
        }

    }

    // Add a new lp to the pool. Can only be called by the owner.
    function add(uint256 _allocPoint, IERC20 _lpToken) external onlyOwner {
        require(_allocPoint <= MaxAllocPoint, "add: too many alloc points!!");

        checkForDuplicate(_lpToken); // ensure you cant add duplicate pools

        massUpdatePools();

        uint256 lastRewardTime = block.timestamp > startTime ? block.timestamp : startTime;
        totalAllocPoint = totalAllocPoint.add(_allocPoint);
        poolInfo.push(PoolInfo({
            lpToken: _lpToken,
            allocPoint: _allocPoint,
            lastRewardTime: lastRewardTime,
            accRKITTENPerShare: 0
        }));
    }

    // Update the given pool's RKITTEN allocation point. Can only be called by the owner.
    function set(uint256 _pid, uint256 _allocPoint) external onlyOwner {
        require(_allocPoint <= MaxAllocPoint, "add: too many alloc points!!");

        massUpdatePools();

        totalAllocPoint = totalAllocPoint - poolInfo[_pid].allocPoint + _allocPoint;
        poolInfo[_pid].allocPoint = _allocPoint;
    }

    // Return reward multiplier over the given _from to _to block.
    function getMultiplier(uint256 _from, uint256 _to) public view returns (uint256) {
        _from = _from > startTime ? _from : startTime;
        if (_to < startTime) {
            return 0;
        }
        return _to - _from;
    }

    // View function to see pending RKITTENs on frontend.
    function pendingRKITTEN(uint256 _pid, address _user) external view returns (uint256) {
        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][_user];
        uint256 accRKITTENPerShare = pool.accRKITTENPerShare;
        uint256 lpSupply = pool.lpToken.balanceOf(address(this));
        if (block.timestamp > pool.lastRewardTime && lpSupply != 0) {
            uint256 multiplier = getMultiplier(pool.lastRewardTime, block.timestamp);
            uint256 rKITTENReward = multiplier.mul(rKITTENPerSecond).mul(pool.allocPoint).div(totalAllocPoint);
            accRKITTENPerShare = accRKITTENPerShare.add(rKITTENReward.mul(1e12).div(lpSupply));
        }
        return user.amount.mul(accRKITTENPerShare).div(1e12).sub(user.rewardDebt);
    }

    // Update reward variables for all pools. Be careful of gas spending!
    function massUpdatePools() public {
        uint256 length = poolInfo.length;
        for (uint256 pid = 0; pid < length; ++pid) {
            updatePool(pid);
        }
    }

    // Update reward variables of the given pool to be up-to-date.
    function updatePool(uint256 _pid) public {
        PoolInfo storage pool = poolInfo[_pid];
        if (block.timestamp <= pool.lastRewardTime) {
            return;
        }
        uint256 lpSupply = pool.lpToken.balanceOf(address(this));
        if (lpSupply == 0) {
            pool.lastRewardTime = block.timestamp;
            return;
        }
        // get the amount of seconds since the last reward
        uint256 multiplier = getMultiplier(pool.lastRewardTime, block.timestamp);
        uint256 rKITTENReward = multiplier.mul(rKITTENPerSecond).mul(pool.allocPoint).div(totalAllocPoint);

        pool.accRKITTENPerShare = pool.accRKITTENPerShare.add(rKITTENReward.mul(1e12).div(lpSupply));
        pool.lastRewardTime = block.timestamp;
    }

    // Deposit LP tokens to MasterChef for RKITTEN allocation.
    function deposit(uint256 _pid, uint256 _amount) public {

        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][msg.sender];

        updatePool(_pid);

        uint256 pending = user.amount.mul(pool.accRKITTENPerShare).div(1e12).sub(user.rewardDebt);

        user.amount = user.amount.add(_amount);
        user.rewardDebt = user.amount.mul(pool.accRKITTENPerShare).div(1e12);

        if(pending > 0) {
            safeRKITTENTransfer(msg.sender, pending);
        }
        pool.lpToken.safeTransferFrom(address(msg.sender), address(this), _amount);

        emit Deposit(msg.sender, _pid, _amount);
    }

    // Withdraw LP tokens from MasterChef.
    function withdraw(uint256 _pid, uint256 _amount) public {  
        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][msg.sender];

        require(user.amount >= _amount, "withdraw: not good");

        updatePool(_pid);

        uint256 pending = user.amount.mul(pool.accRKITTENPerShare).div(1e12).sub(user.rewardDebt);

        user.amount = user.amount.sub(_amount);
        user.rewardDebt = user.amount.mul(pool.accRKITTENPerShare).div(1e12);

        if(pending > 0) {
            safeRKITTENTransfer(msg.sender, pending);
        }
        pool.lpToken.safeTransfer(address(msg.sender), _amount);
        
        emit Withdraw(msg.sender, _pid, _amount);
    }

    // Withdraw without caring about rewards. EMERGENCY ONLY.
    function emergencyWithdraw(uint256 _pid) public {
        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][msg.sender];

        uint oldUserAmount = user.amount;
        user.amount = 0;
        user.rewardDebt = 0;

        pool.lpToken.safeTransfer(address(msg.sender), oldUserAmount);
        emit EmergencyWithdraw(msg.sender, _pid, oldUserAmount);

    }

    // Safe rKITTEN transfer function, just in case if rounding error causes pool to not have enough RKITTENs.
    function safeRKITTENTransfer(address _to, uint256 _amount) internal {
        uint256 rKITTENBal = rKITTEN.balanceOf(address(this));
        if (_amount > rKITTENBal) {
            rKITTEN.transfer(_to, rKITTENBal);
        } else {
            rKITTEN.transfer(_to, _amount);
        }
    }

    // Update dev address by the previous dev.
    function dev(address _devaddr) public {
        require(msg.sender == devaddr, "dev: wut?");
        devaddr = _devaddr;
    }
}