import { useState, useEffect, useMemo } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import DataTable from '../../components/DataTable/DataTable'
import { fetchAdminBlogPosts, createAdminBlogPost, updateAdminBlogPost } from '../../services/api'
import './AdminBlog.css'
import './AdminForms.css'

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  category: string
  language: string
  published: boolean
  meta_title: string
  meta_description: string
}

function AdminBlog() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<BlogPost | null>(null)

  useEffect(() => {
    loadPosts()
  }, [])

  const loadPosts = async () => {
    try {
      setLoading(true)
      const data = await fetchAdminBlogPosts()
      setPosts(data)
    } catch (error) {
      console.error('Error loading blog posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const columns = useMemo<ColumnDef<BlogPost>[]>(
    () => [
      {
        accessorKey: 'title',
        header: 'Title',
        cell: ({ row }) => <strong>{row.original.title}</strong>,
      },
      {
        accessorKey: 'slug',
        header: 'Slug',
      },
      {
        accessorKey: 'category',
        header: 'Category',
      },
      {
        accessorKey: 'language',
        header: 'Language',
        cell: ({ row }) => row.original.language.toUpperCase(),
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
          <button
            className="button-link edit-link"
            onClick={(e) => {
              e.stopPropagation()
              setEditing(row.original)
            }}
          >
            Edit
          </button>
        ),
      },
    ],
    []
  )

  return (
    <div className="admin-blog">
      <div className="admin-section-header">
        <h2>Blog Posts</h2>
        <button className="btn btn-primary" onClick={() => setEditing({} as BlogPost)}>
          Create New Post
        </button>
      </div>

      {editing && (
        <BlogPostEditor
          post={editing}
          onSave={() => {
            setEditing(null)
            loadPosts()
          }}
          onCancel={() => setEditing(null)}
        />
      )}

      <div className="wp-admin-table-container">
        <DataTable
          data={posts}
          columns={columns}
          loading={loading}
          emptyMessage="No blog posts found."
          onRowClick={(post) => setEditing(post)}
        />
      </div>
    </div>
  )
}

function BlogPostEditor({ post, onSave, onCancel }: { post: BlogPost, onSave: () => void, onCancel: () => void }) {
  const [formData, setFormData] = useState({
    title: post.title || '',
    slug: post.slug || '',
    excerpt: post.excerpt || '',
    content: post.content || '',
    category: post.category || '',
    language: post.language || 'en',
    published: post.published || false,
    meta_title: post.meta_title || '',
    meta_description: post.meta_description || '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (post.id) {
        await updateAdminBlogPost(post.id, formData)
      } else {
        await createAdminBlogPost(formData)
      }
      onSave()
    } catch (error) {
      console.error('Error saving post:', error)
      alert('Failed to save post')
    }
  }

  return (
    <div className="editor-overlay">
      <div className="editor-container editor-large">
        <div className="editor-header">
          <h3>{post.id ? 'Edit Blog Post' : 'Add New Blog Post'}</h3>
          <button className="editor-close" onClick={onCancel} type="button">
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit} className="editor-form">
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>

      <div className="form-group">
        <label>Slug</label>
        <input
          type="text"
          value={formData.slug}
          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          required
        />
      </div>

      <div className="form-group">
        <label>Language</label>
        <select
          value={formData.language}
          onChange={(e) => setFormData({ ...formData, language: e.target.value })}
        >
          <option value="en">English</option>
          <option value="fr">Français</option>
        </select>
      </div>

      <div className="form-group">
        <label>Excerpt</label>
        <textarea
          value={formData.excerpt}
          onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
          rows={3}
        />
      </div>

      <div className="form-group">
        <label>Content</label>
        <textarea
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          rows={15}
          required
        />
      </div>

      <div className="form-group">
        <label>Category</label>
        <input
          type="text"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label>
          <input
            type="checkbox"
            checked={formData.published}
            onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
          />
          Published
        </label>
      </div>

      <div className="form-group">
        <label>Meta Title</label>
        <input
          type="text"
          value={formData.meta_title}
          onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label>Meta Description</label>
        <textarea
          value={formData.meta_description}
          onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
          rows={3}
        />
      </div>

          <div className="editor-actions">
            <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AdminBlog

