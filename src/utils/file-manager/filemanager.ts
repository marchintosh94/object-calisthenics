import fs from 'fs'
import { CreateFileParams } from './types'

export const ERROR_FILE_NOT_FOUND = 'File does not exist'
export const ERROR_PARSING_FILE = 'Error parsing file'

const createUpdateFile = ({
  folderPath,
  fileName,
  payload
}: CreateFileParams): void => {
  const filePath = `${folderPath}/${fileName}`
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true })
  }
  fs.writeFileSync(filePath, payload, { flag: 'a' })
}

const parseJsonFile = <T>(filePath: string): T => {
  if (!fs.existsSync(filePath)) {
    throw new Error(ERROR_FILE_NOT_FOUND)
  }

  try {
    const content = fs.readFileSync(filePath, 'utf8')
    return JSON.parse(content) as T
  } catch (error) {
    throw new Error(ERROR_PARSING_FILE)
  }
}

const preparePayload = <T>(payload: T): string => {
  return JSON.stringify(payload, null, 2)
}

export const FileManager = {
  createUpdateFile,
  parseJsonFile,
  preparePayload
}
