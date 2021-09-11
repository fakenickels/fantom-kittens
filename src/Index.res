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
      | 0 => <Next.Image src={Next.require("../public/assets/0.png")} />
      | 1 => <Next.Image src={Next.require("../public/assets/1.png")} />
      | 2 => <Next.Image src={Next.require("../public/assets/2.png")} />
      | 3 => <Next.Image src={Next.require("../public/assets/3.png")} />
      | 4 => <Next.Image src={Next.require("../public/assets/4.png")} />
      | _ => React.null
      }
    }
  }
}

@react.component
let make = () => {
  let wallet = Web3.useWallet()
  let claim = Web3.useClaim()

  <div className="container px-16 py-12 grid grid-cols-2">
    <div className="flex flex-col">
      <Next.Head> <title> {"Fantom Kittens"->React.string} </title> </Next.Head>
      <h1 className="text-4xl font-semibold">
        {"Welcome to "->React.string}
        {<span className="text-blue-500"> {"Fantom Kittens"->React.string} </span>}
      </h1>
      {switch wallet.status {
      | #disconnected
      | #connecting =>
        <button
          type_="button"
          className="bg-blue-200 py-5 px-5 uppercase text-white font-bold mt-auto"
          disabled={wallet.status == #connecting}
          onClick={_ => {
            let _ = wallet.connect(. #injected)
          }}>
          {"Connect wallet"->React.string}
        </button>
      | #error => `Something went wrong. Try reloading your page.`->React.string
      | #connected => <>
          <h1 className="text-xl">
            {`Welcome, ${wallet.account->Belt.Option.getWithDefault("")}`->React.string}
          </h1>
          <button
            type_="button"
            className="bg-blue-500 py-5 px-5 uppercase text-white font-bold mt-auto"
            disabled={wallet.status == #connecting}
            onClick={_ => {
              let _ = wallet.connect(. #injected)
              claim()
            }}>
            {`Claim one kitten for 4.2 FTM`->React.string}
          </button>
        </>
      }}
    </div>
    <div className="flex items-center justify-center"> <Carousel /> </div>
  </div>
}
