import apiClient from './apiClient'
import axios from 'axios'

export const assetService = {
  getUploadUrl: async (fileName, fileType) => {
    const response = await apiClient.post('/assets/generate-upload-url', {
      fileName,
      fileType,
    })
    return response.data
  },

  uploadFileToS3: async (uploadUrl, file, onProgress) => {
    const response = await axios.put(uploadUrl, file, {
      headers: {
        'Content-Type': file.type,
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        )
        onProgress(percentCompleted)
      },
    })
    return response
  },

  listAssets: async () => {
    const response = await apiClient.get('/assets')
    return response.data
  },

  getAssetById: async (id) => {
    const response = await apiClient.get(`/assets/${id}`)
    return response.data
  },
}