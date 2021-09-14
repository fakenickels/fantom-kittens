import React from "react";
import Web3 from "web3";
import { useWallet } from "use-wallet";
import fantomKittens from "../../artifacts/contracts/FantomKittens.sol/FantomKittens.json";

export const price = 4.2e18;
export const maxSupply = 420;

export const Web3Context = React.createContext<{
  france: null | Web3,
  contract: null | any
}>({
  france: null,
  contract: null,
})

export const Web3Provider = ({children}: {children: any}) => {
  const [france, setFrance] = React.useState<null | Web3>(null);
  const [contract, setContract] = React.useState<null | any>(null);

  React.useEffect(() => {
    const newFrance = new Web3(window.ethereum)
    setFrance(newFrance);
    setContract(window.contract = new newFrance.eth.Contract(
      fantomKittens.abi as any,
      process.env.NEXT_PUBLIC_CONTRACT_ADDRESS
    ))
  }, []);

  return (
    <Web3Context.Provider value={{france, contract}}>
      {children}
    </Web3Context.Provider>
  )
}

export const useWeb3 = () => {
  return React.useContext(Web3Context)
};

export const useContractMethods = () => {
  const {contract} = useWeb3();

  const wallet = useWallet();
  
  const claim = async (tokenId: number, tokenPrice: number) => {
    console.log(contract?.methods.claim, contract, "contract")
    return contract?.methods.claim(tokenId).send({
      from: wallet?.account as string,
      value: tokenPrice || price,
    });
  };

  const ownerOf = (token: number) => {
    return contract?.methods.ownerOf(token).call()
  }

  return contract ? {claim, ownerOf} : undefined;
};
