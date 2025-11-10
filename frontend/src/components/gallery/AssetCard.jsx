import React from 'react'
import { Maximize2 } from 'lucide-react'

const AssetCard = ({ asset, onClick }) => {
  const getThumbnail = () => {
    const smallVariant = asset.variants.find(
      (v) => v.label === 'thumbnail_small'
    )
    return smallVariant ? smallVariant.url : asset.originalUrl
  }

  return (
    <div
      className="group relative cursor-pointer overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] aspect-square"
      onClick={onClick}
    >
      <img
        src={getThumbnail()}
        alt={asset.originalName}
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
        <div className="flex h-full w-full items-center justify-center">
          <Maximize2 className="h-8 w-8 text-white" />
        </div>
      </div>
      <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/60 to-transparent p-2">
        <p className="truncate text-sm font-medium text-white">
          {asset.originalName}
        </p>
      </div>
    </div>
  )
}

export default AssetCard