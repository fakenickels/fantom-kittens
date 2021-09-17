module Carousel = {
  @react.component
  let make = () => {
    let (currentIndex, setCurrentIndex) = React.useState(() => 0)

    React.useEffect0(() => {
      let timerId = Js.Global.setInterval(() => {
        setCurrentIndex(currentIndex => mod(currentIndex + 1, 5))
      }, 600)

      Some(() => Js.Global.clearInterval(timerId))
    })

    {
      switch currentIndex {
      | 0 => <Next.Image src={Next.require(`../public/assets/${KittensDict.getFileNameByIndex(#0)}`)} />
      | 1 => <Next.Image src={Next.require(`../public/assets/${KittensDict.getFileNameByIndex(#1)}`)} />
      | 2 => <Next.Image src={Next.require(`../public/assets/${KittensDict.getFileNameByIndex(#2)}`)} />
      | 3 => <Next.Image src={Next.require(`../public/assets/${KittensDict.getFileNameByIndex(#3)}`)} />
      | 4 => <Next.Image src={Next.require(`../public/assets/${KittensDict.getFileNameByIndex(#4)}`)} />
      | _ => React.null
      }
    }
  }
}

@react.component
let make = () => {
  let wallet = Web3.useWallet()
  let contract = Web3.useContractMethods()

  React.useEffect0(() => {
    let _ = contract.getTotalSupply()
    None
  })

  <div className="container px-16 py-12 grid grid-cols-2">
    <div className="flex flex-col">
      <Next.Head> <title> {"Fantom Kittens"->React.string} </title> </Next.Head>
      <h1 className="text-4xl font-semibold">
        {"Welcome to "->React.string}
        {<span className="text-blue-500"> {"Fantom Kittens"->React.string} </span>}
      </h1>
      <p className="p-5 pt-16 pb-10">
        {"420 NFT kittens are now released into the Fantom Network wilderness! This is a claiming website where you can claim a proceduraly generated kitten for only 4.20 FTM each. There are over 15.000 parts combinations and millions of colors possibilities, but only 420 out of all possible combinations will exist and live in the Fantom Network!"->React.string}
      </p>
      {switch wallet.status {
      | #disconnected
      | #connecting =>
        <button
          type_="button"
          className="bg-blue-500 py-5 px-5 uppercase text-white font-bold mt-auto"
          disabled={wallet.status == #connecting}
          onClick={_ => {
            let _ = wallet.connect(. #injected)
          }}>
          {"Connect wallet"->React.string}
        </button>
      | #error => `Something went wrong. Try reloading your page.`->React.string
      | #connected => <>
          <h1 className="text-xl p-5">
            {`Welcome, ${wallet.account
              ->Js.Nullable.toOption
              ->Belt.Option.getWithDefault("")}`->React.string}
          </h1>
          <p className="text-xl p-5 text-green-500">
            {switch contract.totalSupply {
            | None => "All 420 kittens were claimed! Thanks everyone!"->React.string
            | Some(totalSupply) => `Claimed kittens: ${totalSupply->string_of_int}/420`->React.string
            }}
          </p>
          <button
            type_="button"
            className="bg-green-500 py-5 px-5 uppercase text-white font-bold mt-auto"
            disabled={wallet.status == #connecting}
            onClick={_ => {
              let _ = wallet.connect(. #injected)
              let _ = contract.claim()
            }}>
            {`Claim one kitten for 4.20 FTM`->React.string}
          </button>
        </>
      }}
    </div>
    <div className="flex items-center justify-center"> <Carousel /> </div>
  </div>
}
