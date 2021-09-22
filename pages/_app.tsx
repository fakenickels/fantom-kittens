import "../styles/globals.css";
import type { AppProps } from "next/app";

import { UseWalletProvider } from "use-wallet";
import Head from "next/head";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Open+Sans&family=Press+Start+2P&display=swap"
          rel="stylesheet"
        />
      </Head>
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
    </>
  );
}
export default MyApp;
