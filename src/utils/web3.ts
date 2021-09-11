import React from "react";
import Web3 from "web3";
import { useWallet } from "use-wallet";
import fantomKittens from "../../artifacts/contracts/FantomKittens.sol/FantomKittens.json";

export const price = 4.2e18;
export const maxSupply = 420;

export const useWeb3 = () => {
  const france: React.Ref<Web3 | null> = React.useRef(null);
  const contract: React.Ref<any> = React.useRef(null);

  React.useEffect(() => {
    france.current = new Web3(window.ethereum);
    contract.current = new france.current.eth.Contract(
      fantomKittens.abi,
      process.env.NEXT_PUBLIC_CONTRACT_ADDRESS
    );
    window.contract = contract.current;
    window.france = france.current;
  });

  return [france, contract];
};

export const useContractMethods = () => {
  const [_france, contract] = useWeb3();
  const [totalSupply, setTotalSupply] = React.useState()

  const wallet = useWallet();

  const claim = async () => {
    return contract.current.methods.claim().send({
      from: wallet?.account as string,
      value: price,
    });
  };

  const getTotalSupply = () => contract.current?.methods.totalSupply().call().then(setTotalSupply);

  return {claim, getTotalSupply, totalSupply};
};
