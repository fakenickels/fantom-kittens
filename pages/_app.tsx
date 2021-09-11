import "../styles/globals.css";
import type { AppProps } from "next/app";

import { UseWalletProvider } from "use-wallet";

function MyApp({ Component, pageProps }: AppProps) {
  return (
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
  );
}
export default MyApp;
