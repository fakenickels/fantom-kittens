module Kitten = {
  type claimStatus = Loading | ClaimedBy(string) | Available
  @react.component
  let make = (~item, ~index) => {
    let wallet = Web3.useWallet()
    let contract = Web3.useContractMethods()
    let (claimStatus, setClaimedBy) = React.useState(() => Loading)

    let userWallet = wallet.account->Js.Nullable.toOption->Belt.Option.getWithDefault("")

    React.useEffect1(() => {
      switch contract {
      | Some(contract) =>
        let _ =
          contract.ownerOf(. index)
          |> Js.Promise.then_(addr => {
            setClaimedBy(_ => ClaimedBy(addr))
            Js.Promise.resolve()
          })
          |> Js.Promise.catch(_ => {
            setClaimedBy(_ => Available)

            Js.Promise.resolve()
          })
      | None => ()
      }
      None
    }, [contract->Belt.Option.isNone])

    <>
      <div
        className={`flex flex-col items-center m-4 bg-black w-96 ${switch claimStatus {
          | ClaimedBy(_) => "opacity-75 pointer-events-none"
          | _ => ""
          }}`}>
        <Next.Image layout=#fixed key={item} width=200. height=200. src={`/assets/${item}`} />
        <button
          type_="button"
          className="bg-green-500 py-5 px-5 uppercase text-white font-bold mt-2 block"
          disabled={wallet.status == #connecting || claimStatus == Loading}
          onClick={_ => {
            switch contract {
            | Some(contract) =>
              let _ = wallet.connect(. #injected)
              let _ =
                contract.claim(index)
                |> Js.Promise.then_(_ => {
                  setClaimedBy(_ => ClaimedBy(userWallet))
                  Js.Promise.resolve()
                })
                |> Js.Promise.catch(_ => {
                  setClaimedBy(_ => Available)

                  Js.Promise.resolve()
                })
            | None => ()
            }
          }}>
          {switch claimStatus {
          | Loading
          | Available =>
            `Claim Kitten #${(index + 1)->string_of_int} for 4.2 FTM`->React.string
          | ClaimedBy(addr) =>
            `Owned by ${addr == userWallet
                ? "You"
                : addr->Js.String2.substring(~from=0, ~to_=15)}`->React.string
          }}
        </button>
      </div>
    </>
  }
}

module KittensGrid = {
  @react.component
  let make = () => {
    let wallet = Web3.useWallet()
    let contract = Web3.useContractMethods()
    <>
      <div className="flex flex-col items-center mb-16 w-full">
        <Next.Image
          layout=#fixed
          width=500.
          height=500.
          src={`/assets/${"Fantom Kitten 420-0-19-3-none-185-249-14.png"}`}
        />
        <button
          type_="button"
          className="bg-green-500 py-5 px-5 uppercase text-white font-bold mt-2 block"
          disabled={wallet.status == #connecting}
          onClick={_ => {
            switch contract {
            | Some(contract) =>
              let _ = wallet.connect(. #injected)
              let _ = contract.claim(419)
            | None => ()
            }
          }}>
          {`Claim Especial Edition Kitten #420 for 420 FTM`->React.string}
        </button>
      </div>
      {KittensDict.files
      ->Js.Array2.mapi((item, index) => {
        if index === 419 {
          React.null
        } else {
          <Kitten item index />
        }
      })
      ->React.array}
    </>
  }
}

@react.component
let make = () => {
  let wallet = Web3.useWallet()

  React.useEffect0(() => {
    let _ = wallet.connect(. #injected)

    None
  })

  <div className="h-screen flex justify-center w-full">
    <div className="container p-5 md:px-16 md:py-12 w-full">
      <div className="flex flex-col flex-grow p-0 md:px-4">
        <Next.Head> <title> {"Fantom Kittens"->React.string} </title> </Next.Head>
        <h1 className="text-4xl font-semibold">
          {"Welcome to "->React.string}
          {<span className="text-blue-500"> {"Fantom Kittens"->React.string} </span>}
        </h1>
      </div>
      <div className="mt-10 flex flex-row justify-center flex-wrap w-full"> <KittensGrid /> </div>
    </div>
  </div>
}
