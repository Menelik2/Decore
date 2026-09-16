"use client"

import { useCallback, useRef, useState } from "react"
import { Upload, X, Loader2, ImageIcon } from "lucide-react"
import {
  uploadImage,
  UPLOAD_BUCKETS,
  type UploadBucket,
  MAX_FILE_SIZE,
} from "@/lib/upload"
import { cn } from "@/lib/utils"

export type UploadedImage = {
  url: string
  path: string
  name: string
}

type ImageUploaderProps = {
  bucket?: UploadBucket
  folder?: string
  multiple?: boolean
  maxFiles?: number
  value?: UploadedImage[]
  onChange?: (images: UploadedImage[]) => void
  className?: string
  label?: string
  hint?: string
}

export function ImageUploader({
  bucket = UPLOAD_BUCKETS.gallery,
  folder = "uploads",
  multiple = true,
  maxFiles = 8,
  value = [],
  onChange,
  className,
  label = "Upload images",
  hint = `JPEG, PNG, WebP or GIF · max ${MAX_FILE_SIZE / (1024 * 1024)} MB each`,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const processFiles = useCallback(
    async (fileList: FileList | File[]) => {
      const files = Array.from(fileList)
      if (!files.length) return

      const remaining = maxFiles - value.length
      if (remaining <= 0) {
        setError(`Maximum ${maxFiles} images allowed.`)
        return
      }

      const toUpload = files.slice(0, remaining)
      setUploading(true)
      setError(null)

      const results: UploadedImage[] = []
      const errors: string[] = []

      for (const file of toUpload) {
        const result = await uploadImage(file, bucket, folder)
        if (result.success) {
          results.push({
            url: result.url,
            path: result.path,
            name: file.name,
          })
        } else {
          errors.push(`${file.name}: ${result.error}`)
        }
      }

      if (results.length) {
        onChange?.([...value, ...results])
      }
      if (errors.length) {
        setError(errors.join(" · "))
      }
      setUploading(false)

      if (inputRef.current) inputRef.current.value = ""
    },
    [bucket, folder, maxFiles, onChange, value]
  )

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    if (e.dataTransfer.files?.length) {
      processFiles(e.dataTransfer.files)
    }
  }

  const removeAt = (index: number) => {
    const next = value.filter((_, i) => i !== index)
    onChange?.(next)
  }

  return (
    <div className={cn("space-y-3", className)}>
      {label && (
        <p className="text-sm font-medium text-foreground">{label}</p>
      )}

      {/* Preview grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {value.map((img, i) => (
            <div
              key={`${img.path}-${i}`}
              className="relative aspect-square rounded-xl overflow-hidden border border-border bg-muted group"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.url}
                alt={img.name}
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeAt(i)}
                className="absolute top-1.5 right-1.5 h-7 w-7 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
                aria-label="Remove image"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Drop zone */}
      {value.length < maxFiles && (
        <div
          onDragOver={(e) => {
            e.preventDefault()
            setDragging(true)
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => !uploading && inputRef.current?.click()}
          className={cn(
            "relative flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-4 py-10 cursor-pointer transition-colors",
            dragging
              ? "border-primary bg-primary/5"
              : "border-border bg-white hover:border-primary/40 hover:bg-muted/30",
            uploading && "pointer-events-none opacity-70"
          )}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            multiple={multiple}
            className="hidden"
            onChange={(e) => {
              if (e.target.files) processFiles(e.target.files)
            }}
          />

          {uploading ? (
            <>
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
              <p className="text-sm text-muted-foreground">Uploading...</p>
            </>
          ) : (
            <>
              <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center">
                {dragging ? (
                  <Upload className="h-5 w-5 text-primary" />
                ) : (
                  <ImageIcon className="h-5 w-5 text-primary" />
                )}
              </div>
              <p className="text-sm font-medium text-foreground">
                {dragging ? "Drop images here" : "Click or drag images to upload"}
              </p>
              <p className="text-xs text-muted-foreground text-center">{hint}</p>
            </>
          )}
        </div>
      )}

      {error && (
        <p className="text-xs text-destructive bg-destructive/10 rounded-lg px-3 py-2">
          {error}
        </p>
      )}
    </div>
  )
}
