import fs from 'fs/promises'
import { Request, Response } from 'express'
import { REDUCERS_PATH } from '@app/constants/config-file-paths'

export const get = async (req: Request, res: Response): Promise<void> => {
  try {
    const reducers = await fs.readFile(`${REDUCERS_PATH}index.js`)

    res.status(200).type('.js').send(reducers)
  } catch (error) {
    res.status(200).type('.js').send('')
  }
}

export const put = async (req: Request, res: Response): Promise<void> => {
  try {
    const reducers = req.body

    await fs.writeFile(`${REDUCERS_PATH}index.js`, reducers)

    res.status(200).type('.js').send(reducers)
  } catch (error) {
    res.status(500)
  }
}
