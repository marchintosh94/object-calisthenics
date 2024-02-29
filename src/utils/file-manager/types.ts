export interface CreateFileParams {
  folderPath: string
  fileName: string
  payload: string
}
export interface ReadFileParams extends Omit<CreateFileParams, 'payload'> {}
