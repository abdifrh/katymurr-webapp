import { useState, useEffect, useMemo } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import DataTable from '../../components/DataTable/DataTable'
import { fetchAdminContactMessages, deleteAdminContactMessage, markAdminContactMessageAsRead } from '../../services/api'
import './AdminContact.css'

interface ContactMessage {
  id: string
  name: string
  email: string
  subject: string
  message: string
  service_type?: string
  status: string
  created_at: string
  read_at?: string
  replied_at?: string
}

function AdminContact() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>('')

  useEffect(() => {
    loadMessages()
  }, [filterStatus])

  const loadMessages = async () => {
    try {
      setLoading(true)
      const data = await fetchAdminContactMessages()
      // Filter by status if needed
      const filteredData = filterStatus ? data.filter((m: ContactMessage) => m.status === filterStatus) : data
      setMessages(filteredData)
    } catch (error) {
      console.error('Error loading contact messages:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAsRead = async (id: string) => {
    try {
      await markAdminContactMessageAsRead(id)
      await loadMessages()
    } catch (error) {
      console.error('Error marking message as read:', error)
      alert('Failed to mark message as read')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return

    try {
      await deleteAdminContactMessage(id)
      if (selectedMessage?.id === id) {
        setSelectedMessage(null)
      }
      await loadMessages()
    } catch (error) {
      console.error('Error deleting message:', error)
      alert('Failed to delete message')
    }
  }

  const unreadCount = messages.filter(m => m.status === 'new').length

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const columns = useMemo<ColumnDef<ContactMessage>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
        cell: ({ row }) => <strong>{row.original.name}</strong>,
      },
      {
        accessorKey: 'email',
        header: 'Email',
      },
      {
        accessorKey: 'subject',
        header: 'Subject',
      },
      {
        accessorKey: 'created_at',
        header: 'Date',
        cell: ({ row }) => formatDate(row.original.created_at),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => (
          <span className={`status-badge status-${row.original.status}`}>
            {row.original.status}
          </span>
        ),
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <button
            className="button-link"
            onClick={(e) => {
              e.stopPropagation()
              setSelectedMessage(row.original)
            }}
          >
            View
          </button>
        ),
      },
    ],
    []
  )

  return (
    <div className="admin-contact">
      <div className="wp-admin-table-container">
        <div className="wp-admin-table-header">
          <div className="wp-admin-table-title">
            <h2>Contact Messages</h2>
            <span className="count">({messages.length})</span>
            {unreadCount > 0 && (
              <span className="unread-count">• {unreadCount} new</span>
            )}
          </div>
          <div className="filter-controls">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="regular-text"
            >
              <option value="">All Messages</option>
              <option value="new">New</option>
              <option value="read">Read</option>
              <option value="replied">Replied</option>
            </select>
          </div>
        </div>

        <div className="contact-messages-layout">
          <div className="messages-list">
            <DataTable
              data={messages}
              columns={columns}
              loading={loading}
              emptyMessage="No contact messages found."
              onRowClick={(message) => setSelectedMessage(message)}
              getRowClassName={(message) => message.status === 'new' ? 'unread' : ''}
            />
          </div>

          {selectedMessage && (
            <div className="message-detail">
              <div className="message-detail-header">
                <h3>Message Details</h3>
                <button
                  className="button-link"
                  onClick={() => setSelectedMessage(null)}
                >
                  Close
                </button>
              </div>
              <div className="message-detail-content">
                <div className="message-field">
                  <strong>Name:</strong>
                  <span>{selectedMessage.name}</span>
                </div>
                <div className="message-field">
                  <strong>Email:</strong>
                  <a href={`mailto:${selectedMessage.email}`}>{selectedMessage.email}</a>
                </div>
                <div className="message-field">
                  <strong>Subject:</strong>
                  <span>{selectedMessage.subject}</span>
                </div>
                {selectedMessage.service_type && (
                  <div className="message-field">
                    <strong>Service Type:</strong>
                    <span>{selectedMessage.service_type}</span>
                  </div>
                )}
                <div className="message-field">
                  <strong>Date:</strong>
                  <span>{formatDate(selectedMessage.created_at)}</span>
                </div>
                <div className="message-field">
                  <strong>Status:</strong>
                  <span className={`status-badge status-${selectedMessage.status}`}>
                    {selectedMessage.status}
                  </span>
                </div>
                <div className="message-field full-width">
                  <strong>Message:</strong>
                  <div className="message-text">{selectedMessage.message}</div>
                </div>
                <div className="message-actions">
                  {selectedMessage.status === 'new' && (
                    <button
                      className="button button-primary"
                      onClick={() => handleMarkAsRead(selectedMessage.id)}
                    >
                      Mark as Read
                    </button>
                  )}
                  <button
                    className="button"
                    onClick={() => window.open(`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`)}
                  >
                    Reply via Email
                  </button>
                  <button
                    className="button-link delete-link"
                    onClick={() => handleDelete(selectedMessage.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminContact

