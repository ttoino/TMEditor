import { Request, Response } from 'express'

import { getUsers } from '@app/database/api'

export default async function (req: Request, res: Response): Promise<void> {
  const selectedDB = req.query.database?.toString()

  try {
    const data = await getUsers(selectedDB)

    res.status(200).send(data)
  } catch (error) {
    console.log(error)
    res.sendStatus(500)
  }
}
