import Web3 from "web3";
import pair from "@spookyswap/core/build/UniswapV2Pair.json";
import masterKittenABI from "../../artifacts/contracts/MasterKitten.sol/MasterKitten.json";

export default function fetcher(url: string, wallet: string, data: any) {
  if(!wallet) return null

  const france = new Web3(window.ethereum);
  const rKITTENPairContract = new france.eth.Contract(
    pair.abi as any,
    process.env.NEXT_PUBLIC_LP_PAIR_CONTRACT_ADDRESS
  );
  const masterKittenContract = new france.eth.Contract(masterKittenABI.abi as any, process.env.NEXT_PUBLIC_MASTER_KITTEN_CONTRACT_ADDRESS);

  switch (url) {
    case "rKITTENPairFTM/allowance":
      return rKITTENPairContract.methods.allowance(wallet, process.env.NEXT_PUBLIC_MASTER_KITTEN_CONTRACT_ADDRESS).call()
  }
}
