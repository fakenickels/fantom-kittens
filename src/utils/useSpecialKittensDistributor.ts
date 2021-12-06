import React from "react";
import * as ethers from "ethers";
import Contract from "../../artifacts/contracts/SpecialKittensDistributor.sol/SpecialKittensDistributor.json";

export const useWeb3 = () => {
  const provider: React.MutableRefObject<
    ethers.providers.Web3Provider | undefined
  > = React.useRef();
  const contract: React.MutableRefObject<any | undefined> = React.useRef();

  React.useEffect(() => {
    provider.current = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.current.getSigner();
    contract.current = new ethers.Contract(
      process.env.NEXT_PUBLIC_SPECIAL_DISTRIBUTOR_ADDRESS as string,
      Contract.abi as any,
      signer
    );
  });

  return [provider, contract];
};

export const useSpecialClaim = () => {
  const [, contract] = useWeb3();

  const claimKittens = async () => {
    return contract.current.claim().then((res: any) => {
      return res.wait();
    });
  };

  return {
    claimKittens,
  };
};
