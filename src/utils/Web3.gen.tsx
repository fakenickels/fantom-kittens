/* TypeScript file generated from Web3.res by genType. */
/* eslint-disable import/first */


import {useWallet as useWalletNotChecked} from 'use-wallet';

// In case of type error, check the type of 'useWallet' in 'Web3.re' and 'use-wallet'.
export const useWalletTypeChecked: () => useWalletApi = useWalletNotChecked;

// Export 'useWallet' early to allow circular import from the '.bs.js' file.
export const useWallet: unknown = useWalletTypeChecked as () => useWalletApi;

// tslint:disable-next-line:interface-over-type-literal
export type useWalletApi = {
  readonly connect: (_1:
    "injected") => Promise<void>; 
  readonly status: 
    "error"
  | "connected"
  | "disconnected"
  | "connecting"; 
  readonly account: (null | undefined | string)
};
