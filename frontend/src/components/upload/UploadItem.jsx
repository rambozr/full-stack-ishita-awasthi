import React from 'react'
import { File, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react'
import filesize from 'filesize'
import StatusChip from '../common/StatusChip'

const UploadItem = ({ upload }) => {
  const { file, status, progress, error } = upload

  const getIcon = () => {
    switch (status) {
      case 'uploading':
      case 'processing':
        return <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
      case 'success':
      case 'ready':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      case 'failed':
        return <AlertTriangle className="h-5 w-5 text-red-500" />
      default:
        return <File className="h-5 w-5 text-gray-400" />
    }
  }

  return (
    <li className="flex flex-col items-start gap-4 p-4 sm:flex-row sm:items-center">
      <div className="flex-shrink-0">{getIcon()}</div>
      <div className="flex-grow overflow-hidden">
        <p className="truncate font-medium text-[var(--color-foreground)]">
          {file.name}
        </p>
        <p className="text-sm text-[var(--color-secondary-foreground)]">
          {filesize(file.size)}
        </p>
      </div>
      <div className="w-full sm:w-auto">
        <StatusChip status={status} />
      </div>
      {(status === 'uploading' || (status === 'success' && progress < 100)) && (
        <div className="w-full sm:w-1/4">
          <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--color-secondary)]">
            <div
              className="h-2 rounded-full bg-[var(--color-primary)] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
      {status === 'failed' && (
        <p className="w-full text-sm text-red-500 sm:w-auto sm:flex-grow">
          Error: {error}
        </p>
      )}
    </li>
  )
}

export default UploadItem