import React, { useEffect, useState } from 'react'
import useAssets from '../../hooks/useAssets'
import { assetService } from '../../api/assetService'
import Spinner from '../common/Spinner'
import AssetCard from './AssetCard'
import VariantModal from './VariantModal'

const AssetGrid = () => {
  const { assets, fetchAssets, isLoading, error } = useAssets()
  const [selectedAsset, setSelectedAsset] = useState(null)

  useEffect(() => {
    fetchAssets()
  }, [fetchAssets])

  if (isLoading) {
    return (
      <div className="flex justify-center p-12">
        <Spinner size={48} />
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-500 bg-red-100 p-4 text-center text-red-700">
        <p>Error: {error}</p>
      </div>
    )
  }

  if (assets.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-[var(--color-border)] p-12 text-center">
        <p className="text-lg font-medium text-[var(--color-secondary-foreground)]">
          No assets found.
        </p>
        <p className="text-sm text-[var(--color-secondary-foreground)]">
          Upload some images to see them here.
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {assets.map((asset) => (
          <AssetCard
            key={asset._id}
            asset={asset}
            onClick={() => setSelectedAsset(asset)}
          />
        ))}
      </div>
      {selectedAsset && (
        <VariantModal
          asset={selectedAsset}
          onClose={() => setSelectedAsset(null)}
        />
      )}
    </>
  )
}

export default AssetGrid