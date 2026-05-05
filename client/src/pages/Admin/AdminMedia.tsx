import { useState, useEffect } from 'react'
import { fetchAdminMedia, deleteAdminMedia } from '../../services/api'
import { supabase } from '../../utils/supabase'
import './AdminMedia.css'

interface Media {
  id: string
  filename: string
  original_filename: string
  url: string
  mime_type?: string
  size?: number
  alt_text?: string
  created_at: string
}

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

function AdminMedia() {
  const [media, setMedia] = useState<Media[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [uploadCategory, setUploadCategory] = useState<'media' | 'logo' | 'favicon'>('media')
  const [uploadProgress, setUploadProgress] = useState(0)

  useEffect(() => {
    loadMedia()
  }, [])

  const loadMedia = async () => {
    try {
      setLoading(true)
      const data = await fetchAdminMedia()
      setMedia(data)
    } catch (error: any) {
      console.error('Error loading media:', error)
      if (error.message?.includes('Failed to fetch') || error.message?.includes('ERR_CONNECTION_REFUSED')) {
        alert('Cannot connect to server. Please make sure the backend server is running.\n\nTo start the server:\n1. Open a terminal\n2. Run: cd server && npm run dev\n\nOr from the root: npm run dev')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this media item? This will also delete the file from storage.')) return

    try {
      await deleteAdminMedia(id)
      loadMedia()
    } catch (error) {
      console.error('Error deleting media:', error)
      alert('Failed to delete media')
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB')
      return
    }

    setUploading(true)
    setUploadProgress(0)

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        alert('Not authenticated')
        setUploading(false)
        return
      }

      const formData = new FormData()
      formData.append('file', file)
      formData.append('category', uploadCategory)
      formData.append('alt_text', '')

      const xhr = new XMLHttpRequest()

      // Track upload progress
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const percentComplete = (event.loaded / event.total) * 100
          setUploadProgress(percentComplete)
        }
      })

      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          loadMedia()
          e.target.value = '' // Reset input
          setUploadProgress(0)
        } else {
          try {
            const error = xhr.responseText ? JSON.parse(xhr.responseText) : { error: 'Unknown error' }
            alert(error.error || 'Failed to upload media')
          } catch (parseError) {
            if (xhr.status === 0) {
              alert('Cannot connect to server. Please make sure the backend server is running on port 3001.\n\nTo start the server:\n1. Open a terminal\n2. Run: cd server && npm run dev')
            } else {
              alert(`Upload failed with status ${xhr.status}. Please try again.`)
            }
          }
        }
        setUploading(false)
      })

      xhr.addEventListener('error', () => {
        if (xhr.status === 0) {
          alert('Cannot connect to server. Please make sure the backend server is running on port 3001.\n\nTo start the server:\n1. Open a terminal\n2. Run: cd server && npm run dev')
        } else {
          alert('Upload failed. Please check your connection and try again.')
        }
        setUploading(false)
        setUploadProgress(0)
      })

      xhr.open('POST', `${API_BASE_URL}/upload`)
      xhr.setRequestHeader('Authorization', `Bearer ${session.access_token}`)
      xhr.send(formData)
    } catch (error) {
      console.error('Error uploading media:', error)
      alert('Failed to upload media')
      setUploading(false)
      setUploadProgress(0)
    }
  }

  if (loading) {
    return <div className="wp-admin-loading">Loading media...</div>
  }

  const isImage = (mimeType?: string) => {
    return mimeType?.startsWith('image/')
  }

  return (
    <div className="wp-admin-media-container">
      <div className="wp-admin-table-header">
        <div className="wp-admin-table-title">
          <h2>Media Library</h2>
          <span className="count">({media.length})</span>
        </div>
        <div className="wp-admin-upload">
          <div className="upload-controls">
            <select
              className="regular-text"
              value={uploadCategory}
              onChange={(e) => setUploadCategory(e.target.value as 'media' | 'logo' | 'favicon')}
              style={{ marginRight: '10px' }}
            >
              <option value="media">Media</option>
              <option value="logo">Logo</option>
              <option value="favicon">Favicon</option>
            </select>
            <label className="button button-primary">
              {uploading ? `Uploading... ${Math.round(uploadProgress)}%` : 'Upload File'}
              <input
                type="file"
                style={{ display: 'none' }}
                onChange={handleFileUpload}
                disabled={uploading}
                accept={uploadCategory === 'favicon' ? 'image/x-icon,image/png,image/svg+xml' : uploadCategory === 'logo' ? 'image/*' : '*'}
              />
            </label>
          </div>
          {uploading && (
            <div className="upload-progress">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="wp-admin-media-grid">
        {media.length === 0 ? (
          <div className="no-items">No media files found.</div>
        ) : (
          media.map((item) => (
            <div key={item.id} className="wp-admin-media-item">
              <div className="media-thumbnail">
                {isImage(item.mime_type) ? (
                  <img src={item.url} alt={item.alt_text || item.original_filename} />
                ) : (
                  <div className="media-icon">
                    <svg width="48" height="48" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M4 2h12v16H4V2zm2 2v12h8V4H6z"/>
                    </svg>
                  </div>
                )}
              </div>
              <div className="media-info">
                <div className="media-title">{item.original_filename}</div>
                <div className="media-meta">
                  {item.size && <span>{(item.size / 1024).toFixed(1)} KB</span>}
                  {item.mime_type && <span>{item.mime_type}</span>}
                </div>
                <div className="media-actions">
                  <button
                    className="button-link"
                    onClick={() => navigator.clipboard.writeText(item.url)}
                  >
                    Copy URL
                  </button>
                  {' | '}
                  <button
                    className="button-link delete-link"
                    onClick={() => handleDelete(item.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default AdminMedia

