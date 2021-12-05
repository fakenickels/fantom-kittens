import React from "react";
import { useWallet } from "use-wallet";
import * as ethers from "ethers";
import { getCostPerKittenByQuantity } from "./useKittensHd";
import KittensHDMinter from "../../artifacts/contracts/KittensHDPublicMinter.sol/KittensHDPublicMinter.json";

export const useWeb3 = () => {
  const provider: React.MutableRefObject<
    ethers.providers.Web3Provider | undefined
  > = React.useRef();
  const contract: React.MutableRefObject<any | undefined> = React.useRef();

  React.useEffect(() => {
    provider.current = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.current.getSigner();
    contract.current = new ethers.Contract(
      process.env.NEXT_PUBLIC_KITTENS_HD_MINTER_ADDRESS as string,
      KittensHDMinter.abi as any,
      signer
    );
  });

  return [provider, contract];
};

export const useKittenHDMinterMethods = () => {
  const [, contract] = useWeb3();

  const wallet = useWallet();

  const claimKittens = async (quantity: number | string) => {
    return contract.current.claim(quantity).send({
      from: wallet?.account as string,
      value: getCostPerKittenByQuantity(Number(quantity)).mul(quantity),
    });
  };

  return {
    claimKittens,
  };
};
