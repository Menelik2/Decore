/**
 * Image upload helpers for Supabase Storage.
 */

export const UPLOAD_BUCKETS = {
  products: "product-images",
  gallery: "gallery-images",
  events: "event-images",
  customer: "customer-uploads",
  site: "site-assets",
} as const

export type UploadBucket = (typeof UPLOAD_BUCKETS)[keyof typeof UPLOAD_BUCKETS]

export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
] as const

export const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5 MB

export type UploadResult =
  | { success: true; url: string; path: string }
  | { success: false; error: string }

export function validateImageFile(file: File): string | null {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type as (typeof ALLOWED_IMAGE_TYPES)[number])) {
    return "Only JPEG, PNG, WebP, and GIF images are allowed."
  }
  if (file.size > MAX_FILE_SIZE) {
    return `File is too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)} MB.`
  }
  if (file.size === 0) {
    return "File is empty."
  }
  return null
}

export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  return Boolean(url && key && !url.includes("your_supabase") && !key.includes("your_supabase"))
}

function sanitizeFileName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9.-]/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80)
}

export function buildStoragePath(folder: string, fileName: string): string {
  const id =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
  const safe = sanitizeFileName(fileName)
  const ext = safe.includes(".") ? safe.split(".").pop() : "jpg"
  const base = safe.replace(/\.[^.]+$/, "").slice(0, 40) || "image"
  return `${folder}/${id}-${base}.${ext}`
}

export async function uploadImage(
  file: File,
  bucket: UploadBucket,
  folder = "uploads"
): Promise<UploadResult> {
  const validationError = validateImageFile(file)
  if (validationError) {
    return { success: false, error: validationError }
  }

  if (!isSupabaseConfigured()) {
    try {
      const url = URL.createObjectURL(file)
      return { success: true, url, path: `local/${file.name}` }
    } catch {
      return {
        success: false,
        error:
          "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to enable cloud uploads.",
      }
    }
  }

  try {
    const { createClient } = await import("@/lib/supabase/client")
    const supabase = createClient()
    const path = buildStoragePath(folder, file.name)

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      })

    if (uploadError) {
      return { success: false, error: uploadError.message }
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(path)

    return { success: true, url: data.publicUrl, path }
  } catch (e) {
    const message = e instanceof Error ? e.message : "Upload failed"
    return { success: false, error: message }
  }
}

export async function uploadMultipleImages(
  files: File[],
  bucket: UploadBucket,
  folder = "uploads"
): Promise<UploadResult[]> {
  return Promise.all(files.map((f) => uploadImage(f, bucket, folder)))
}

export async function deleteImage(
  bucket: UploadBucket,
  path: string
): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured() || path.startsWith("local/")) {
    return { success: true }
  }
  try {
    const { createClient } = await import("@/lib/supabase/client")
    const supabase = createClient()
    const { error } = await supabase.storage.from(bucket).remove([path])
    if (error) return { success: false, error: error.message }
    return { success: true }
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Delete failed",
    }
  }
}
