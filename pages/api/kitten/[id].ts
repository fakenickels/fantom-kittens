import type { NextApiRequest, NextApiResponse } from 'next'

interface Data {
  id: string
  name: string
  description: string
  image: string
}


export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const id = req.query.id as string

  res.status(200).json({
    id: id,
    name: `Fantom Kitten #${id}`,
    image: `https://fantom-kittens.vercel.app/assets/${id}.png`,
    description: "A sweet kitten",
  })
}
