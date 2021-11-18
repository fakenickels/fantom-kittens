import React from "react";
import Head from "next/head";
import { Flex, Box } from "rebass";
import { Label, Input } from "@rebass/forms";
import { useWallet } from "use-wallet";
import { useMasterKitten } from "../src/contracts/masterKitten";
import { useRKittenFTMPair } from "../src/contracts/rkittenFTMPair";
import FormatWei from "../src/components/FormatWei";
import Button from "../components/Button";
import Header from "../components/Header";
import useSWR, { useSWRConfig } from "swr";
import fetcher from "../src/contracts/fetcher";
import { MAX_ALLOWANCE } from "../src/contracts/constants";
import InputWei from "../src/components/InputWei";
import { BigNumber } from "ethers";
import { useFountain } from "../components/EmojiFountain";

export default function Rewards() {
  const fountain = useFountain();
  const wallet = useWallet();
  const masterKitten = useMasterKitten();
  const rKITTENFTMPair = useRKittenFTMPair();
  const [isLoading, setIsLoading] = React.useState(false);
  const [stakeAmountInput, setStakeAmountInput] = React.useState("0");
  const [unstakeAmountInput, setUnstakeAmountInput] = React.useState("0");
  const [currentTab, setCurrentTab] = React.useState("stake");
  const { data: allowance, error } = useSWR<string>(
    ["rKITTENPairFTM/allowance", wallet?.account],
    fetcher
  );

  const isApprovedToStake = allowance === MAX_ALLOWANCE;

  const loadInfos = () => {
    if (wallet?.account) {
      rKITTENFTMPair.getReserves();
      rKITTENFTMPair.getBalance(wallet.account);
      masterKitten.getUserInfo(0, wallet.account);
      // get pending rewards
      masterKitten.getPendingRKITTEN(0, wallet.account);
    }
  };

  React.useEffect(() => {
    loadInfos();
  }, [wallet?.account]);

  const renderStakePanel = () => {
    return (
      <>
        <Flex width="100%" justifyContent="center">
          <h2> 3) Stake your FTM + rKITTEN spLP Tokens</h2>
        </Flex>

        <Flex
          flexDirection="column"
          width="100%"
          alignItems="center"
          className=""
        >
          <h3 className="balance">Wallet LP Tokens</h3>
          <h3 className="balance">
            <FormatWei wei={rKITTENFTMPair.balance} />
          </h3>
          <br />
        </Flex>

        <Flex
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          className=""
          width="100%"
        >
          <div>
            <InputWei
              id="amount-to-stake"
              name="amount-to-stake"
              type="amount-to-stake"
              value={stakeAmountInput}
              onChange={(value: string) => setStakeAmountInput(value)}
              placeholder="0"
              maxValue={rKITTENFTMPair.balance || 0}
            />
          </div>
          <br />
          <Box>
            <Button
              onClick={() => {
                if (wallet?.account) {
                  setIsLoading(true);
                  (
                    masterKitten.deposit(
                      wallet?.account,
                      0,
                      stakeAmountInput
                    ) as any
                  )
                    .on("receipt", () => {
                      setTimeout(() => {
                        loadInfos();
                      }, 1000);
                      setStakeAmountInput("0.0");
                      setIsLoading(false);
                    })
                    .on("confirmation", () => {
                      loadInfos()
                    })
                    .on("error", () => setIsLoading(false));
                }
              }}
              disabled={isLoading}
            >
              Stake LP tokens
            </Button>{" "}
          </Box>
        </Flex>
      </>
    );
  };

  const renderUnstakePanel = () => {
    return (
      <Flex
        flexDirection="column"
        alignItems="center"
        width="100%"
        className="py-10"
      >
        <h3 className="balance">Staked LP Tokens</h3>
        <h3 className="balance">
          <FormatWei wei={masterKitten.userInfo?.amount} />
        </h3>
        <Flex
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
          <InputWei
            id="amount-to-stake"
            name="amount-to-stake"
            type="amount-to-stake"
            value={unstakeAmountInput}
            onChange={(value: string) => setUnstakeAmountInput(value)}
            placeholder="0"
            maxValue={masterKitten.userInfo?.amount || 0}
          />
          <br />
          <Box>
            <Button
              disabled={isLoading}
              onClick={() => {
                if (wallet?.account) {
                  setIsLoading(true);
                  (
                    masterKitten.withdraw(
                      wallet?.account,
                      0,
                      unstakeAmountInput
                    ) as any
                  )
                    .on("receipt", () => {
                      setIsLoading(false);
                      setUnstakeAmountInput("0.0");
                      loadInfos();
                    })
                    .on("error", () => setIsLoading(false));
                }
              }}
            >
              Unstake LP tokens
            </Button>
          </Box>
        </Flex>
      </Flex>
    );
  };

  return (
    <div className="w-full pb-20">
      <Header />
      <Box width="100%">
        <Head>
          <title>Rewards</title>
        </Head>
        <h1 className="rainbow mb-10">rKITTEN Pool</h1>
        {wallet.status === "connected" ? (
          <>
            <Flex justifyContent="center" width="100%">
              {/* <p style={{ margin: 5, marginRight: 60 }}>
                <b>Total U$D Liquidity: </b> U$ ...
              </p> */}
              <p style={{ margin: 5, marginRight: 60 }}>
                <b>FTM Liquidity:</b>{" "}
                <FormatWei wei={rKITTENFTMPair.reserves?.reserve0} /> FTM
              </p>
              <p style={{ margin: 5 }}>
                <b>rKITTEN Liquidity:</b>{" "}
                <FormatWei wei={rKITTENFTMPair.reserves?.reserve1} /> rKITTEN
              </p>
            </Flex>
            <br />
            <Flex
              flexDirection="column"
              width="100%"
              alignItems="center"
              justifyContent="space-between"
            >
              <h2>
                1) Exchange FTM + rKITTEN for SpookySwap Liquidity Pool Tokens
              </h2>
              <a
                href="https://spookyswap.finance/add"
                target="blank"
                style={{ fontSize: 22 }}
              >
                Click here to open SpookySwap liquidity interface
              </a>
              <br />
            </Flex>
            {!isApprovedToStake ? (
              <Flex flexDirection="column" width="100%" alignItems="center">
                <h2>
                  2) Approve our FTM + rKITTEN Liquidity Pool Stake Contract
                </h2>
                {isApprovedToStake ? (
                  <span className="text-green-500">Approved</span>
                ) : (
                  <span className="text-red-500">Not approved</span>
                )}
                <br />
                <Button
                  loading={isLoading}
                  onClick={() => {
                    if (wallet?.account) {
                      (rKITTENFTMPair.approve(
                        wallet.account,
                        process.env
                          .NEXT_PUBLIC_MASTER_KITTEN_CONTRACT_ADDRESS as string,
                        MAX_ALLOWANCE
                      ) as any)
                      .on("receipt", () => loadInfos())
                      .on("confirmation", () => loadInfos());
                    }
                  }}
                >
                  Click here to aprove our contract
                </Button>
                <br />
              </Flex>
            ) : null}

            {isApprovedToStake ? (
              <>

                
                {renderStakePanel()}
                {renderUnstakePanel()}
                

                <Flex flexDirection="column" alignItems="center" width="100%">
                  <h2>4) Harvest rKITTEN rewards</h2>
                  <br />
                  <h3>FTM-rKITTEN LP tokens staked</h3>
                  <h3>
                    <FormatWei wei={masterKitten.userInfo?.amount} /> spLP
                  </h3>
                  <br />
                </Flex>
                <Flex flexDirection="column" alignItems="center" width="100%">
                  <h3>rKITTEN available to harvest</h3>
                  <h3>
                    <FormatWei wei={masterKitten.pendingRKITTEN} /> rKITTEN
                  </h3>
                  <br />
                  <button
                    className="harvest"
                    disabled={isLoading}
                    ref={fountain.ref}
                    onClick={() => {
                      // calls deposit with nothing to harvest
                      if (wallet?.account) {
                        setIsLoading(true);
                        (masterKitten.deposit(wallet.account, 0, "0.0") as any)
                          .on("receipt", () => {
                            setIsLoading(false);
                            fountain.start();
                            setTimeout(() => {
                              loadInfos();
                              fountain.stop();
                            }, 1000);
                          })
                          .on("error", () => {
                            setIsLoading(false);
                          });
                      }
                    }}
                  >
                    Harvest
                  </button>
                </Flex>
              </>
            ) : null}
          </>
        ) : (
          <div className="flex justify-center pt-20">
            <button
              className="text-white border-2 border-white"
              onClick={() => wallet.connect("injected")}
            >
              Connect MetaMask
            </button>
          </div>
        )}
        <style jsx global>
          {`
            @import url("https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap");
            * {
              font-family: arial;
              color: #ddd;
            }

            body {
              margin: 0;
              background-color: #090909;
              height: 100%;
            }

            h1 {
              font-family: "Press Start 2p", cursive;
              font-size: 50px;
              text-align: center;
            }

            h3 {
              font-family: "Press Start 2p", cursive;
            }

            h2 {
              font-family: "Press Start 2p", cursive;
              font-size: 20px;
              line-height: 30px;
              background-image: linear-gradient(
                to left,
                blue,
                indigo,
                violet,
                red,
                orange,
                yellow,
                green
              );
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
            }

            button {
              font-size: 18px;
              padding: 10px;
              color: #111;
            }
            button b {
              color: #111;
            }
            .rainbow {
              background-image: linear-gradient(
                to left,
                blue,
                indigo,
                violet,
                red,
                orange,
                yellow,
                green
              );
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
            }

            .harvest {
              font-family: "Press Start 2p", cursive;
              width: 300px;
              height: 80px;
              font-size: 28px;
              background-image: linear-gradient(
                to left,
                blue,
                indigo,
                violet,
                red,
                orange,
                yellow,
                green
              );
              color: #000;
            }
            .harvest[disabled] {
              opacity: 0.75;
              pointer-events: none;
            }
            .balance {
              font-family: "Press Start 2p", cursive;
            }
          `}
        </style>
      </Box>
    </div>
  );
}
