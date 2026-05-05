import { useState, useEffect, useMemo } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import DataTable from '../../components/DataTable/DataTable'
import { fetchAdminMenu, createAdminMenuItem, updateAdminMenuItem, deleteAdminMenuItem } from '../../services/api'
import './AdminMenu.css'
import './AdminForms.css'

interface MenuItem {
  id?: string
  label_en: string
  label_fr: string
  url?: string
  type: 'link' | 'dropdown' | 'service'
  parent_id?: string
  order_index: number
  language: string
  visible: boolean
  icon?: string
}

function AdminMenu() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<MenuItem | null>(null)
  const [selectedLang, setSelectedLang] = useState<string>('en')

  useEffect(() => {
    loadMenuItems()
  }, [selectedLang])

  const loadMenuItems = async () => {
    try {
      setLoading(true)
      const data = await fetchAdminMenu(selectedLang)
      setMenuItems(data)
    } catch (error) {
      console.error('Error loading menu items:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this menu item?')) return

    try {
      await deleteAdminMenuItem(id)
      loadMenuItems()
    } catch (error) {
      console.error('Error deleting menu item:', error)
      alert('Failed to delete menu item')
    }
  }

  // handleReorder function removed - not currently used

  const columns = useMemo<ColumnDef<MenuItem>[]>(
    () => [
      {
        accessorKey: 'order_index',
        header: 'Order',
      },
      {
        id: 'label',
        header: 'Label (EN/FR)',
        cell: ({ row }) => (
          <>
            <strong>{row.original.label_en}</strong> / {row.original.label_fr}
          </>
        ),
      },
      {
        accessorKey: 'url',
        header: 'URL',
        cell: ({ row }) => row.original.url || '-',
      },
      {
        accessorKey: 'type',
        header: 'Type',
      },
      {
        accessorKey: 'visible',
        header: 'Visible',
        cell: ({ row }) =>
          row.original.visible ? (
            <span className="status-publish">Yes</span>
          ) : (
            <span className="status-draft">No</span>
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
          <h2>Menu Items</h2>
          <span className="count">({menuItems.length})</span>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <select
            className="regular-text"
            value={selectedLang}
            onChange={(e) => setSelectedLang(e.target.value)}
          >
            <option value="en">English</option>
            <option value="fr">Français</option>
          </select>
          <button 
            className="button button-primary"
            onClick={() => setEditing({
              label_en: '',
              label_fr: '',
              type: 'link',
              order_index: menuItems.length,
              language: selectedLang,
              visible: true,
            } as MenuItem)}
          >
            Add New
          </button>
        </div>
      </div>

      {editing && (
        <MenuEditor
          item={editing}
          menuItems={menuItems}
          onSave={() => {
            setEditing(null)
            loadMenuItems()
          }}
          onCancel={() => setEditing(null)}
        />
      )}

      <DataTable
        data={menuItems}
        columns={columns}
        loading={loading}
        emptyMessage="No menu items found."
        onRowClick={(item) => setEditing(item)}
      />
    </div>
  )
}

function MenuEditor({ item, menuItems, onSave, onCancel }: { item: MenuItem, menuItems: MenuItem[], onSave: () => void, onCancel: () => void }) {
  const [formData, setFormData] = useState({
    label_en: item.label_en || '',
    label_fr: item.label_fr || '',
    url: item.url || '',
    type: item.type || 'link',
    parent_id: item.parent_id || '',
    order_index: item.order_index || 0,
    language: item.language || 'en',
    visible: item.visible !== undefined ? item.visible : true,
    icon: item.icon || '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (item.id) {
        await updateAdminMenuItem(item.id, formData)
      } else {
        await createAdminMenuItem(formData)
      }
      onSave()
    } catch (error) {
      console.error('Error saving menu item:', error)
      alert('Failed to save menu item')
    }
  }

  return (
    <div className="editor-overlay">
      <div className="editor-container">
        <div className="editor-header">
          <h3>{item.id ? 'Edit Menu Item' : 'Add New Menu Item'}</h3>
          <button className="editor-close" onClick={onCancel} type="button">
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit} className="editor-form">
          <div className="form-field">
            <label>Label (English) *</label>
            <input
              type="text"
              className="regular-text"
              value={formData.label_en}
              onChange={(e) => setFormData({ ...formData, label_en: e.target.value })}
              required
            />
          </div>

          <div className="form-field">
            <label>Label (Français) *</label>
            <input
              type="text"
              className="regular-text"
              value={formData.label_fr}
              onChange={(e) => setFormData({ ...formData, label_fr: e.target.value })}
              required
            />
          </div>

          <div className="form-field">
            <label>Type</label>
            <select
              className="regular-text"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as MenuItem['type'] })}
            >
              <option value="link">Link</option>
              <option value="dropdown">Dropdown</option>
              <option value="service">Service</option>
            </select>
          </div>

          <div className="form-field">
            <label>URL</label>
            <input
              type="text"
              className="regular-text"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              placeholder="/page or https://..."
            />
          </div>

          <div className="form-field">
            <label>Parent Menu Item</label>
            <select
              className="regular-text"
              value={formData.parent_id}
              onChange={(e) => setFormData({ ...formData, parent_id: e.target.value })}
            >
              <option value="">None</option>
              {menuItems
                .filter(m => m.id !== item.id && m.type === 'dropdown')
                .map(m => (
                  <option key={m.id} value={m.id}>{m.label_en}</option>
                ))}
            </select>
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
            <label>
              <input
                type="checkbox"
                checked={formData.visible}
                onChange={(e) => setFormData({ ...formData, visible: e.target.checked })}
              />
              Visible
            </label>
          </div>

          <div className="form-field">
            <label>Icon (optional)</label>
            <input
              type="text"
              className="regular-text"
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              placeholder="icon-name"
            />
          </div>

          <div className="editor-actions">
            <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Menu Item</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AdminMenu

