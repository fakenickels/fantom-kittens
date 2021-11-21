// kittens menu
import React from "react";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { getCostPerKittenByQuantity } from "../src/utils/useKittensHd";
import { utils } from "ethers";

function Header() {
  return (
    <>
      <Image src={require("../public/assets/bannerhd2.png")} alt="logo"/>
      <div className="flex flex-row p-5 mb-10 items-center">
        {/* <Link href="/">
          <a>
            <Image
              src={require("../public/assets/logo.png")}
              width={60}
              height={60}
              alt="logo"
            />
          </a>
        </Link> */}

        <div className="ml-auto flex flex-col md:flex-row text-black space-x-4 text-blue-600" style={{ justifyContent: "center", width: "100%" }} >
          <a
            href="https://discord.gg/VB9nXy28Rw"
            target="_blank"
            rel="noreferrer"
          >
            Community
          </a>
          <span>/</span>
          <a href="https://fakeworms.studio/" target="_blank" rel="noreferrer">
            Homepage
          </a>
          <span>/</span>
          <a href="https://gist.github.com/MarcoWorms/78e71064e3a5c366b29b8a9ce01e1f19" target="_blank" rel="noreferrer">
            Buy FTM with Binance (International)
          </a>
          <span>/</span>
          <a href="https://swap.vanna.app/" target="_blank" rel="noreferrer">
            Buy FTM with PIX (Brazil only)
          </a>
          <span>/</span>
          <a href="https://gist.github.com/Rastrian/1a43477031d1307ef86815a60e1e0eba" target="_blank" rel="noreferrer">
            Buy FTM with Binance (Brazil)
          </a>
        </div>
      </div>
    </>
  );
}

// nice round button
function Button(props: any) {
  return (
    <button
      className="bg-white hover:bg-gray-100 text-gray-800 font-bold my-2 py-2 px-4 border border-gray-400 rounded shadow"
      {...props}
    />
  );
}

// nice label for input
function Label(props: any) {
  return (
    <label
      className="block text-gray-700 text-sm font-bold mb-2"
      htmlFor={props.htmlFor}
    >
      {props.children}
    </label>
  );
}

// nice round input for quantity desired
function Input(props: any) {
  return (
    <input
      type="number"
      min="1"
      className="bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-l-lg py-2 px-4 block appearance-none leading-normal"
      {...props}
    />
  );
}

export default function KittensHD() {
  const [quantity, setQuantity] = React.useState(1);

  return (
    <div>
      <Head>
        <title>Fantom Kittens HD Mint</title>
      </Head>
      <Header />

      <div className="flex flex-col items-center mt-6">
          <h2 className="text-2xl text-center mb-12">
            6666/10000 Fantom Kittens HD were already minted.
          </h2>
        </div>

      <div className="flex flex-col items-center" style={{ height: "700px" }}>
        
        <span className="text-l text-center mb-1">
          <b>Mint 1 ~ 2:</b> 4.2 FTM each
        </span>
        <span className="text-l text-center mb-1">
          <b>Mint 3 ~ 9:</b> 4.1 FTM each
        </span>
        <span className="text-l text-center mb-12">
          <b>Mint 10+:</b> 4.0 FTM each
        </span>
        <span className="text-l mb-1">
          <b>20% chance </b> of glasses (lenses colors derived from kitten colors)
        </span>
        <span className="text-l mb-1">
          <b>50% chance </b> of a seccond color with different color masks
        </span>
        <span className="text-l mb-12">
          <b>9 Personalities</b> each kitten comes with a Sociability and Courage factor which detemines a personality
        </span>
        <Input
          placeholder="Amount of kittens"
          onChange={(e: any) => {
            setQuantity(Math.max(1, e.target.value));
          }}
        />
        <div className="flex flex-col items-center mt-2">
          <h2 className="text-2xl text-center mb-12">
            {utils.formatEther(getCostPerKittenByQuantity(quantity))} FTM per
            kitten
          </h2>
        </div>

        <Button
          onClick={() => {
            toast.info(`Minting...`);
          }}
        >
          Mint now {quantity} for{" "}
          {utils.formatEther(
            getCostPerKittenByQuantity(quantity).mul(quantity)
          )}{" "}
          FTM
        </Button>


      </div>
      {/* <div className="flex flex-col items-center" style={{ height: "700px" }}>
        <h1 className="text-5xl text-center mb-12">Fantom Kittens HD</h1>
      </div> */}
    </div>
  );
}
