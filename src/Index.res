type claimingStatus = Idle | Claiming | Claimed(Web3.txn) | Error

type ls

@val
external localStorage: ls = "localStorage"

@send
external setItem: (ls, ~key: string, ~value: string) => unit = "setItem"

@send
external getItem: (ls, string) => Js.Null_undefined.t<string> = "getItem"

@react.component
let make = () => {
  let wallet = Web3.useWallet()
  let contract = Web3.useContractMethods()
  let (lastTxns: array<Web3.txn>, setLastTxns) = React.useState(() => [])
  let (claimingStatus, setClaimingStatus) = React.useState(() => Idle)

  React.useEffect0(() => {
    let _ = contract.getTotalSupply()
    None
  })

  React.useEffect0(() => {
    setLastTxns(_ => {
      let data = localStorage->getItem("TXNS")
      switch data->Js.Null_undefined.toOption {
      | None => []
      | Some(data) => Obj.magic(Js.Json.parseExn(data))
      }
    })
    None
  })

  React.useEffect1(() => {
    if lastTxns->Js.Array2.length > 0 {
      localStorage->setItem(~key="TXNS", ~value=Js.Json.stringifyAny(lastTxns)->Belt.Option.getExn)
    }

    None
  }, [lastTxns->Js.Array2.length])

  let claim = () => {
    setClaimingStatus(_ => Claiming)
    let _ = wallet.connect(. #injected)
    let _ =
      contract.claim()
      |> Js.Promise.then_(txn => {
        Js.log(txn)
        let _ = contract.getTotalSupply()
        setLastTxns(lastTxns => {
          lastTxns->Js.Array2.concat([txn])
        })
        setClaimingStatus(_ => Claimed(txn))
        Js.Promise.resolve()
      })
      |> Js.Promise.catch(error => {
        if (
          Obj.magic(
            error,
          )["message"] !== "MetaMask Tx Signature: User denied transaction signature."
        ) {
          setClaimingStatus(_ => Error)
        } else {
          setClaimingStatus(_ => Idle)
        }
        Js.Promise.resolve()
      })
  }

  <div className="px-0 md:px-16 pb-12">
    <div className="flex flex-col items-center">
      <Next.Head> <title> {"Fantom Kittens"->React.string} </title> </Next.Head>
      <div className="w-full">
        <Next.Image src={Next.require(`../public/assets/bannerkittenrs.png`)} />
      </div>
      <h1 className="text-6xl font-semibold py-10 px-2">
        {<span className="text-transparent bg-clip-text bg-gradient-to-br from-blue-500 to-red-500">
          {"Welcome to "->React.string}
        </span>}
        {<span
          className="text-transparent bg-clip-text bg-gradient-to-br from-yellow-500 to-green-500">
          {"Fantom Kittens"->React.string}
        </span>}
      </h1>
      <div className="container flex flex-col-reverse md:flex-row flex-wrap">
        <div className="p-2 w-full md:p-10 md:w-6/12">
          <p>
            {"420 NFT kittens are now released into the Fantom Network wilderness! This is a claiming website where you can claim a proceduraly generated kitten for only 4.20 FTM each. There are over 15.000 parts combinations and millions of colors possibilities, but only 420 out of all possible combinations will exist and live in the Fantom Network!"->React.string}
          </p>
          <br />
          <a className="text-purple-700 underline" href="https://discord.gg/WmyrjCrZyR">
            {"Join our discord"->React.string}
          </a>
          <span>
            {" to interact with the Fantom Kittens community and keep up-to-date future FakeWorms Studio projects!"->React.string}
          </span>
          <br />
          <br />
          <span> {"Made with <3 by "->React.string} </span>
          <a className="text-purple-700 underline" href="https://twitter.com/fakenickels">
            {"@fakenickels"->React.string}
          </a>
          <span> {" and "->React.string} </span>
          <a className="text-purple-700 underline" href="https://twitter.com/MarcoWorms">
            {"@marcoworms"->React.string}
          </a>
          <br />
          <br />
          <span> {"Explore, buy, and sell all claimed kittens at "->React.string}</span>
          <a className="text-purple-700 underline" href="https://paintswap.finance/nfts/collections/0xfD211f3B016a75bC8d73550aC5AdC2f1cAE780C0">
            {"PaintSwap NFT Market"->React.string}
          </a>
        </div>
        {switch wallet.status {
        | #disconnected
        | #connecting =>
          <div className="p-2 w-full md:w-6/12 flex items-center justify-center">
            <button
              type_="button"
              className="bg-blue-500 py-5 px-10 uppercase text-white font-bold"
              disabled={wallet.status == #connecting}
              onClick={_ => {
                let _ = wallet.connect(. #injected)
              }}>
              {"Connect wallet"->React.string}
            </button>
          </div>
        | #error => `Something went wrong. Try reloading your page.`->React.string
        | #connected =>
          <div className="p-2 w-full md:w-6/12">
            <p className="text-xl text-blue-500 pb-5">
              {switch contract.totalSupply {
              | None => "..."->React.string
              | Some(420) => "All 420 kittens were claimed! Thanks everyone!"->React.string
              | Some(totalSupply) =>
                `Claimed kittens: ${totalSupply->string_of_int}/420`->React.string
              }}
            </p>
            <p className="text-xl text-green-500 pb-10">
              {`Hello, ${wallet.account
                ->Js.Nullable.toOption
                ->Belt.Option.getWithDefault("")}`->React.string}
            </p>
            {switch contract.totalSupply {
            | Some(420) => React.null
            | _ =>
              <button
                type_="button"
                className={`bg-green-500 py-5 px-5 uppercase text-white font-bold mt-auto w-[400px] min-w-[400px] ${claimingStatus ==
                    Claiming
                    ? "pointer-events-none opacity-75"
                    : ""}`}
                disabled={wallet.status == #connecting}
                onClick={_ => {
                  claim()
                }}>
                {{
                  claimingStatus == Claiming ? "Claiming..." : `Claim one kitten for 4.20 FTM`
                }->React.string}
              </button>
            }}
            {lastTxns->Js.Array2.length == 0
              ? React.null
              : <h3 className="text-green-500 mt-10">
                  {"Your last minted kittens"->React.string}
                </h3>}
            <ul className="text-green-500 my-5">
              {lastTxns
              ->Js.Array2.map(txn => {
                <li className="flex flex-row">
                  <a
                    href={`/assets/${KittensDict.getFileNameByIndex(
                        txn.events.transfer.returnValues.tokenId->int_of_string->Obj.magic,
                      )}`}
                    target="_blank">
                    <Next.Image
                      src={`/assets/${KittensDict.getFileNameByIndex(
                          txn.events.transfer.returnValues.tokenId->int_of_string->Obj.magic,
                        )}`}
                      layout=#fixed
                      width=50.
                      height=50.
                    />
                  </a>
                  <a
                    href={`https://ftmscan.com/tx/${txn.transactionHash}`}
                    className="underline pl-5 text-md"
                    target="_blank">
                    {`You claimed Kitten #${txn.events.transfer.returnValues.tokenId}`->React.string}
                  </a>
                </li>
              })
              ->React.array}
            </ul>
          </div>
        }}
      </div>
    </div>
  </div>
}
