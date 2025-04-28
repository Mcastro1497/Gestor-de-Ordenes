"use client"

import { useState, useCallback } from "react"
import { useSupabase } from "./use-supabase"

export function useStorage(bucket: string) {
  const { supabase } = useSupabase()
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<Error | null>(null)

  const uploadFile = useCallback(
    async (file: File, path: string) => {
      setUploading(true)
      setProgress(0)
      setError(null)

      try {
        const { data, error } = await supabase.storage.from(bucket).upload(path, file, {
          onUploadProgress(progress) {
            const percent = progress.percent ? Math.round(progress.percent) : 0
            setProgress(percent)
          },
        })

        if (error) {
          throw error
        }

        return { data, error: null }
      } catch (err) {
        console.error("Error uploading file:", err)
        setError(err as Error)
        return { data: null, error: err as Error }
      } finally {
        setUploading(false)
      }
    },
    [bucket, supabase.storage],
  )

  const getPublicUrl = useCallback(
    (path: string) => {
      const { data } = supabase.storage.from(bucket).getPublicUrl(path)
      return data.publicUrl
    },
    [bucket, supabase.storage],
  )

  const downloadFile = useCallback(
    async (path: string) => {
      try {
        const { data, error } = await supabase.storage.from(bucket).download(path)

        if (error) {
          throw error
        }

        return { data, error: null }
      } catch (err) {
        console.error("Error downloading file:", err)
        return { data: null, error: err as Error }
      }
    },
    [bucket, supabase.storage],
  )

  const deleteFile = useCallback(
    async (path: string) => {
      try {
        const { error } = await supabase.storage.from(bucket).remove([path])

        if (error) {
          throw error
        }

        return { error: null }
      } catch (err) {
        console.error("Error deleting file:", err)
        return { error: err as Error }
      }
    },
    [bucket, supabase.storage],
  )

  const listFiles = useCallback(
    async (folder = "") => {
      try {
        const { data, error } = await supabase.storage.from(bucket).list(folder)

        if (error) {
          throw error
        }

        return { data, error: null }
      } catch (err) {
        console.error("Error listing files:", err)
        return { data: null, error: err as Error }
      }
    },
    [bucket, supabase.storage],
  )

  return {
    uploadFile,
    getPublicUrl,
    downloadFile,
    deleteFile,
    listFiles,
    uploading,
    progress,
    error,
  }
}
