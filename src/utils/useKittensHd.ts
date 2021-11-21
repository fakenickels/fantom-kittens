import React from "react";
import Web3 from "web3";
import { useWallet } from "use-wallet";
import KittensHD from "../../artifacts/contracts/KittensHD.sol/KittensHD.json";
import { parseEther } from "@ethersproject/units";

export const getCostPerKittenByQuantity = (quantity: number) => {
  if (quantity >= 10) return parseEther("4.0");
  if (quantity >= 3) return parseEther("4.1");
  return parseEther("4.2");
};

export const useWeb3 = () => {
  const france: React.MutableRefObject<Web3 | undefined> = React.useRef();
  const contract: React.MutableRefObject<any | undefined> = React.useRef();

  React.useEffect(() => {
    france.current = new Web3(window.ethereum);
    contract.current = new france.current.eth.Contract(
      KittensHD.abi as any,
      process.env.NEXT_PUBLIC_KITTENS_HD_CONTRACT_ADDRESS
    );
  });

  return [france, contract];
};

export const useKittenHDMethods = () => {
  const [_france, contract] = useWeb3();
  const [totalSupply, setTotalSupply] = React.useState<undefined | number>();
  const [rKittenClaimedCount, setRKittenClaimedCount] = React.useState<
    undefined | number
  >();
  const [honoraryClaimedCount, setHonoraryClaimedCount] = React.useState<
    undefined | number
  >();
  const [daoClaimedCount, setDaoClaimedCount] = React.useState<
    undefined | number
  >();
  const [generalClaimedCount, setGeneralClaimedCount] = React.useState<
    undefined | number
  >();

  const [userTokens, setUserTokens] = React.useState<string[]>([]);

  const wallet = useWallet();

  const claimKittens = async (quantity: number | string) => {
    return contract.current.methods.claim(quantity).send({
      from: wallet?.account as string,
      value: getCostPerKittenByQuantity(Number(quantity)).mul(quantity),
    });
  };

  const ogClaim = async () => {
    return contract.current.methods.ogClaim().send({
      from: wallet?.account as string,
    });
  };

  const honoraryClaim = async () => {
    return contract.current.methods.honoraryClaim().send({
      from: wallet?.account as string,
    });
  };

  const getTotalSupply = () =>
    contract.current?.methods
      .totalSupply()
      .call()
      .then((supply: string) => setTotalSupply(Number(supply)));

  // get list of user owned tokens using tokenOfOwnerByIndex
  const getUserTokens = async () => {
    const tokens = [];
    let index = 0;
    const owner = wallet?.account as string;
    const balance = await contract.current.methods.balanceOf(owner).call();
    for (let i = 0; i < balance; i++) {
      const token = await contract.current.methods
        .tokenOfOwnerByIndex(owner, index)
        .call();
      tokens.push(token);
      index++;
    }

    setUserTokens(tokens);
  };

  const getRKittenClaimCounter = () =>
    contract.current?.methods
      .getRKittenClaimCounter()
      .call()
      .then((supply: string) => setRKittenClaimedCount(Number(supply)));

  const getHonoraryClaimCounter = () =>
    contract.current?.methods
      .getHonoraryClaimCounter()
      .call()
      .then((supply: string) => setHonoraryClaimedCount(Number(supply)));

  const getDaoClaimCounter = () =>
    contract.current?.methods
      .getDaoClaimCounter()
      .call()
      .then((supply: string) => setDaoClaimedCount(Number(supply)));

  const getGeneralMintCounter = () =>
    contract.current?.methods
      .getGeneralMintCounter()
      .call()
      .then((supply: string) => setGeneralClaimedCount(Number(supply)));

  return {
    getRKittenClaimCounter,
    getHonoraryClaimCounter,
    getDaoClaimCounter,
    getGeneralMintCounter,
    rKittenClaimedCount,
    daoClaimedCount,
    honoraryClaimedCount,
    generalClaimedCount,
    claimKittens,
    ogClaim,
    honoraryClaim,
    getTotalSupply,
    totalSupply,
    userTokens,
    getUserTokens,
  };
};
