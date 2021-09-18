import type { NextApiRequest, NextApiResponse } from "next";
import { extractAttrsFromName, getFileNameByIndex, kittenIndex } from "../../../src/utils/KittensDict";
import Cors from 'cors'
import initMiddleware from "../../../server/init-middleware";

interface Data {
  id: string;
  name: string;
  description: string;
  image: string;
  attributes: {trait_type: string, value: string}[]
}

// Initialize the cors middleware
const cors = initMiddleware(
  // You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
  Cors({
    // Only allow requests with GET, POST and OPTIONS
    methods: ['GET', 'POST', 'OPTIONS'],
  })
)


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  // Run cors
  await cors(req, res)
  const id = Number(req.query.id as string) as kittenIndex;
  const fileName = getFileNameByIndex(id)

  res.status(200).json({
    id: String(id),
    name: `Fantom Kitten #${id}`,
    image: `https://kittens.fakeworms.studio/assets/${encodeURIComponent(fileName)}`,
    description: "A sweet kitten",
    attributes: extractAttrsFromName(fileName)
  });
}
