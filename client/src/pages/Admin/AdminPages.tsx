import { useState, useEffect, useMemo } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import DataTable from '../../components/DataTable/DataTable'
import { fetchAdminPages, createAdminPage, updateAdminPage, deleteAdminPage, fetchAdminMedia } from '../../services/api'
import { supabase } from '../../utils/supabase'
import './AdminPages.css'
import './AdminForms.css'

interface Page {
  id: string
  slug: string
  title: string
  content: string
  language: string
  featured_image?: string
  meta_title: string
  meta_description: string
}

function AdminPages() {
  const [pages, setPages] = useState<Page[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Page | null>(null)

  useEffect(() => {
    loadPages()
  }, [])

  const loadPages = async () => {
    try {
      setLoading(true)
      const data = await fetchAdminPages()
      setPages(data)
    } catch (error) {
      console.error('Error loading pages:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this page?')) return

    try {
      await deleteAdminPage(id)
      loadPages()
    } catch (error) {
      console.error('Error deleting page:', error)
      alert('Failed to delete page')
    }
  }

  const columns = useMemo<ColumnDef<Page>[]>(
    () => [
      {
        accessorKey: 'title',
        header: 'Title',
        cell: ({ row }) => (
          <strong>{row.original.title}</strong>
        ),
      },
      {
        accessorKey: 'slug',
        header: 'Slug',
      },
      {
        accessorKey: 'language',
        header: 'Language',
        cell: ({ row }) => row.original.language.toUpperCase(),
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <>
            <button
              className="button-link edit-link"
              onClick={(e) => {
                e.stopPropagation()
                setEditing(row.original)
              }}
            >
              Edit
            </button>
            {' | '}
            <button
              className="button-link delete-link"
              onClick={(e) => {
                e.stopPropagation()
                handleDelete(row.original.id)
              }}
            >
              Delete
            </button>
          </>
        ),
      },
    ],
    []
  )

  return (
    <div className="admin-pages">
      <div className="wp-admin-table-container">
        <div className="wp-admin-table-header">
          <div className="wp-admin-table-title">
            <h2>Pages</h2>
            <span className="count">({pages.length})</span>
          </div>
          <button 
            className="button button-primary"
            onClick={() => setEditing({
              slug: '',
              title: '',
              content: '',
              language: 'en',
              meta_title: '',
              meta_description: '',
            } as Page)}
          >
            Add New
          </button>
        </div>

        {editing && (
          <PageEditor
            page={editing}
            onSave={() => {
              setEditing(null)
              loadPages()
            }}
            onCancel={() => setEditing(null)}
          />
        )}

        <DataTable
          data={pages}
          columns={columns}
          loading={loading}
          emptyMessage="No pages found."
          onRowClick={(page) => setEditing(page)}
        />
      </div>
    </div>
  )
}

function PageEditor({ page, onSave, onCancel }: { page: Page, onSave: () => void, onCancel: () => void }) {
  const [formData, setFormData] = useState({
    slug: page.slug || '',
    title: page.title || '',
    content: page.content || '',
    language: page.language || 'en',
    featured_image: page.featured_image || '',
    meta_title: page.meta_title || '',
    meta_description: page.meta_description || '',
  })
  const [showMediaLibrary, setShowMediaLibrary] = useState(false)
  const [media, setMedia] = useState<any[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadCategory] = useState<'media' | 'logo' | 'favicon'>('media')

  const loadMedia = async () => {
    try {
      const data = await fetchAdminMedia()
      setMedia(data)
    } catch (error) {
      console.error('Error loading media:', error)
    }
  }

  const handleFileUpload = async (file: File) => {
    try {
      setUploading(true)

      // Get token from Supabase session
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        throw new Error('Not authenticated')
      }

      const uploadFormData = new FormData()
      uploadFormData.append('file', file)
      uploadFormData.append('category', uploadCategory)
      uploadFormData.append('alt_text', `Image for ${formData.title || 'page'}`)

      const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'
      const xhr = new XMLHttpRequest()

      xhr.upload.addEventListener('progress', () => {
        // Progress handled by UI
      })

      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText)
          setFormData({ ...formData, featured_image: response.url })
          setUploading(false)
          loadMedia() // Refresh media library
        } else {
          const error = JSON.parse(xhr.responseText)
          alert(`Upload failed: ${error.error || 'Unknown error'}`)
          setUploading(false)
        }
      })

      xhr.addEventListener('error', () => {
        alert('Upload failed. Please check your connection and try again.')
        setUploading(false)
      })

      xhr.open('POST', `${API_BASE_URL}/upload`)
      xhr.setRequestHeader('Authorization', `Bearer ${session.access_token}`)
      xhr.send(uploadFormData)
    } catch (error) {
      console.error('Error uploading file:', error)
      alert('Failed to upload file')
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (page.id) {
        await updateAdminPage(page.id, formData)
      } else {
        await createAdminPage(formData)
      }
      onSave()
    } catch (error) {
      console.error('Error saving page:', error)
      alert('Failed to save page')
    }
  }

  return (
    <div className="editor-overlay">
      <div className="editor-container editor-large">
        <div className="editor-header">
          <h3>{page.id ? 'Edit Page' : 'Add New Page'}</h3>
          <button className="editor-close" onClick={onCancel} type="button">
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit} className="editor-form">
          {/* Basic Information Section */}
          <div className="form-section">
            <h3 className="form-section-title">📄 Basic Information</h3>
            
            <div className="form-two-columns">
              <div className="form-field">
                <label>
                  Title <span className="required">*</span>
                </label>
                <p className="field-description">The title of the page as it will appear on the site.</p>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  placeholder="Enter page title"
                />
              </div>

              <div className="form-field">
                <label>
                  Slug <span className="required">*</span>
                </label>
                <p className="field-description">URL-friendly version of the title (e.g., "about-us").</p>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                  required
                  placeholder="page-slug"
                />
              </div>
            </div>

            <div className="form-field">
              <label>Language</label>
              <p className="field-description">Select the language for this page.</p>
              <select
                value={formData.language}
                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
              >
                <option value="en">🇬🇧 English</option>
                <option value="fr">🇫🇷 Français</option>
              </select>
            </div>
          </div>

          {/* Featured Image Section */}
          <div className="form-section">
            <h3 className="form-section-title">🖼️ Featured Image</h3>
            <p className="form-section-description">Add an image that will be displayed with this page.</p>
            
            <div className="form-field">
              <div className="image-upload-field">
                {formData.featured_image ? (
                  <div className="image-preview-container has-image">
                    <img src={formData.featured_image} alt="Page preview" />
                    <div className="image-preview-actions">
                      <button
                        type="button"
                        className="button-link"
                        onClick={() => setFormData({ ...formData, featured_image: '' })}
                      >
                        Remove Image
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="image-preview-container">
                    <p style={{ textAlign: 'center', color: '#646970', padding: '20px' }}>
                      No image selected
                    </p>
                  </div>
                )}
                
                <div className="input-group">
                  <input
                    type="text"
                    placeholder="Or enter image URL directly"
                    value={formData.featured_image}
                    onChange={(e) => setFormData({ ...formData, featured_image: e.target.value })}
                  />
                  <button
                    type="button"
                    className="button-secondary"
                    onClick={() => {
                      setShowMediaLibrary(!showMediaLibrary)
                      if (!showMediaLibrary) loadMedia()
                    }}
                  >
                    {showMediaLibrary ? 'Hide Library' : '📚 Media Library'}
                  </button>
                  <label className="image-upload-button">
                    {uploading ? '⏳ Uploading...' : '📤 Upload Image'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleFileUpload(file)
                      }}
                      disabled={uploading}
                    />
                  </label>
                </div>
                {showMediaLibrary && (
                  <div className="media-library">
                    <div className="media-library-header">
                      <h3>Select Image</h3>
                      <button
                        type="button"
                        className="button-link"
                        onClick={() => setShowMediaLibrary(false)}
                      >
                        Close
                      </button>
                    </div>
                    <div className="media-grid">
                      {media.filter(m => m.mime_type?.startsWith('image/')).map((item) => (
                        <div
                          key={item.id}
                          className={`media-item ${formData.featured_image === item.url ? 'selected' : ''}`}
                          onClick={() => {
                            setFormData({ ...formData, featured_image: item.url })
                            setShowMediaLibrary(false)
                          }}
                        >
                          <img src={item.url} alt={item.alt_text || item.filename} />
                          <div className="media-item-info">
                            <span>{item.original_filename}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="form-section">
            <h3 className="form-section-title">📝 Page Content</h3>
            <p className="form-section-description">The main content of the page. You can use HTML formatting.</p>
            
            <div className="form-field">
              <label>Content</label>
              <p className="field-description">Enter the page content. HTML is supported.</p>
              <textarea
                rows={12}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Enter page content here..."
              />
            </div>
          </div>

          {/* SEO Section */}
          <div className="form-section">
            <h3 className="form-section-title">🔍 SEO Settings</h3>
            <p className="form-section-description">Optimize how this page appears in search engines.</p>
            
            <div className="form-field">
              <label>Meta Title</label>
              <p className="field-description">Title for search engines (leave empty to use page title).</p>
              <input
                type="text"
                value={formData.meta_title}
                onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                placeholder="SEO title (optional)"
                maxLength={60}
              />
              <span className="help-text">
                {formData.meta_title.length}/60 characters
              </span>
            </div>

            <div className="form-field">
              <label>Meta Description</label>
              <p className="field-description">Brief description for search engines (recommended: 150-160 characters).</p>
              <textarea
                rows={3}
                value={formData.meta_description}
                onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                placeholder="Enter meta description..."
                maxLength={160}
              />
              <span className="help-text">
                {formData.meta_description.length}/160 characters
              </span>
            </div>
          </div>

          <div className="editor-actions">
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {page.id ? 'Update Page' : 'Create Page'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AdminPages

