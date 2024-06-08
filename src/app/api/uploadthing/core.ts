import { getToken } from 'next-auth/jwt'
import { createUploadthing, FileRouter } from 'uploadthing/next'

const f = createUploadthing()

export const ourFileRouter: FileRouter = {
  imageUploader: f({ image: { maxFileSize: '4MB' } })
    .middleware(async (req) => {
      const user = await getToken({ req })

      if (!user) throw new Error('Unauthorized')

      return { userId: user.id }
    })
    .onUploadComplete(async ({ metadata, file }) => {}),
}

export type OurFileRouter = typeof ourFileRouter