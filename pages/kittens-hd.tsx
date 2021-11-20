// kittens menu
import React from "react";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

function Header() {
  return (
    <>
      <Image src={require("../public/assets/hd-banner.jpg")} alt="logo" />
      <div className="flex flex-row p-5 mb-10 items-center">
        <Link href="/">
          <a>
            <Image
              src={require("../public/assets/logo.png")}
              width={60}
              height={60}
              alt="logo"
            />
          </a>
        </Link>

        <div className="ml-auto flex flex-col md:flex-row text-black space-x-4">
          <a
            href="https://discord.gg/VB9nXy28Rw"
            target="_blank"
            rel="noreferrer"
          >
            Community
          </a>
          <a href="/assets/manifest.txt" target="_blank" rel="noreferrer">
            PaintSwap
          </a>
          <a href="/assets/about_us.txt" target="_blank" rel="noreferrer">
            About us
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

const getCostPerKittenByQuantity = (quantity: number) => {
  if (quantity >= 10) return 4.0;
  if (quantity >= 3) return 4.1;
  return 4.2;
};

export default function KittensHD() {
  const [quantity, setQuantity] = React.useState(1);

  return (
    <div>
      <Head>
        <title>Kittens HD</title>
      </Head>
      <Header />

      <div className="flex flex-col items-center" style={{ height: "700px" }}>
        <h1 className="text-5xl text-center mb-12">Kittens HD</h1>
        <Input
          placeholder="Amount of kittens"
          onChange={(e: any) => {
            setQuantity(Math.max(1, e.target.value));
          }}
        />
        <div className="flex flex-col items-center mt-2">
          <h2 className="text-2xl text-center mb-12">
            {getCostPerKittenByQuantity(quantity)} FTM per kitten
          </h2>
        </div>

        <Button
          onClick={() => {
            toast.info(`Minting...`);
          }}
        >
          Mint now {quantity} for{" "}
          {getCostPerKittenByQuantity(quantity) * quantity} FTM
        </Button>
      </div>
      <div className="flex flex-col items-center" style={{ height: "700px" }}>
        <h1 className="text-5xl text-center mb-12">Kittens HD</h1>
      </div>
    </div>
  );
}
