import "../styles/globals.css";
import type { AppProps } from "next/app";

import { UseWalletProvider } from "use-wallet";
import { Web3Provider } from "../src/utils/web3";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Web3Provider>
    <UseWalletProvider
      connectors={{
        injected: {
          // fantom mainnet and testnet
          chainId: [250, 0xfa2],
        },
      }}
    >
      <Component {...pageProps} />
    </UseWalletProvider>
</Web3Provider>
  );
}
export default MyApp;
