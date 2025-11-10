import React from 'react'
import { X, Download, Link as LinkIcon } from 'lucide-react'
import filesize from 'filesize'

const VariantModal = ({ asset, onClose }) => {
  const allVariants = [
    {
      label: 'Original',
      width: asset.metadata.width,
      height: asset.metadata.height,
      size: asset.metadata.size,
      url: asset.originalUrl,
    },
    ...asset.variants,
  ]

  const copyToClipboard = (url) => {
    navigator.clipboard.writeText(url)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl rounded-lg bg-[var(--color-card)] p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-[var(--color-foreground)] transition-colors hover:bg-[var(--color-secondary)]"
        >
          <X size={24} />
        </button>

        <h2 className="mb-4 truncate text-2xl font-bold">
          {asset.originalName}
        </h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="flex items-center justify-center rounded-lg bg-[var(--color-secondary)] p-4">
            <img
              src={asset.originalUrl}
              alt="Original preview"
              className="max-h-[400px] w-auto rounded-md object-contain"
            />
          </div>

          <div className="max-h-[450px] space-y-4 overflow-y-auto">
            <h3 className="text-lg font-semibold">Generated Variants</h3>
            <ul className="divide-y divide-[var(--color-border)]">
              {allVariants.map((variant) => (
                <li key={variant.label} className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium capitalize">
                      {variant.label.replace('_', ' ')}
                    </p>
                    <p className="text-sm text-[var(--color-secondary-foreground)]">
                      {variant.width} x {variant.height} px
                      {' | '}
                      {filesize(variant.size || 0)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => copyToClipboard(variant.url)}
                      title="Copy URL"
                      className="rounded p-2 text-[var(--color-secondary-foreground)] transition-colors hover:bg-[var(--color-secondary)]"
                    >
                      <LinkIcon size={18} />
                    </button>
                    <a
                      href={variant.url}
                      download
                      title="Download"
      
                      className="rounded p-2 text-[var(--color-secondary-foreground)] transition-colors hover:bg-[var(--color-secondary)]"
                    >
                      <Download size={18} />
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VariantModal