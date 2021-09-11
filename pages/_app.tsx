import "../styles/globals.css";
import type { AppProps } from "next/app";

import { UseWalletProvider } from "use-wallet";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <UseWalletProvider chainId={250} connectors={{}}>
      <Component {...pageProps} />
    </UseWalletProvider>
  );
}
export default MyApp;
