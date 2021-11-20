import React from "react";
import Web3 from "web3";
import { useWallet } from "use-wallet";
import KittensHD from "../../artifacts/contracts/KittensHD.sol/KittensHD.json";

export const useWeb3 = () => {
  const france: React.MutableRefObject<Web3 | undefined> = React.useRef();
  const contract: React.MutableRefObject<any | undefined> = React.useRef();

  React.useEffect(() => {
    france.current = new Web3(window.ethereum);
    contract.current = new france.current.eth.Contract(
      KittensHD.abi as any,
      process.env.NEXT_PUBLIC_CONTRACT_ADDRESS
    );
  });

  return [france, contract];
};

export const useContractMethods = () => {
  const [_france, contract] = useWeb3();
  const [totalSupply, setTotalSupply] = React.useState<undefined | number>();

  const wallet = useWallet();

  const claim = async (quantity: string, price: string) => {
    return contract.current.methods.claim(quantity).send({
      from: wallet?.account as string,
      value: price,
    });
  };

  const ogClaim = async () => {
    return contract.current.methods.ogClaim().send({
      from: wallet?.account as string,
    });
  };

  return { claim, ogClaim };
};
