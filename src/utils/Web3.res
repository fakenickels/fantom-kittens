type txn = {
  transactionHash: string
}

type claim = int => Js.Promise.t<txn>
type ownerOf = (.int) => Js.Promise.t<string>

type contractMethods = {
  claim,
  ownerOf,
  totalSupply: option<int>
}

@module("./web3.tsx")
external useContractMethods: unit => option<contractMethods> = "useContractMethods"

@genType
type useWalletApi = {
  connect: (. [#injected]) => Js.Promise.t<unit>,
  status: [#connected | #connecting | #disconnected | #error],
  account: Js.Nullable.t<string>,
}

@genType.import("use-wallet")
external useWallet: unit => useWalletApi = "useWallet"
