import React from "react";
import Web3 from "web3";
import masterKittenABI from "@spookyswap/core/build/UniswapV2Pair.json"

interface Reserves {
  reserve0: number;
  reserve1: number;
  _blockTimestampLast: number;
}
export const useRKittenFTMPair = () => {
  const france: React.MutableRefObject<Web3 | undefined> = React.useRef();
  const contract: React.MutableRefObject<any | undefined> = React.useRef();

  const [reserves, setReserves] = React.useState<Reserves | null>(null);
  const [balance, setBalance] = React.useState<number | null>(null);

  React.useEffect(() => {
    france.current = new Web3(window.ethereum);
    contract.current = new france.current.eth.Contract(
      masterKittenABI.abi as any,
      process.env.NEXT_PUBLIC_LP_PAIR_CONTRACT_ADDRESS
    );
  }, []);

  const getReserves = (): number => {
    return contract.current?.methods.getReserves().call().then((res: any) => {
      setReserves({
        reserve0: res[0],
        reserve1: res[1],
        _blockTimestampLast: res[2],
      })
    });
  }

  const getBalance = (wallet: string): Promise<number> => {
    return contract.current?.methods.balanceOf(wallet).call().then((res: any) => {
      setBalance(res);
      return res;
    });
  }

  const approve = (wallet: string, spender: string, amount: string): Promise<any> => {
    return contract.current?.methods.approve(spender, amount).send({
      from: wallet,
    });
  }


  return {
    getReserves,
    getBalance,
    balance,
    reserves,
    approve,
  }
}