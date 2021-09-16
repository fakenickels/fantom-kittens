import type { NextApiRequest, NextApiResponse } from "next";
import { getFileNameByIndex, kittenIndex } from "../../../src/utils/KittensDict";

interface Data {
  id: string;
  name: string;
  description: string;
  image: string;
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const id = Number(req.query.id as string) as kittenIndex;
  const fileName = getFileNameByIndex(id)

  res.status(200).json({
    id: String(id),
    name: `Fantom Kitten #${id}`,
    image: `https://kittens.fakeworms.studio/assets/${fileName}`,
    description: "A sweet kitten",
  });
}
