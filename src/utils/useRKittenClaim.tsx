import React from "react";
import { useWallet } from "use-wallet";
import * as ethers from "ethers";
import KittensHDMinter from "../../artifacts/contracts/KittensHDPublicMinter.sol/KittensHDPublicMinter.json";
import rKittenMerkleRootSnaptshot from "../../airdrop/kittens-hd-rkitten-airdrop/merkle-root.json";

export const useWeb3 = () => {
  const provider: React.MutableRefObject<
    ethers.providers.Web3Provider | undefined
  > = React.useRef();
  const contract: React.MutableRefObject<any | undefined> = React.useRef();

  React.useEffect(() => {
    provider.current = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.current.getSigner();
    contract.current = new ethers.Contract(
      process.env.NEXT_PUBLIC_KITTENS_MERKLE_DISTRIBUTOR_ADDRESS as string,
      KittensHDMinter.abi as any,
      signer
    );
  });

  return [provider, contract];
};

export const useRKittenClaim = () => {
  const [, contract] = useWeb3();

  const wallet = useWallet();

  const claimKittens = async () => {
    const proof: {
      index: number;
      amount: string;
      proof: string[];
    } = (rKittenMerkleRootSnaptshot as any).claims[wallet?.account as string];
    return contract.current.claim(Number(proof.amount), {
      from: wallet?.account as string,
    });
  };

  // check if wallet.address is in the rKittenMerkleRootSnaptshot
  const getLeaf = () => {
    return wallet?.account
      ? (rKittenMerkleRootSnaptshot as any).claims[wallet.account as string]
      : false;
  };

  return {
    claimKittens,
    getLeaf,
  };
};
