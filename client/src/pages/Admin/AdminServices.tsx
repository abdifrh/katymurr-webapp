import { useState, useEffect, useMemo } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import DataTable from '../../components/DataTable/DataTable'
import { fetchAdminServices, createAdminService, updateAdminService, deleteAdminService, fetchAdminMedia } from '../../services/api'
import { supabase } from '../../utils/supabase'
import './AdminServices.css'
import './AdminForms.css'

interface Service {
  id?: string
  slug: string
  title: string
  subtitle?: string
  description?: string
  content?: any
  language: string
  featured_image?: string
  icon?: string
  order_index: number
  published: boolean
  meta_title?: string
  meta_description?: string
  meta_keywords?: string
}

function AdminServices() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Service | null>(null)

  useEffect(() => {
    loadServices()
  }, [])

  const loadServices = async () => {
    try {
      setLoading(true)
      const data = await fetchAdminServices()
      setServices(data)
    } catch (error) {
      console.error('Error loading services:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return

    try {
      await deleteAdminService(id)
      loadServices()
    } catch (error) {
      console.error('Error deleting service:', error)
      alert('Failed to delete service')
    }
  }

  const columns = useMemo<ColumnDef<Service>[]>(
    () => [
      {
        accessorKey: 'title',
        header: 'Title',
        cell: ({ row }) => (
          <div>
            <strong>{row.original.title}</strong>
            {row.original.subtitle && (
              <div className="row-actions">{row.original.subtitle}</div>
            )}
          </div>
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
        accessorKey: 'order_index',
        header: 'Order',
      },
      {
        accessorKey: 'published',
        header: 'Status',
        cell: ({ row }) =>
          row.original.published ? (
            <span className="status-publish">Published</span>
          ) : (
            <span className="status-draft">Draft</span>
          ),
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
                if (row.original.id) handleDelete(row.original.id)
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
    <div className="wp-admin-table-container">
      <div className="wp-admin-table-header">
        <div className="wp-admin-table-title">
          <h2>Services</h2>
          <span className="count">({services.length})</span>
        </div>
        <button 
          className="button button-primary"
          onClick={() => setEditing({
            slug: '',
            title: '',
            language: 'en',
            order_index: 0,
            published: true,
          } as Service)}
        >
          Add New
        </button>
      </div>

      {editing && (
        <ServiceEditor
          service={editing}
          onSave={() => {
            setEditing(null)
            loadServices()
          }}
          onCancel={() => setEditing(null)}
        />
      )}

      <DataTable
        data={services}
        columns={columns}
        loading={loading}
        emptyMessage="No services found."
        onRowClick={(service) => setEditing(service)}
      />
    </div>
  )
}

interface ContentSection {
  type: 'text' | 'list' | 'steps' | 'roi' | 'cta'
  title?: string
  content?: string
  items?: string[]
  steps?: { title: string; description: string }[]
  value?: string
}

function ServiceEditor({ service, onSave, onCancel }: { service: Service, onSave: () => void, onCancel: () => void }) {
  // Parse existing content or initialize empty
  const getInitialSections = (): ContentSection[] => {
    try {
      if (service.content) {
        // Handle both object and string JSON
        let contentObj = service.content
        if (typeof service.content === 'string') {
          contentObj = JSON.parse(service.content)
        }
        if (typeof contentObj === 'object' && contentObj !== null && 'sections' in contentObj) {
          return (contentObj as { sections: ContentSection[] }).sections || []
        }
      }
    } catch (error) {
      console.error('Error parsing content:', error)
    }
    return []
  }

  const [sections, setSections] = useState<ContentSection[]>(getInitialSections())
  const [formData, setFormData] = useState({
    slug: service.slug || '',
    title: service.title || '',
    subtitle: service.subtitle || '',
    description: service.description || '',
    language: service.language || 'en',
    featured_image: service.featured_image || '',
    icon: service.icon || '',
    order_index: service.order_index || 0,
    published: service.published !== undefined ? service.published : true,
    meta_title: service.meta_title || '',
    meta_description: service.meta_description || '',
    meta_keywords: service.meta_keywords || '',
  })
  const [showMediaLibrary, setShowMediaLibrary] = useState(false)
  const [media, setMedia] = useState<any[]>([])
  const [uploading, setUploading] = useState(false)

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
      uploadFormData.append('category', 'media')
      uploadFormData.append('alt_text', `Image for ${formData.title || 'service'}`)

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
      // Convert sections to JSON structure
      const contentData = {
        sections: sections
      }

      const serviceData = {
        ...formData,
        content: contentData,
      }

      if (service.id) {
        await updateAdminService(service.id, serviceData)
      } else {
        await createAdminService(serviceData)
      }

      onSave()
    } catch (error) {
      console.error('Error saving service:', error)
      alert('Failed to save service')
    }
  }

  return (
    <div className="editor-overlay">
      <div className="editor-container editor-large">
        <div className="editor-header">
          <h3>{service.id ? 'Edit Service' : 'Add New Service'}</h3>
          <button className="editor-close" onClick={onCancel} type="button">
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit} className="editor-form">
          <div className="form-field">
            <label>Slug *</label>
            <input
              type="text"
              className="regular-text"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              required
            />
          </div>

          <div className="form-field">
            <label>Title *</label>
            <input
              type="text"
              className="regular-text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="form-field">
            <label>Subtitle</label>
            <input
              type="text"
              className="regular-text"
              value={formData.subtitle}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
            />
          </div>

          <div className="form-field">
            <label>Description</label>
            <textarea
              className="large-text"
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="form-field content-sections">
            <label>Content Sections</label>
            <div className="sections-list">
              {sections.map((section, index) => (
                <div key={index} className="section-item">
                  <div className="section-header">
                    <select
                      className="regular-text"
                      value={section.type}
                      onChange={(e) => {
                        const newSections = [...sections]
                        newSections[index] = { ...section, type: e.target.value as ContentSection['type'] }
                        setSections(newSections)
                      }}
                    >
                      <option value="text">Text</option>
                      <option value="list">List</option>
                      <option value="steps">Steps</option>
                      <option value="roi">ROI</option>
                      <option value="cta">Call to Action</option>
                    </select>
                    <button
                      type="button"
                      className="button-link delete-link"
                      onClick={() => {
                        setSections(sections.filter((_, i) => i !== index))
                      }}
                    >
                      Remove
                    </button>
                  </div>

                  <div className="section-fields">
                    <div className="form-field">
                      <label>Section Title</label>
                      <input
                        type="text"
                        className="regular-text"
                        value={section.title || ''}
                        onChange={(e) => {
                          const newSections = [...sections]
                          newSections[index] = { ...section, title: e.target.value }
                          setSections(newSections)
                        }}
                      />
                    </div>

                    {section.type === 'text' && (
                      <div className="form-field">
                        <label>Content</label>
                        <textarea
                          className="large-text"
                          rows={5}
                          value={section.content || ''}
                          onChange={(e) => {
                            const newSections = [...sections]
                            newSections[index] = { ...section, content: e.target.value }
                            setSections(newSections)
                          }}
                        />
                      </div>
                    )}

                    {section.type === 'list' && (
                      <div className="form-field">
                        <label>List Items (one per line)</label>
                        <textarea
                          className="large-text"
                          rows={5}
                          value={(section.items || []).join('\n')}
                          onChange={(e) => {
                            const newSections = [...sections]
                            newSections[index] = {
                              ...section,
                              items: e.target.value.split('\n').filter(item => item.trim())
                            }
                            setSections(newSections)
                          }}
                        />
                      </div>
                    )}

                    {section.type === 'steps' && (
                      <div className="form-field">
                        <label>Steps</label>
                        {(section.steps || []).map((step, stepIndex) => (
                          <div key={stepIndex} className="step-item">
                            <input
                              type="text"
                              className="regular-text"
                              placeholder="Step title"
                              value={step.title}
                              onChange={(e) => {
                                const newSections = [...sections]
                                const newSteps = [...(section.steps || [])]
                                newSteps[stepIndex] = { ...step, title: e.target.value }
                                newSections[index] = { ...section, steps: newSteps }
                                setSections(newSections)
                              }}
                            />
                            <textarea
                              className="large-text"
                              rows={2}
                              placeholder="Step description"
                              value={step.description}
                              onChange={(e) => {
                                const newSections = [...sections]
                                const newSteps = [...(section.steps || [])]
                                newSteps[stepIndex] = { ...step, description: e.target.value }
                                newSections[index] = { ...section, steps: newSteps }
                                setSections(newSections)
                              }}
                            />
                            <button
                              type="button"
                              className="button-link delete-link"
                              onClick={() => {
                                const newSections = [...sections]
                                const newSteps = (section.steps || []).filter((_, i) => i !== stepIndex)
                                newSections[index] = { ...section, steps: newSteps }
                                setSections(newSections)
                              }}
                            >
                              Remove Step
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          className="button"
                          onClick={() => {
                            const newSections = [...sections]
                            const newSteps = [...(section.steps || []), { title: '', description: '' }]
                            newSections[index] = { ...section, steps: newSteps }
                            setSections(newSections)
                          }}
                        >
                          Add Step
                        </button>
                      </div>
                    )}

                    {section.type === 'roi' && (
                      <>
                        <div className="form-field">
                          <label>ROI Value</label>
                          <input
                            type="text"
                            className="regular-text"
                            value={section.value || ''}
                            onChange={(e) => {
                              const newSections = [...sections]
                              newSections[index] = { ...section, value: e.target.value }
                              setSections(newSections)
                            }}
                          />
                        </div>
                        <div className="form-field">
                          <label>ROI Items (one per line)</label>
                          <textarea
                            className="large-text"
                            rows={5}
                            value={(section.items || []).join('\n')}
                            onChange={(e) => {
                              const newSections = [...sections]
                              newSections[index] = {
                                ...section,
                                items: e.target.value.split('\n').filter(item => item.trim())
                              }
                              setSections(newSections)
                            }}
                          />
                        </div>
                      </>
                    )}

                    {section.type === 'cta' && (
                      <div className="form-field">
                        <label>CTA Content</label>
                        <textarea
                          className="large-text"
                          rows={3}
                          value={section.content || ''}
                          onChange={(e) => {
                            const newSections = [...sections]
                            newSections[index] = { ...section, content: e.target.value }
                            setSections(newSections)
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <button
                type="button"
                className="button"
                onClick={() => {
                  setSections([...sections, { type: 'text', title: '', content: '' }])
                }}
              >
                Add Section
              </button>
            </div>
          </div>

          <div className="form-field">
            <label>Language</label>
            <select
              className="regular-text"
              value={formData.language}
              onChange={(e) => setFormData({ ...formData, language: e.target.value })}
            >
              <option value="en">English</option>
              <option value="fr">Français</option>
            </select>
          </div>

          <div className="form-field">
            <label>Featured Image</label>
            <p className="description">This image will be used as background in the service detail page header.</p>
            <div className="image-upload-field">
              {formData.featured_image ? (
                <div className="image-preview-container has-image">
                  <img src={formData.featured_image} alt="Service preview" />
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

          <div className="form-field">
            <label>Icon</label>
            <input
              type="text"
              className="regular-text"
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
            />
          </div>

          <div className="form-field">
            <label>Order Index</label>
            <input
              type="number"
              className="small-text"
              value={formData.order_index}
              onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })}
            />
          </div>

          <div className="form-field">
            <label>
              <input
                type="checkbox"
                checked={formData.published}
                onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
              />
              Published
            </label>
          </div>

          <div className="form-field">
            <label>Meta Title</label>
            <input
              type="text"
              className="regular-text"
              value={formData.meta_title}
              onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
            />
          </div>

          <div className="form-field">
            <label>Meta Description</label>
            <textarea
              className="large-text"
              rows={3}
              value={formData.meta_description}
              onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
            />
          </div>

          <div className="form-field">
            <label>Meta Keywords</label>
            <input
              type="text"
              className="regular-text"
              value={formData.meta_keywords}
              onChange={(e) => setFormData({ ...formData, meta_keywords: e.target.value })}
            />
          </div>

          <div className="editor-actions">
            <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Service</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AdminServices

