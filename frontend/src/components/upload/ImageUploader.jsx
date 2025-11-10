import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { UploadCloud, File, AlertTriangle } from 'lucide-react'
import { assetService } from '../../api/assetService'
import useAssets from '../../hooks/useAssets'

const ImageUploader = () => {
  const { addUpload, updateUploadProgress, updateUploadStatus } = useAssets()

  const handleUpload = async (file) => {
    const uploadId = addUpload(file)

    try {
      updateUploadStatus(uploadId, 'uploading')
      const { uploadUrl } = await assetService.getUploadUrl(file.name, file.type)
      
      await assetService.uploadFileToS3(uploadUrl, file, (progress) => {
        updateUploadProgress(uploadId, progress)
      })

      updateUploadStatus(uploadId, 'processing')
    } catch (err) {
      console.error('Upload failed:', err)
      updateUploadStatus(uploadId, 'failed', err.message || 'Upload failed')
    }
  }

  const onDrop = useCallback((acceptedFiles, fileRejections) => {
    acceptedFiles.forEach((file) => {
      handleUpload(file)
    })

    fileRejections.forEach(({ file, errors }) => {
      const uploadId = addUpload(file)
      const message = errors[0]?.message || 'File rejected'
      updateUploadStatus(uploadId, 'failed', message)
    })
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': [],
      'image/png': [],
      'image/webp': [],
      'image/gif': [],
    },
    maxSize: 10485760, // 10MB
  })

  return (
    <div
      {...getRootProps()}
      className={`flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-[var(--color-border)] p-12 text-center transition-colors
      ${isDragActive ? 'border-[var(--color-primary)] bg-[var(--color-secondary)]' : 'hover:border-gray-400'}`}
    >
      <input {...getInputProps()} />
      <UploadCloud className="mb-4 h-12 w-12 text-[var(--color-secondary-foreground)]" />
      <p className="text-lg font-semibold text-[var(--color-foreground)]">
        Drag & drop files here, or click to browse
      </p>
      <p className="text-sm text-[var(--color-secondary-foreground)]">
        JPG, PNG, WEBP, GIF (Max 10MB)
      </p>
    </div>
  )
}

export default ImageUploader