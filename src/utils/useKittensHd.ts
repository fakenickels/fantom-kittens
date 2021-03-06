import React from "react";
import * as ethers from "ethers";
import { useWallet } from "use-wallet";
import KittensHD from "../../artifacts/contracts/KittensHD.sol/KittensHD.json";
import { parseEther } from "@ethersproject/units";

export const getCostPerKittenByQuantity = (quantity: number) => {
  if (quantity >= 10) return parseEther("4.0");
  if (quantity >= 3) return parseEther("4.1");
  return parseEther("4.2");
};

export const useWeb3 = () => {
  const provider: React.MutableRefObject<
    ethers.providers.Web3Provider | undefined
  > = React.useRef();
  const contract: React.MutableRefObject<any | undefined> = React.useRef();

  React.useEffect(() => {
    provider.current = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.current.getSigner();

    contract.current = new ethers.Contract(
      process.env.NEXT_PUBLIC_KITTENS_HD_CONTRACT_ADDRESS as string,
      KittensHD.abi as any,
      signer
    );
  });

  return [provider, contract];
};

export const useKittenHDMethods = () => {
  const [, contract] = useWeb3();
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
    return contract.current.claim(quantity, {
      from: wallet?.account as string,
      value: getCostPerKittenByQuantity(Number(quantity)).mul(quantity),
    });
  };

  const ogClaim = async () => {
    return contract.current.ogClaim({
      from: wallet?.account as string,
    });
  };

  const honoraryClaim = async () => {
    return contract.current.honoraryClaim({
      from: wallet?.account as string,
    });
  };

  const getTotalSupply = () =>
    contract.current
      ?.totalSupply()
      .then((supply: string) => setTotalSupply(Number(supply)));

  // get list of user owned tokens using tokenOfOwnerByIndex
  const getUserTokens = async () => {
    const tokens = [];
    let index = 0;
    const owner = wallet?.account as string;
    const balance = await contract.current.balanceOf(owner);
    for (let i = 0; i < balance; i++) {
      const token = await contract.current.tokenOfOwnerByIndex(owner, index);
      tokens.push(token.toString());
      index++;
    }

    setUserTokens(tokens);
  };

  const getRKittenClaimCounter = () =>
    contract.current
      ?.getRKittenClaimCounter()
      .then((supply: string) => setRKittenClaimedCount(Number(supply)));

  const getHonoraryClaimCounter = () =>
    contract.current
      ?.getHonoraryClaimCounter()
      .then((supply: string) => setHonoraryClaimedCount(Number(supply)));

  const getDaoClaimCounter = () =>
    contract.current
      ?.getDaoClaimCounter()
      .then((supply: string) => setDaoClaimedCount(Number(supply)));

  const getGeneralMintCounter = () =>
    contract.current
      ?.getGeneralMintCounter()
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
