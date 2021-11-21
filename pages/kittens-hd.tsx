// kittens menu
import React from "react";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import {
  getCostPerKittenByQuantity,
  useKittenHDMethods,
} from "../src/utils/useKittensHd";
import { utils } from "ethers";
import { useWallet } from "use-wallet";

const metamaskChangeToFantom = () => {
  return window.ethereum.request({
    method: "wallet_addEthereumChain",
    params: [
      {
        chainId: "0xfa",
        chainName: "Fantom Opera",
        rpcUrls: ["https://rpc.ftm.tools"],
        blockExplorerUrls: ["https://ftmscan.com/"],
        nativeCurrency: {
          name: "FTM",
          symbol: "FTM",
          decimals: 18,
        },
      },
    ],
  });
};

function Header() {
  return (
    <>
      <Image src={require("../public/assets/bannerhd2.png")} alt="logo" />
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

        <div className="grid grid-rows-5 md:grid-cols-5 w-full space-x-4 text-blue-600 divide-y-2 md:divide-y-0 md:divide-x-2 justify-center items-center text-center">
          <a
            href="https://discord.gg/VB9nXy28Rw"
            target="_blank"
            rel="noreferrer"
          >
            Community
          </a>
          <a href="https://fakeworms.studio/" target="_blank" rel="noreferrer">
            Homepage
          </a>
          <a
            href="https://gist.github.com/MarcoWorms/78e71064e3a5c366b29b8a9ce01e1f19"
            target="_blank"
            rel="noreferrer"
          >
            Buy FTM with Binance (International)
          </a>
          <a href="https://swap.vanna.app/" target="_blank" rel="noreferrer">
            Buy FTM with PIX (Brazil only)
          </a>
          <a
            href="https://gist.github.com/Rastrian/1a43477031d1307ef86815a60e1e0eba"
            target="_blank"
            rel="noreferrer"
          >
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
  const kittensHD = useKittenHDMethods();
  const wallet = useWallet();

  React.useEffect(() => {
    if (wallet?.account) {
      kittensHD.getTotalSupply();
      kittensHD.getUserTokens();
    }
  }, [wallet?.account]);
  console.log(kittensHD.userTokens);

  // if not connected return to connect with button
  if (!wallet?.account) {
    return (
      <div>
        <Head>
          <title>Fantom Kittens HD Mint</title>
        </Head>
        <Header />
        <div className="flex items-center justify-center">
          {wallet.error?.name == "ChainUnsupportedError" ? (
            <div>
              <h2 className="text-center">Wrong MetaMask network</h2>
              <Button
                onClick={() => {
                  metamaskChangeToFantom().then(() => {
                    wallet.connect("injected");
                  });
                }}
              >
                Change to Fantom Opera
              </Button>
            </div>
          ) : (
            <Button onClick={() => wallet.connect("injected")}>Connect</Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <Head>
        <title>Fantom Kittens HD Mint</title>
      </Head>
      <Header />

      <div className="flex flex-col items-center">
        <h1 className="text-3xl text-center mb-12">
          {kittensHD.totalSupply} / 10000 Fantom Kittens HD were already minted.
        </h1>
      </div>

      <div className="flex flex-col items-center" style={{ height: "700px" }}>
        <span className="text-l text-center mb-1">
          <b>Mint 1 ~ 2:</b> 4.2 FTM each
        </span>
        <span className="text-l text-center mb-1">
          <b>Mint 3 ~ 9:</b> 4.1 FTM each
        </span>
        <span className="text-l text-center mb-8">
          <b>Mint 10+:</b> 4.0 FTM each
        </span>
        <span className="text-l mb-1">
          <b>20% chance </b> of glasses (lenses colors derived from kitten
          colors)
        </span>
        <span className="text-l mb-1">
          <b>50% chance </b> of a second color with different color masks
        </span>
        <span className="text-l mb-1">
          <b>9 Personalities</b> each kitten comes with a Sociability and
          Courage factor which determines a personality
        </span>
        <span className="text-l mb-12">
          <b>4,698 unique expressions</b> and more than{" "}
          <b>666,666,666,666,666,666 possible color mask variants</b>
        </span>
        <Input
          placeholder="Amount of kittens"
          onChange={(e: any) => {
            setQuantity(Math.max(1, e.target.value));
          }}
        />
        <div className="flex flex-col items-center mt-2">
          <h2 className="text-2xl text-center mb-2">
            {utils.formatEther(getCostPerKittenByQuantity(quantity))} FTM per
            kitten
          </h2>
        </div>

        <Button
          onClick={() => {
            toast.info(`Minting...`);
            kittensHD
              .claimKittens(quantity)
              .then((txn) => {
                toast.success(`Minted ${quantity} kittens. Check below.`);
                setTimeout(() => {
                  kittensHD.getUserTokens();
                }, 3000);
              })
              .catch((e) => {
                toast.dismiss();
                toast.error(`Error minting ${quantity} kittens: ${e.message}`);
              });
          }}
        >
          Mint now {quantity} for{" "}
          {utils.formatEther(
            getCostPerKittenByQuantity(quantity).mul(quantity)
          )}{" "}
          FTM
        </Button>
      </div>
      <div className="flex flex-col items-center" style={{ height: "700px" }}>
        <h1 className="text-5xl text-center mb-12">Your kittens</h1>
        <div className="grid grid-cols-4 auto-rows-auto">
          {/* Display user tokens NFTs in a grid */}
          {kittensHD.userTokens.map((token) => {
            return (
              <div key={"img" + token} className="flex flex-col items-center">
                <a
                  href={`https://paintswap.finance/marketplace/assets/${process.env.NEXT_PUBLIC_KITTENS_HD_CONTRACT_ADDRESS}/${token}`}
                  target="_blank"
                  className="cursor-pointer"
                >
                  <IPFSImage src={`/api/kitten-hd/${token}.json`} />
                </a>
                <div className="flex flex-col items-center">
                  <span className="text-l text-center mb-1">
                    <b>Kitten #{token}</b>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function IPFSImage({ src }: { src: string }) {
  const [image, setImage] = React.useState(null);
  React.useEffect(() => {
    fetch(src)
      .then((res) => res.json())
      .then((metadata) => {
        setImage(metadata.image.replace("ipfs://", "https://ipfs.io/ipfs/"));
      });
  }, [src]);
  if (!image) return <div className="h-64 w-64"></div>;
  return <img src={image} className="h-64 w-64" />;
}
