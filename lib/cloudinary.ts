import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export interface UploadResult {
  url: string
  publicId: string
  width: number
  height: number
}

/**
 * Upload a base64 encoded image to Cloudinary.
 */
export async function uploadImage(
  base64Data: string,
  folder: string = 'wesak-lanterns-2026'
): Promise<UploadResult> {
  const result = await cloudinary.uploader.upload(base64Data, {
    folder,
    transformation: [
      { width: 1200, height: 900, crop: 'limit' },
      { quality: 'auto:good' },
      { format: 'webp' },
    ],
    eager: [
      { width: 400, height: 300, crop: 'fill', gravity: 'center', quality: 'auto' },
    ],
  })

  return {
    url: result.secure_url,
    publicId: result.public_id,
    width: result.width,
    height: result.height,
  }
}

/**
 * Delete an image from Cloudinary.
 */
export async function deleteImage(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId)
}

/**
 * Generate optimized image URL with transformations.
 */
export function getOptimizedUrl(
  url: string,
  { width, height, quality = 'auto' }: { width?: number; height?: number; quality?: string }
): string {
  if (!url.includes('cloudinary.com')) return url

  const parts = url.split('/upload/')
  if (parts.length !== 2) return url

  const transforms: string[] = ['f_auto', `q_${quality}`]
  if (width) transforms.push(`w_${width}`)
  if (height) transforms.push(`h_${height}`)
  transforms.push('c_fill', 'g_center')

  return `${parts[0]}/upload/${transforms.join(',')}/${parts[1]}`
}
