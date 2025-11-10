import React from 'react'

const StatusChip = ({ status }) => {
  const getStatusText = (s) => {
    switch (s) {
      case 'pending': return 'Pending'
      case 'uploading': return 'Uploading'
      case 'processing': return 'Processing'
      case 'success':
      case 'ready': return 'Ready'
      case 'failed': return 'Failed'
      default: return 'Unknown'
    }
  }

  const getStatusClasses = (s) => {
    let classes = 'status-chip '
    switch (s) {
      case 'pending':
        classes += 'status-pending'
        break
      case 'uploading':
        classes += 'status-uploading'
        break
      case 'processing':
        classes += 'status-processing'
        break
      case 'success':
      case 'ready':
        classes += 'status-ready'
        break
      case 'failed':
        classes += 'status-failed'
        break
      default:
        classes += 'status-pending'
    }
    return classes
  }

  return (
    <span className={getStatusClasses(status)}>
      {getStatusText(status)}
    </span>
  )
}

export default StatusChip