import { ImageFadeIn } from '@/app/components/ImageFadeIn'
import Image from 'next/image'
import fs from 'fs'
import path from 'path'
import { Blob } from 'fetch-blob'

const API_KEY = process.env.NEXT_PUBLIC_API_KEY

const fileNames = [
  '/images/my.jpg',
  '/images/ne.jpg',
  '/images/ni.jpg',
  '/images/nr.jpg',
  '/images/nz.jpg',
  '/images/pe.jpg',
  '/images/mt.jpg',
  '/images/pk.jpg',
  '/images/ps.jpg',
  '/images/pw.jpg',
  '/images/ru.jpg',
  '/images/rw.jpg',
  '/images/sc.jpg',
  '/images/si.jpg',
  '/images/tf.jpg',
  '/images/us.jpg',
  '/images/va.jpg',
  '/images/vi.jpg',
  '/images/ye.jpg',
  '/images/yt.jpg',
]

async function getData() {
  return Promise.all(
    fileNames.map(async (fileName) => {
      // Convert local file to a Blob
      const filePath = path.join(process.cwd(), 'public', fileName)
      const buffer = fs.readFileSync(filePath)
      const uint8Array = new Uint8Array(buffer)
      const imageBlob = new Blob([uint8Array])

      // Construct the payload
      const formdata = new FormData()
      formdata.append('api_key', API_KEY!)
      formdata.append('analysis[file]', imageBlob, fileName)
      formdata.append('analysis[thumb_hash_data_url_enabled]', '1')

      const res = await fetch('https://solidimage.dev/api/v1/image_analysis', {
        method: 'POST',
        body: formdata,
      })

      const result = {
        filePath: fileName,
        json: await res.json(),
      }

      console.log({ result: result.json })

      return result
    })
  )
}

export default async function Page() {
  const imageResponses = await getData()

  console.log({ imageResponses })

  return (
    <div className="grid grid-cols-4">
      {imageResponses.map((img, index) => {
        return (
          <div
            className="relative flex w-[378px]"
            key={index}
            style={{
              zIndex: imageResponses.length - index,
            }}
          >
            <Image
              src={img.json?.result?.thumb?.data_url}
              width={378}
              height={165}
              alt=""
            />
            <ImageFadeIn
              src={img.filePath}
              width={378}
              height={165}
              className="z-2 absolute left-0 top-0"
              delayMs={100 * (Math.random() * imageResponses.length + index)}
            />
          </div>
        )
      })}
    </div>
  )
}
