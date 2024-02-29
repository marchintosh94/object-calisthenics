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
    FileManager.createUpdateFile({ folderPath, fileName, payload })

    const fileContent = fs.readFileSync(filePath, 'utf8')
    expect(fileContent).toBe(payload)
  })

  it('should rewrite to the file if it already exists', () => {
    const additionalPayload = ' Appended content'
    FileManager.createUpdateFile({
      folderPath,
      fileName,
      payload: additionalPayload
    })

    const fileContent = fs.readFileSync(filePath, 'utf8')
    expect(fileContent).toBe(additionalPayload)
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
describe('preparePayload', () => {
  it('should return the prepared payload', () => {
    const input = { test: 'Hello, world!' }
    const expectedOutput = '{\n  "test": "Hello, world!"\n}'

    const result = FileManager.preparePayload(input)

    expect(result).toBe(expectedOutput)
  })
})
describe('readFileSync', () => {
  const folderPath = 'path/to'
  const fileName = 'test-file.json'
  const filePath = `${folderPath}/${fileName}`

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should return the parsed JSON content if the file exists and contains valid JSON', () => {
    const fileContent = { key: 'value' }
    jest
      .spyOn(fs, 'readFileSync')
      .mockReturnValueOnce(JSON.stringify(fileContent))

    const result = FileManager.readFileSync<{ key: string }>({
      folderPath,
      fileName
    })

    expect(result).toEqual(fileContent)
    expect(fs.readFileSync).toHaveBeenCalledWith(filePath, 'utf8')
  })

  it('should return undefined if there is an error parsing the file', () => {
    jest.spyOn(fs, 'readFileSync').mockReturnValueOnce('invalid json')

    const result = FileManager.readFileSync<{ key: string }>({
      folderPath,
      fileName
    })

    expect(result).toBeUndefined()
    expect(fs.readFileSync).toHaveBeenCalledWith(filePath, 'utf8')
  })

  it('should return undefined if the file does not exist', () => {
    jest.spyOn(fs, 'readFileSync').mockImplementation(() => {
      throw new Error('File not found')
    })

    const result = FileManager.readFileSync<{ key: string }>({
      folderPath,
      fileName
    })

    expect(result).toBeUndefined()
    expect(fs.readFileSync).toHaveBeenCalledWith(filePath, 'utf8')
  })
})
