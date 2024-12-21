// import { Upload as TusUpload } from "tus-js-client"

// declare module "tus-js-client" {
//   export class UploadWithBuffer extends TusUpload {
//     // Override: Added Buffer type
//     constructor(
//       file: File | Buffer | Blob | Pick<ReadableStreamDefaultReader, "read">,
//       options: UploadOptions
//     )
//     // Override: Added Buffer type
//     file: File | Buffer | Blob | Pick<ReadableStreamDefaultReader, "read">
//   }
// }

export type FileInfoType = {
  file_size: number
  download_times: number
  user_id: string
  file_name: string
  file_id: string
  last_download_at: string
  upload_at: string
  baseUrl: string
  // selected?: boolean
}

export type UserUsageType = {
  user: string
  total_size: number
  token: string
  total_download_times: number
  total_upload_byte: number
  total_download_byte: number
  total_upload_times: number
  last_upload_at: string
  created_at: string
  last_download_at: string
}

export type AuthenticatedUserType = {
  user: string
  token: string
}

