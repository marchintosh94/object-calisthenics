import fs from 'fs'
import {
  ERROR_FILE_NOT_FOUND,
  ERROR_PARSING_FILE,
  FileManager
} from '../../utils/file-manager/filemanager'

describe('createFile', () => {
  const folderPath = 'path/to/new/folder'
  const fileName = 'newfile.txt'
  const payload = 'Hello, new world!'
  const filePath = `${folderPath}/${fileName}`

  afterAll(() => {
    fs.rmSync(filePath, { recursive: true })
  })

  it('should create a new file with the given payload in the new directory', () => {
    FileManager.createFile({ folderPath, fileName, payload })

    const fileContent = fs.readFileSync(filePath, 'utf8')
    expect(fileContent).toBe(payload)
  })

  it('should append to the file if it already exists', () => {
    const additionalPayload = ' Appended content'
    FileManager.createFile({ folderPath, fileName, payload: additionalPayload })

    const fileContent = fs.readFileSync(filePath, 'utf8')
    expect(fileContent).toBe(payload + additionalPayload)
  })
})

describe('parseJsonFile', () => {
  afterAll(() => {
    fs.rmSync('path', { recursive: true })
  })

  it('should throw an error if the file does not exist', () => {
    const filePath = 'path/to/nonexistent-file.json'

    expect(() => {
      FileManager.parseJsonFile(filePath)
    }).toThrow(ERROR_FILE_NOT_FOUND)
  })

  it('should throw an error if there is an error parsing the file', () => {
    const folderPath = 'path/to/new'
    const fileName = 'invalid-file.json'
    const filePath = `${folderPath}/${fileName}`

    fs.writeFileSync(filePath, 'invalid json', { flag: 'w' })

    expect(() => {
      FileManager.parseJsonFile(filePath)
    }).toThrow(ERROR_PARSING_FILE)
  })

  it('should return the parsed JSON if the file exists and contains valid JSON', () => {
    const folderPath = 'path/to'
    const fileName = 'valid-file.json'
    const filePath = `${folderPath}/${fileName}`
    const fileContent = { key: 'value' }
    fs.writeFileSync(filePath, JSON.stringify(fileContent), { flag: 'w' })

    const parsedContent = FileManager.parseJsonFile(filePath)
    expect(parsedContent).toEqual(fileContent)
  })
})
