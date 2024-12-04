"use server"

import { ObjectId } from "mongodb"
import { Readable } from "stream"
import utf8 from "utf8"

import {
  connectToBucket,
  connectToShortPathCollection,
  getRandomString,
} from "@/lib/mongodb"
import { logger } from "@/lib/utils"

export const upload = async (formData: FormData) => {
  try {
    const { bucket, databaseName } = await connectToBucket()
    const { shortPathCollection } = await connectToShortPathCollection()

    const files: File[] = []
    // let counter = 0
    formData.forEach((value) => files.push(value as File))

    // map through all the entries
    files.forEach(async (file) => {
      const filename = utf8.decode(file.name)
      const fileId = new ObjectId()
      const buffer = Buffer.from(await file.arrayBuffer())
      const stream = Readable.from(buffer)
      const { randomString } = await getRandomString()

      const uploadStream = bucket.openUploadStream(filename, {
        // make sure to add content type so that it will be easier to set later.
        chunkSizeBytes: 1024 * 1024,
        id: fileId,
        contentType: file.type,
        metadata: {
          shortPath: randomString,
        }, //add your metadata here if any
      })

      stream.on("end", () => {
        shortPathCollection.insertOne({
          _id: fileId,
          user_id: databaseName,
          shortPath: randomString,
        })
        // counter += 1
      })

      // pipe the readable stream to a writeable stream to save it to the database
      stream.pipe(uploadStream)
    })

    // took me four days for this, had to MARK here! 
    // but it's been replaced by websocket...
    // while (counter < files.length) {
    //   await new Promise((resolve) => setTimeout(resolve, 1000))
    //   logger("hold 1 seconds...")
    // }

    logger(`[UPLOAD_SUCCESS] ${files.length} file(s) uploaded.`)

    // return the response after all the entries have been processed.
    return {
      success: true,
      message: `${files.length} file(s) uploaded.`,
    }
  } catch (error) {
    logger("[UPLOAD_FAIL] ", error)
    return { success: false, message: "Upload failed." }
  }
}
