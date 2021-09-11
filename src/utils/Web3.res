type claim = unit => unit
@module("./web3.ts")
external useClaim: unit => claim = "useClaim"

@genType
type useWalletApi = {
  connect: (. [#injected]) => Js.Promise.t<unit>,
  status: [#connected | #connecting | #disconnected | #error],
  account: option<string>,
}

@genType.import("use-wallet")
external useWallet: unit => useWalletApi = "useWallet"
