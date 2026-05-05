import { useState, useEffect, useMemo } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import DataTable from '../../components/DataTable/DataTable'
import {
  fetchAdminClientLogos,
  createAdminClientLogo,
  updateAdminClientLogo,
  deleteAdminClientLogo,
} from '../../services/api'
import { supabase } from '../../utils/supabase'
import './AdminClientLogos.css'
import './AdminForms.css'

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

interface ClientLogo {
  id: string
  name: string
  logo_url: string
  alt_text?: string
  website_url?: string
  order_index: number
  is_active: boolean
  created_at: string
}

function AdminClientLogos() {
  const [logos, setLogos] = useState<ClientLogo[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<ClientLogo | null>(null)

  useEffect(() => {
    loadLogos()
  }, [])

  const loadLogos = async () => {
    try {
      setLoading(true)
      const data = await fetchAdminClientLogos()
      setLogos(data)
    } catch (error) {
      console.error('Error loading logos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this logo?')) return

    try {
      await deleteAdminClientLogo(id)
      loadLogos()
    } catch (error) {
      console.error('Error deleting logo:', error)
      alert('Failed to delete logo')
    }
  }

  const columns = useMemo<ColumnDef<ClientLogo>[]>(
    () => [
      {
        accessorKey: 'logo_url',
        header: 'Logo',
        cell: ({ row }) => (
          <div className="logo-preview-cell">
            <img
              src={row.original.logo_url}
              alt={row.original.alt_text || row.original.name}
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.style.display = 'none'
              }}
            />
          </div>
        ),
      },
      {
        accessorKey: 'name',
        header: 'Name',
        cell: ({ row }) => <strong>{row.original.name}</strong>,
      },
      {
        accessorKey: 'order_index',
        header: 'Order',
        cell: ({ row }) => <span className="order-badge">{row.original.order_index}</span>,
      },
      {
        accessorKey: 'is_active',
        header: 'Status',
        cell: ({ row }) =>
          row.original.is_active ? (
            <span className="status-publish">Active</span>
          ) : (
            <span className="status-draft">Inactive</span>
          ),
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <div className="row-actions">
            <button
              className="button-link edit-link"
              onClick={(e) => {
                e.stopPropagation()
                setEditing(row.original)
              }}
            >
              Edit
            </button>
            <span className="separator">|</span>
            <button
              className="button-link delete-link"
              onClick={(e) => {
                e.stopPropagation()
                handleDelete(row.original.id)
              }}
            >
              Delete
            </button>
          </div>
        ),
      },
    ],
    []
  )

  return (
    <div className="admin-client-logos">
      <div className="admin-section-header">
        <h2>Client Logos</h2>
        <button
          className="btn btn-primary"
          onClick={() =>
            setEditing({
              id: '',
              name: '',
              logo_url: '',
              alt_text: '',
              website_url: '',
              order_index: logos.length,
              is_active: true,
              created_at: '',
            })
          }
        >
          Add New Logo
        </button>
      </div>

      {editing && (
        <LogoEditor
          logo={editing}
          onSave={() => {
            setEditing(null)
            loadLogos()
          }}
          onCancel={() => setEditing(null)}
        />
      )}

      <div className="wp-admin-table-container">
        <DataTable
          data={logos}
          columns={columns}
          loading={loading}
          emptyMessage="No client logos found. Add your first logo to get started."
          onRowClick={(logo) => setEditing(logo)}
        />
      </div>
    </div>
  )
}

function LogoEditor({
  logo,
  onSave,
  onCancel,
}: {
  logo: ClientLogo
  onSave: () => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState({
    name: logo.name || '',
    logo_url: logo.logo_url || '',
    alt_text: logo.alt_text || '',
    website_url: logo.website_url || '',
    order_index: logo.order_index || 0,
    is_active: logo.is_active ?? true,
  })
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    // Validate file size (5MB max for logos)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB')
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

      const formDataUpload = new FormData()
      formDataUpload.append('file', file)
      formDataUpload.append('category', 'logo')
      formDataUpload.append('alt_text', formData.alt_text || formData.name || '')

      const xhr = new XMLHttpRequest()

      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const percentComplete = (event.loaded / event.total) * 100
          setUploadProgress(percentComplete)
        }
      })

      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          try {
            const response = JSON.parse(xhr.responseText)
            setFormData(prev => ({ ...prev, logo_url: response.url }))
            setUploadProgress(0)
          } catch {
            alert('Failed to parse upload response')
          }
        } else {
          try {
            const error = xhr.responseText ? JSON.parse(xhr.responseText) : { error: 'Unknown error' }
            alert(error.error || 'Failed to upload image')
          } catch {
            alert(`Upload failed with status ${xhr.status}`)
          }
        }
        setUploading(false)
      })

      xhr.addEventListener('error', () => {
        alert('Upload failed. Please check your connection and try again.')
        setUploading(false)
        setUploadProgress(0)
      })

      xhr.open('POST', `${API_BASE_URL}/upload`)
      xhr.setRequestHeader('Authorization', `Bearer ${session.access_token}`)
      xhr.send(formDataUpload)
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Failed to upload image')
      setUploading(false)
      setUploadProgress(0)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      if (logo.id) {
        await updateAdminClientLogo(logo.id, formData)
      } else {
        await createAdminClientLogo(formData)
      }
      onSave()
    } catch (error) {
      console.error('Error saving logo:', error)
      alert('Failed to save logo')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="editor-overlay">
      <div className="editor-container">
        <div className="editor-header">
          <h3>{logo.id ? 'Edit Logo' : 'Add New Logo'}</h3>
          <button className="editor-close" onClick={onCancel} type="button">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="editor-form">
          <div className="form-row">
            <div className="form-group full-width">
              <label htmlFor="name">
                Client Name <span className="required">*</span>
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="e.g., Microsoft, Google, Apple"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group full-width">
              <label htmlFor="logo_url">
                Logo <span className="required">*</span>
              </label>
              <div className="upload-field">
                <input
                  type="url"
                  id="logo_url"
                  value={formData.logo_url}
                  onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                  placeholder="https://example.com/logo.png"
                  required
                  disabled={uploading}
                />
                <label className={`btn btn-secondary upload-btn ${uploading ? 'uploading' : ''}`}>
                  {uploading ? `${Math.round(uploadProgress)}%` : 'Upload'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={uploading}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>
              {uploading && (
                <div className="upload-progress-bar">
                  <div
                    className="upload-progress-fill"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              )}
              <p className="description">Upload an image or paste a URL</p>
              {formData.logo_url && (
                <div className="logo-preview">
                  <img
                    src={formData.logo_url}
                    alt="Preview"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group full-width">
              <label htmlFor="alt_text">Alt Text</label>
              <input
                type="text"
                id="alt_text"
                value={formData.alt_text}
                onChange={(e) => setFormData({ ...formData, alt_text: e.target.value })}
                placeholder="Logo description for accessibility"
              />
              <p className="description">Describe the logo for screen readers</p>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group full-width">
              <label htmlFor="website_url">Website URL (Optional)</label>
              <input
                type="url"
                id="website_url"
                value={formData.website_url}
                onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                placeholder="https://client-website.com"
              />
              <p className="description">Link to client's website (optional)</p>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="order_index">Display Order</label>
              <input
                type="number"
                id="order_index"
                value={formData.order_index}
                onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) })}
                min="0"
              />
              <p className="description">Lower numbers appear first</p>
            </div>

            <div className="form-group">
              <label className="checkbox-wrapper">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                />
                <span>Active</span>
              </label>
              <p className="description">Only active logos are displayed</p>
            </div>
          </div>

          <div className="editor-actions">
            <button type="button" onClick={onCancel} className="btn btn-secondary" disabled={saving}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : logo.id ? 'Update Logo' : 'Add Logo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AdminClientLogos
