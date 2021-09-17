type returnValues = {
  tokenId: string,
}
type transfer = {
  returnValues,
}
type events = {
  @as("Transfer")
  transfer,
}
type txn = {
  events,
  transactionHash: string
}

type claim = unit => Js.Promise.t<txn>

type contractMethods = {
  claim,
  getTotalSupply: unit => Js.Promise.t<unit>,
  totalSupply: option<int>
}

@module("./web3.ts")
external useContractMethods: unit => contractMethods = "useContractMethods"

@genType
type useWalletApi = {
  connect: (. [#injected]) => Js.Promise.t<unit>,
  status: [#connected | #connecting | #disconnected | #error],
  account: Js.Nullable.t<string>,
}

@genType.import("use-wallet")
external useWallet: unit => useWalletApi = "useWallet"
