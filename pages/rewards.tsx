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

export default function Rewards() {
  const wallet = useWallet();
  const masterKitten = useMasterKitten();
  const rKITTENFTMPair = useRKittenFTMPair();
  const [stakeAmountInput, setStakeAmountInput] = React.useState(
    BigNumber.from(0)
  );
  const { data: allowance, error } = useSWR<string>(
    ["rKITTENPairFTM/allowance", wallet?.account],
    fetcher
  );
  const { mutate } = useSWRConfig();

  const isApprovedToStake = allowance === MAX_ALLOWANCE;

  React.useEffect(() => {
    if (wallet?.account) {
      rKITTENFTMPair.getReserves();
      rKITTENFTMPair.getBalance(wallet.account);
      masterKitten.getUserInfo(0, wallet.account);
      // get pending rewards
      masterKitten.getPendingRKITTEN(0, wallet.account);
    }
  }, [wallet?.account]);

  return (
    <div className="w-full">
      <Header />
      <Flex flexDirection="column" alignItems="center" width="100%">
        <Head>
          <title>Rewards</title>
        </Head>
        <h1 className="rainbow mb-10">rKITTEN Pool</h1>
        {wallet.status === "connected" ? (
          <>
            <Flex justifyContent="center" width="100%">
              <p style={{ margin: 5, marginRight: 60 }}>
                <b>Total U$D Liquidity: </b> U$ ...
              </p>
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
              width="600px"
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
            {Number(rKITTENFTMPair?.balance) > 0 && !isApprovedToStake ? (
              <Flex flexDirection="column" width="600px" alignItems="center">
                <h2>
                  2) Aprove our FTM + rKITTEN Liquidity Pool Stake Contract
                </h2>
                {isApprovedToStake ? (
                  <span className="text-green-500">Approved</span>
                ) : (
                  <span className="text-red-500">Not approved</span>
                )}
                <br />
                <Button
                  onClick={() => {
                    if (wallet?.account) {
                      rKITTENFTMPair.approve(
                        wallet.account,
                        process.env
                          .NEXT_NEXT_PUBLIC_MASTER_KITTEN_CONTRACT_ADDRESS as string,
                        MAX_ALLOWANCE
                      );
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
                <Flex width="100%" justifyContent="center">
                  <h2> 3) Stake your FTM + rKITTEN spLP Tokens</h2>
                </Flex>

                <Flex flexDirection="column" alignItems="center">
                  <h3 className="balance rainbow">Wallet LP Tokens</h3>
                  <h3 className="balance">
                    <FormatWei wei={rKITTENFTMPair.balance} />
                  </h3>
                  <br />
                  <Box>
                    <Button className="h">10 %</Button>
                    <Button className="h">25 %</Button>
                    <Button className="h">50 %</Button>
                    <Button className="h">75 %</Button>
                    <Button className="h">100 %</Button>
                  </Box>
                </Flex>

                <Flex
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Label htmlFor="amount-to-stake" fontSize="16px">
                    Amount
                  </Label>
                  <InputWei
                    id="amount-to-stake"
                    name="amount-to-stake"
                    type="amount-to-stake"
                    value={stakeAmountInput}
                    onChange={(value: BigNumber) => setStakeAmountInput(value)}
                    placeholder="0"
                  />
                  <br />
                  <Box>
                    <Button
                      onClick={() => {
                        if (wallet?.account) {
                          masterKitten.deposit(
                            wallet?.account,
                            0,
                            stakeAmountInput
                          );
                        }
                      }}
                    >
                      Stake LP tokens
                    </Button>{" "}
                    <Button
                      onClick={() => {
                        if (wallet?.account) {
                          masterKitten.withdraw(
                            wallet?.account,
                            0,
                            stakeAmountInput
                          );
                        }
                      }}
                    >
                      Unstake LP tokens
                    </Button>
                  </Box>
                </Flex>

                <Flex flexDirection="column" alignItems="center">
                  <h3 className="balance rainbow">Staked LP Tokens</h3>
                  <h3 className="balance">
                    <FormatWei wei={masterKitten.userInfo?.amount} />
                  </h3>
                  <br />
                  <Box>
                    <button className="h">10 %</button>
                    <button className="h">25 %</button>
                    <button className="h">50 %</button>
                    <button className="h">75 %</button>
                    <button className="h">100 %</button>
                  </Box>
                </Flex>
                <h2>4) Harvest rKITTEN rewards</h2>
                <Flex flexDirection="column" alignItems="center" width="600px">
                  <h3>FTM-rKITTEN LP tokens staked</h3>
                  <h3>
                    <FormatWei wei={masterKitten.userInfo?.amount} />
                  </h3>
                </Flex>
                <Flex flexDirection="column" alignItems="center" width="600px">
                  <h3>rKITTEN available to harvest</h3>
                  <h3>
                    <FormatWei wei={masterKitten.pendingRKITTEN} />
                  </h3>
                </Flex>
                <br />
                <button className="harvest">Harvest</button>
              </>
            ) : null}
          </>
        ) : (
          <div className="pt-20">
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

            .balance {
              font-family: "Press Start 2p", cursive;
            }
          `}
        </style>
      </Flex>
    </div>
  );
}
