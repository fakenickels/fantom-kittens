import React from "react";
import Web3 from "web3";
import masterKittenABI from "../../artifacts/contracts/MasterKitten.sol/MasterKitten.json";
import {BigNumber} from "ethers"

interface PoolInfo {
  lpToken: string;
  allocPoint: number;
  lastRewardTime: number;
  accRKITTENPerShare: number;
}

interface UserInfo {
  amount: number;
  rewardDebt: number;
}


export const useMasterKitten = () => {
  const france: React.MutableRefObject<Web3 | undefined> = React.useRef();
  const masterKittenContract: React.MutableRefObject<any | undefined> =
    React.useRef();

  const [poolInfo, setPoolInfo] = React.useState<PoolInfo | null>(null);
  const [pendingRKITTEN, setPendingRKITTEN] = React.useState<number>(0);
  const [userInfo, setUserInfo] = React.useState<UserInfo | null>(null);

  React.useEffect(() => {
    france.current = new Web3(window.ethereum);
    masterKittenContract.current = new france.current.eth.Contract(
      masterKittenABI.abi as any,
      process.env.NEXT_PUBLIC_MASTER_KITTEN_CONTRACT_ADDRESS
    );
  }, []);

  const getPoolInfo = (index: number): PoolInfo => {
    return masterKittenContract.current?.methods
      .poolInfo(index)
      .call()
      .then((poolInfo: PoolInfo) => setPoolInfo(poolInfo));
  };

  const getPendingRKITTEN = (poolIndex: number, user: string): number => {
    return masterKittenContract.current?.methods
      .pendingRKITTEN(poolIndex, user)
      .call()
      .then((pendingRKITTEN: number) => setPendingRKITTEN(pendingRKITTEN));
  };

  const getUserInfo = (poolId: number, wallet: string): Promise<UserInfo> => {
    return masterKittenContract.current?.methods.userInfo(poolId, wallet).call().then((res: any) => {
      console.log(res)
      setUserInfo({
        amount: res[0],
        rewardDebt: res[1],
      });
      return res;
    });
  }

  const withdraw = (wallet: string, poolId: number, amount: BigNumber): Promise<any> => {
    console.log(amount)
    console.log(amount.toString())
    return masterKittenContract.current?.methods.withdraw(poolId, amount).send({from: wallet});
  }

  const deposit = (wallet: string, poolId: number, amount: BigNumber): Promise<any> => {
    return masterKittenContract.current?.methods.deposit(poolId, amount).send({from: wallet});
  }

  return {
    getPoolInfo,
    poolInfo,
    getUserInfo,
    userInfo,
    getPendingRKITTEN,
    pendingRKITTEN,
    withdraw,
    deposit,
  };
};
