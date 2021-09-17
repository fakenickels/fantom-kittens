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

  <div className=" px-16 py-12 ">
    <div className="flex flex-col items-center">
      <Next.Head> <title> {"Fantom Kittens"->React.string} </title> </Next.Head>
      <h1 className="text-6xl font-semibold pb-10">
        {<span className="text-transparent bg-clip-text bg-gradient-to-br from-blue-500 to-red-500"> {"Welcome to "->React.string} </span>}
        {<span className="text-transparent bg-clip-text bg-gradient-to-br from-yellow-500 to-green-500"> {"Fantom Kittens"->React.string} </span>}
      </h1>
      <Next.Image src={Next.require(`../public/assets/bannerkittenrs.png`)}/>
      <div className="container flex flex-wrap">
        <div className="p-10 w-6/12">
          <p>
            {"420 NFT kittens are now released into the Fantom Network wilderness! This is a claiming website where you can claim a proceduraly generated kitten for only 4.20 FTM each. There are over 15.000 parts combinations and millions of colors possibilities, but only 420 out of all possible combinations will exist and live in the Fantom Network!"->React.string}
          </p>
          <br />
          <a className="text-purple-700 underline" href="https://discord.gg/WmyrjCrZyR">
            {"Join our discord"->React.string}
          </a><span>{" to interact with the Fantom Kittens community and keep up-to-date future FakeWorms Studio projects!"->React.string}</span>
          <br />
          <br />
          <span>{"Made with <3 by "->React.string}</span>
          <a className="text-purple-700 underline" href="https://twitter.com/fakenickels">
            {"@fakenickels"->React.string}
          </a>
          <span>{" and "->React.string}</span>
          <a className="text-purple-700 underline" href="https://twitter.com/MarcoWorms">
            {"@marcoworms"->React.string}
          </a>
        </div>
        <div className="p-10 w-6/12">
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
            <p className="text-xl text-blue-500 pb-5">
              {switch contract.totalSupply {
              | None => "All 420 kittens were claimed! Thanks everyone!"->React.string
              | Some(totalSupply) => `Claimed kittens: ${totalSupply->string_of_int}/420`->React.string
              }}
            </p>
            <h1 className="text-xl text-green-500 pb-10">
              {`Hello, ${wallet.account
                ->Js.Nullable.toOption
                ->Belt.Option.getWithDefault("")}`->React.string}
            </h1>
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
      </div>
    </div>
    // <div className="flex items-center justify-center"> <Carousel /> </div>
  </div>
}
