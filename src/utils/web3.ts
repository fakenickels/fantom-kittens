import React from 'react'
import Web3 from 'web3';
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
    // contract.current?.methods.totalSupply().call().then(setRemaining);
  });

  return [france, contract]
}

export const useClaim = () => {
  const [_france, contract] = useWeb3()
  const [isClaiming, setIsClaiming] = React.useState(false);
  
  const wallet = useWallet();

  const claim = async () => {
    setIsClaiming(true);
    try {
      const claimTxn = await contract.current.methods
        .claim()
        .send({
          from: wallet?.account as string,
          value: price,
        })
        .then();
      console.log(claimTxn)
    } finally {
      setIsClaiming(false);
    }
  };

  return claim
}