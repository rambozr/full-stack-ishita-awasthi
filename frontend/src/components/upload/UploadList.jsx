import React from 'react'
import useAssets from '../../hooks/useAssets'
import UploadItem from './UploadItem'

const UploadList = () => {
  const { uploads } = useAssets()

  if (uploads.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Uploads</h2>
      <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)]">
        <ul className="divide-y divide-[var(--color-border)]">
          {uploads.map((upload) => (
            <UploadItem key={upload.id} upload={upload} />
          ))}
        </ul>
      </div>
    </div>
  )
}

export default UploadList