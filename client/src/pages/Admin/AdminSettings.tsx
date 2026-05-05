import { useState, useEffect } from 'react'
import { fetchAdminMedia, fetchAdminSettings, updateAdminSetting } from '../../services/api'
import { supabase } from '../../utils/supabase'
import './AdminSettings.css'
import './AdminForms.css'

interface Setting {
  id?: string
  key: string
  value: string
  type: 'text' | 'image' | 'json' | 'boolean'
  category: string
  language?: string
  description?: string
}

interface MediaItem {
  id: string
  url: string
  mime_type?: string
  original_filename?: string
}

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

const categories = [
  { id: 'branding', label: 'Branding', icon: '🎨' },
  { id: 'seo', label: 'SEO', icon: '🔍' },
  { id: 'hero', label: 'Hero Section', icon: '🖼️' },
  { id: 'cta', label: 'CTA Section', icon: '📣' },
  { id: 'contact', label: 'Contact', icon: '📧' },
  { id: 'social', label: 'Social Media', icon: '📱' },
  { id: 'analytics', label: 'Analytics', icon: '📊' },
  { id: 'footer', label: 'Footer', icon: '⬇️' },
]

function AdminSettings() {
  const [settings, setSettings] = useState<Setting[]>([])
  const [localValues, setLocalValues] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState<string>('branding')
  const [saving, setSaving] = useState<string | null>(null)
  const [uploading, setUploading] = useState<string | null>(null)
  const [mediaLibrary, setMediaLibrary] = useState<MediaItem[]>([])

  useEffect(() => {
    loadSettings()
  }, [activeCategory])

  useEffect(() => {
    loadMediaLibrary()
  }, [])

  const loadSettings = async () => {
    try {
      setLoading(true)
      const data = await fetchAdminSettings(activeCategory)
      const settingsArray = Array.isArray(data) ? data : Object.values(data)
      setSettings(settingsArray)

      // Initialize local values
      const initialValues: Record<string, string> = {}
      settingsArray.forEach(setting => {
        const key = setting.id || `${setting.key}_${setting.language || 'global'}`
        initialValues[key] = setting.value || ''
      })
      setLocalValues(initialValues)
    } catch (error) {
      console.error('Error loading settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadMediaLibrary = async () => {
    try {
      const data = await fetchAdminMedia()
      setMediaLibrary(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error loading media library:', error)
    }
  }

  const handleSave = async (setting: Setting, newValue: string) => {
    try {
      const settingKey = setting.id || setting.key
      setSaving(settingKey)

      await updateAdminSetting(setting.key, newValue, setting.language || undefined)

      // Update local state
      const key = setting.id || `${setting.key}_${setting.language || 'global'}`
      setLocalValues(prev => ({ ...prev, [key]: newValue }))

      // Update settings state
      setSettings(prev => prev.map(s => {
        if ((s.id && s.id === setting.id) || (s.key === setting.key && s.language === setting.language)) {
          return { ...s, value: newValue }
        }
        return s
      }))

      setSaving(null)
    } catch (error) {
      console.error('Error saving setting:', error)
      alert('Failed to save setting')
      setSaving(null)
    }
  }

  const handleValueChange = (setting: Setting, newValue: string) => {
    const key = setting.id || `${setting.key}_${setting.language || 'global'}`
    setLocalValues(prev => ({ ...prev, [key]: newValue }))
  }

  const getMediaOptionsForSetting = (setting: Setting) => {
    const imageItems = mediaLibrary.filter(item => item.mime_type?.startsWith('image/'))

    if (setting.key === 'favicon_url') {
      return imageItems.filter(item => {
        const mime = item.mime_type || ''
        const url = (item.url || '').toLowerCase()
        return (
          mime === 'image/png' ||
          mime === 'image/svg+xml' ||
          mime === 'image/x-icon' ||
          mime === 'image/vnd.microsoft.icon' ||
          url.endsWith('.png') ||
          url.endsWith('.svg') ||
          url.endsWith('.ico')
        )
      })
    }

    if (setting.key === 'logo_url') {
      return imageItems
    }

    return []
  }


  const handleVideoUpload = async (setting: Setting, file: File) => {
    try {
      setUploading(setting.key)

      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        alert('Not authenticated')
        setUploading(null)
        return
      }

      const formData = new FormData()
      formData.append('file', file)
      formData.append('category', 'video')

      const xhr = new XMLHttpRequest()

      xhr.addEventListener('load', async () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText)
          await handleSave(setting, response.url)
        } else {
          alert('Failed to upload video')
        }
        setUploading(null)
      })

      xhr.addEventListener('error', () => {
        alert('Upload failed')
        setUploading(null)
      })

      xhr.open('POST', `${API_BASE_URL}/upload`)
      xhr.setRequestHeader('Authorization', `Bearer ${session.access_token}`)
      xhr.send(formData)
    } catch (error) {
      console.error('Error uploading video:', error)
      alert('Failed to upload video')
      setUploading(null)
    }
  }

  const handleImageUpload = async (setting: Setting, file: File) => {
    try {
      setUploading(setting.key)

      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        alert('Not authenticated')
        setUploading(null)
        return
      }

      const formData = new FormData()
      const category = setting.key.includes('logo') ? 'logo' :
        setting.key.includes('favicon') ? 'favicon' :
          'media'
      formData.append('file', file)
      formData.append('category', category)

      const xhr = new XMLHttpRequest()

      xhr.addEventListener('load', async () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText)
          await handleSave(setting, response.url)
        } else {
          alert('Failed to upload image')
        }
        setUploading(null)
      })

      xhr.addEventListener('error', () => {
        alert('Upload failed')
        setUploading(null)
      })

      xhr.open('POST', `${API_BASE_URL}/upload`)
      xhr.setRequestHeader('Authorization', `Bearer ${session.access_token}`)
      xhr.send(formData)
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Failed to upload image')
      setUploading(null)
    }
  }

  const groupedSettings = settings.reduce((acc, setting) => {
    const lang = setting.language || 'global'
    if (!acc[lang]) acc[lang] = []
    acc[lang].push(setting)
    return acc
  }, {} as Record<string, Setting[]>)

  if (loading) {
    return <div className="wp-admin-loading">Loading settings...</div>
  }

  return (
    <div className="wp-admin-settings">
      <div className="wp-admin-table-header">
        <h2>Site Settings</h2>
        <p className="description">Manage global site configuration, branding, SEO, and more.</p>
      </div>

      <div className="settings-categories">
        {categories.map(cat => (
          <button
            key={cat.id}
            className={`category-tab ${activeCategory === cat.id ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat.id)}
          >
            <span className="category-icon">{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      <div className="settings-content">
        {Object.entries(groupedSettings).map(([lang, langSettings]) => (
          <div key={lang} className="settings-group">
            <h3 className="settings-group-title">
              {lang === 'global' ? 'Global Settings' : lang.toUpperCase() + ' Settings'}
            </h3>

            {langSettings.map(setting => (
              <div key={setting.id || setting.key} className="setting-item">
                <div className="setting-label">
                  <label>{setting.key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</label>
                  {setting.description && (
                    <span className="setting-description">{setting.description}</span>
                  )}
                </div>

                <div className="setting-input">
                  {setting.type === 'image' ? (
                    <div className="image-upload-setting">
                      {setting.value && (
                        <div className="image-preview">
                          <img src={setting.value} alt={setting.key} onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none'
                          }} />
                          <a href={setting.value} target="_blank" rel="noopener noreferrer">View</a>
                        </div>
                      )}
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <label className="button button-primary">
                          {uploading === setting.key ? 'Uploading...' : setting.value ? 'Change Image' : 'Upload Image'}
                          <input
                            type="file"
                            accept={setting.key === 'favicon_url' ? 'image/x-icon,image/png,image/svg+xml' : 'image/*'}
                            style={{ display: 'none' }}
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) handleImageUpload(setting, file)
                            }}
                            disabled={uploading === setting.key}
                          />
                        </label>
                        <input
                          type="text"
                          className="regular-text"
                          value={localValues[setting.id || `${setting.key}_${setting.language || 'global'}`] ?? setting.value ?? ''}
                          onChange={(e) => handleValueChange(setting, e.target.value)}
                          onBlur={(e) => {
                            const key = setting.id || `${setting.key}_${setting.language || 'global'}`
                            if (localValues[key] !== setting.value) {
                              handleSave(setting, e.target.value)
                            }
                          }}
                          placeholder="Or paste image URL"
                          disabled={saving === (setting.id || setting.key)}
                          style={{ flex: 1, minWidth: '300px' }}
                        />
                        {(setting.key === 'logo_url' || setting.key === 'favicon_url') && (
                          <select
                            className="regular-text media-library-select"
                            value=""
                            onChange={(e) => {
                              const selectedUrl = e.target.value
                              if (!selectedUrl) return
                              handleValueChange(setting, selectedUrl)
                              handleSave(setting, selectedUrl)
                              e.target.value = ''
                            }}
                            disabled={saving === (setting.id || setting.key)}
                          >
                            <option value="">Choose from Media Library</option>
                            {getMediaOptionsForSetting(setting).map((item) => (
                              <option key={item.id} value={item.url}>
                                {item.original_filename || item.url}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>
                    </div>
                  ) : setting.key === 'hero_video_url' ? (
                    <div className="video-upload-setting">
                      {setting.value && (
                        <div className="video-preview">
                          <video
                            src={setting.value}
                            autoPlay
                            muted
                            loop
                            playsInline
                            style={{ maxWidth: '100%', maxHeight: '300px', marginBottom: '10px' }}
                          />
                          <a href={setting.value} target="_blank" rel="noopener noreferrer">View Full Video</a>
                        </div>
                      )}
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <label className="button button-primary">
                          {uploading === setting.key ? 'Uploading...' : setting.value ? 'Change Video' : 'Upload Video'}
                          <input
                            type="file"
                            accept="video/*"
                            style={{ display: 'none' }}
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) handleVideoUpload(setting, file)
                            }}
                            disabled={uploading === setting.key}
                          />
                        </label>
                        <input
                          type="text"
                          className="regular-text"
                          value={localValues[setting.id || `${setting.key}_${setting.language || 'global'}`] ?? setting.value ?? ''}
                          onChange={(e) => handleValueChange(setting, e.target.value)}
                          onBlur={(e) => {
                            const key = setting.id || `${setting.key}_${setting.language || 'global'}`
                            if (localValues[key] !== setting.value) {
                              handleSave(setting, e.target.value)
                            }
                          }}
                          placeholder="Or paste video URL"
                          disabled={saving === (setting.id || setting.key)}
                          style={{ flex: 1, minWidth: '300px' }}
                        />
                      </div>
                    </div>
                  ) : setting.key === 'hero_media_type' ? (
                    <div className="setting-input-group">
                      <select
                        className="regular-text"
                        value={localValues[setting.id || `${setting.key}_${setting.language || 'global'}`] ?? setting.value ?? 'image'}
                        onChange={(e) => {
                          handleValueChange(setting, e.target.value)
                          handleSave(setting, e.target.value)
                        }}
                        disabled={saving === (setting.id || setting.key)}
                      >
                        <option value="image">Image</option>
                        <option value="video">Video</option>
                      </select>
                      {saving === (setting.id || setting.key) && (
                        <span className="saving-indicator">Saving...</span>
                      )}
                    </div>
                  ) : setting.type === 'boolean' ? (
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={setting.value === 'true'}
                        onChange={(e) => handleSave(setting, e.target.checked.toString())}
                        disabled={saving === (setting.id || setting.key)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  ) : setting.type === 'json' ? (
                    <div className="setting-input-group">
                      <textarea
                        className="large-text"
                        rows={5}
                        value={localValues[setting.id || `${setting.key}_${setting.language || 'global'}`] || setting.value || ''}
                        onChange={(e) => handleValueChange(setting, e.target.value)}
                        onBlur={(e) => {
                          const key = setting.id || `${setting.key}_${setting.language || 'global'}`
                          if (localValues[key] !== setting.value) {
                            handleSave(setting, e.target.value)
                          }
                        }}
                        placeholder={setting.description}
                        disabled={saving === (setting.id || setting.key)}
                      />
                      {saving === (setting.id || setting.key) && (
                        <span className="saving-indicator">Saving...</span>
                      )}
                    </div>
                  ) : (
                    <div className="setting-input-group">
                      <input
                        type="text"
                        className="regular-text"
                        value={localValues[setting.id || `${setting.key}_${setting.language || 'global'}`] ?? setting.value ?? ''}
                        onChange={(e) => handleValueChange(setting, e.target.value)}
                        onBlur={(e) => {
                          const key = setting.id || `${setting.key}_${setting.language || 'global'}`
                          if (localValues[key] !== setting.value) {
                            handleSave(setting, e.target.value)
                          }
                        }}
                        placeholder={setting.description}
                        disabled={saving === (setting.id || setting.key)}
                      />
                      {saving === (setting.id || setting.key) && (
                        <span className="saving-indicator">Saving...</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}

        {settings.length === 0 && (
          <div className="no-items">No settings found for this category.</div>
        )}
      </div>
    </div>
  )
}

export default AdminSettings

