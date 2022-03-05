import Cors from "cors";
import { NextApiRequest, NextApiResponse } from "next";
import initMiddleware from "../../../server/init-middleware";
import * as ethers from "ethers";
import KittensHDContract from "../../../artifacts/contracts/KittensHD.sol/KittensHD.json";

const provider = new ethers.providers.JsonRpcProvider(process.env.NETWORK_RPC);
const contract = new ethers.Contract(
  process.env.NEXT_PUBLIC_KITTENS_HD_CONTRACT_ADDRESS as string,
  KittensHDContract.abi,
  provider
);
// Initialize the cors middleware
const cors = initMiddleware(
  // You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
  Cors({
    // Only allow requests with GET, POST and OPTIONS
    methods: ["GET", "POST", "OPTIONS"],
  })
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  // Run cors
  await cors(req, res);
  const id = (req.query.id as string).replace(/\D+/g, "");
  
  const metadata = await fetch(`${process.env.METADATA_URL}/${id}.json`).then(
    (res) => res.json()
  );

  res.status(200).json(metadata);
}
