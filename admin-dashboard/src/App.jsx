import { useState, useEffect } from 'react'
import { nightclubsAPI, eventsAPI, usersAPI, notificationsAPI } from './api'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('nightclubs')
  const [nightclubs, setNightclubs] = useState([])
  const [events, setEvents] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [formData, setFormData] = useState({})
  const [notificationData, setNotificationData] = useState({ userId: '', title: '', message: '' })

  useEffect(() => {
    loadData()
  }, [activeTab])

  const loadData = async () => {
    setLoading(true)
    try {
      if (activeTab === 'nightclubs') {
        const response = await nightclubsAPI.getAll()
        setNightclubs(response.data)
      } else if (activeTab === 'events') {
        const response = await eventsAPI.getAll()
        setEvents(response.data)
      } else if (activeTab === 'users') {
        const response = await usersAPI.getAll()
        setUsers(response.data)
      } else if (activeTab === 'notifications') {
        // Load users for the dropdown
        const response = await usersAPI.getAll()
        setUsers(response.data)
      }
    } catch (error) {
      console.error('Failed to load data:', error)
      alert('Failed to load data. Make sure backend is running on port 3000.')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setEditingItem(null)
    setFormData(activeTab === 'nightclubs' ? {
      name: '',
      description: '',
      city: '',
      imageUrl: ''
    } : {
      name: '',
      description: '',
      date: '',
      nightclubId: '',
      price: 0
    })
    setShowForm(true)
  }

  const handleEdit = (item) => {
    setEditingItem(item)
    setFormData(item)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this item?')) return

    try {
      if (activeTab === 'nightclubs') {
        await nightclubsAPI.delete(id)
      } else {
        await eventsAPI.delete(id)
      }
      loadData()
      alert('Deleted successfully!')
    } catch (error) {
      console.error('Delete failed:', error)
      alert('Delete failed: ' + (error.response?.data?.message || error.message))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (activeTab === 'nightclubs') {
        if (editingItem) {
          await nightclubsAPI.update(editingItem.id, formData)
        } else {
          await nightclubsAPI.create(formData)
        }
      } else {
        if (editingItem) {
          await eventsAPI.update(editingItem.id, formData)
        } else {
          await eventsAPI.create(formData)
        }
      }
      setShowForm(false)
      loadData()
      alert(editingItem ? 'Updated successfully!' : 'Created successfully!')
    } catch (error) {
      console.error('Save failed:', error)
      alert('Save failed: ' + (error.response?.data?.message || error.message))
    }
  }

  const handleSendNotification = async () => {
    try {
      if (!notificationData.userId || !notificationData.title || !notificationData.message) {
        alert('Please fill in all fields')
        return
      }
      await notificationsAPI.create(notificationData)
      alert('Notification sent successfully!')
      setNotificationData({ userId: '', title: '', message: '' })
    } catch (error) {
      console.error('Send notification failed:', error)
      alert('Failed to send notification: ' + (error.response?.data?.message || error.message))
    }
  }

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            fontSize: '48px',
            lineHeight: 1
          }}>
            🪩
          </div>
          <div>
            <h1 style={{ margin: 0, background: 'linear-gradient(90deg, #ff00ff, #ff1493, #9d4edd)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>NITEWAYS</h1>
            <p style={{ margin: 0, fontSize: '14px', color: '#888' }}>Admin Dashboard</p>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="nav">
        <button
          className={activeTab === 'nightclubs' ? 'active' : ''}
          onClick={() => setActiveTab('nightclubs')}
        >
          🏢 Nightclubs
        </button>
        <button
          className={activeTab === 'events' ? 'active' : ''}
          onClick={() => setActiveTab('events')}
        >
          🎊 Events
        </button>
        <button
          className={activeTab === 'users' ? 'active' : ''}
          onClick={() => setActiveTab('users')}
        >
          👥 Users
        </button>
        <button
          className={activeTab === 'notifications' ? 'active' : ''}
          onClick={() => setActiveTab('notifications')}
        >
          🔔 Notifications
        </button>
      </nav>

      {/* Main Content */}
      <main className="main">
        <div className="toolbar">
          <h2>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h2>
          {activeTab !== 'notifications' && (
            <button className="btn-primary" onClick={handleCreate}>
              + Add New
            </button>
          )}
        </div>

        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <>
            {/* Nightclubs Table */}
            {activeTab === 'nightclubs' && (
              <table className="table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>City</th>
                    <th>Description</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {nightclubs.map(club => (
                    <tr key={club.id}>
                      <td>
                        <img src={club.imageUrl} alt={club.name} className="thumbnail" />
                      </td>
                      <td>{club.name}</td>
                      <td>{club.city}</td>
                      <td>{club.description?.substring(0, 50)}...</td>
                      <td>
                        <button className="btn-edit" onClick={() => handleEdit(club)}>Edit</button>
                        <button className="btn-delete" onClick={() => handleDelete(club.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* Events Table */}
            {activeTab === 'events' && (
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Date</th>
                    <th>Price</th>
                    <th>Nightclub</th>
                    <th>Description</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map(event => (
                    <tr key={event.id}>
                      <td>{event.name}</td>
                      <td>{new Date(event.date).toLocaleDateString()}</td>
                      <td>€{event.price || 0}</td>
                      <td>{event.nightclub?.name || 'N/A'}</td>
                      <td>{event.description?.substring(0, 50)}...</td>
                      <td>
                        <button className="btn-edit" onClick={() => handleEdit(event)}>Edit</button>
                        <button className="btn-delete" onClick={() => handleDelete(event.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* Users Table */}
            {activeTab === 'users' && (
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Location</th>
                    <th>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id}>
                      <td>{user.firstName} {user.lastName}</td>
                      <td>{user.email}</td>
                      <td>{user.location || 'N/A'}</td>
                      <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="notification-form">
                <h3>Send Push Notification</h3>
                <div className="form-group">
                  <label>Select User</label>
                  <select
                    value={notificationData.userId}
                    onChange={(e) => setNotificationData({ ...notificationData, userId: e.target.value })}
                  >
                    <option value="">-- Select User --</option>
                    {users.map(user => (
                      <option key={user.id} value={user.id}>
                        {user.firstName} {user.lastName} ({user.email})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Title</label>
                  <input
                    type="text"
                    value={notificationData.title}
                    onChange={(e) => setNotificationData({ ...notificationData, title: e.target.value })}
                    placeholder="Notification title"
                  />
                </div>
                <div className="form-group">
                  <label>Message</label>
                  <textarea
                    value={notificationData.message}
                    onChange={(e) => setNotificationData({ ...notificationData, message: e.target.value })}
                    placeholder="Notification message"
                    rows="4"
                  />
                </div>
                <button className="btn-primary" onClick={handleSendNotification}>
                  📤 Send Notification
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Form Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{editingItem ? 'Edit' : 'Create'} {activeTab.slice(0, -1)}</h2>
            <form onSubmit={handleSubmit}>
              {activeTab === 'nightclubs' && (
                <>
                  <div className="form-group">
                    <label>Name *</label>
                    <input
                      type="text"
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>City *</label>
                    <input
                      type="text"
                      value={formData.city || ''}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      value={formData.description || ''}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows="3"
                    />
                  </div>
                  <div className="form-group">
                    <label>Image URL</label>
                    <input
                      type="url"
                      value={formData.imageUrl || ''}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>
                </>
              )}

              {activeTab === 'events' && (
                <>
                  <div className="form-group">
                    <label>Event Name *</label>
                    <input
                      type="text"
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Date *</label>
                    <input
                      type="date"
                      value={formData.date || ''}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Nightclub *</label>
                    <select
                      value={formData.nightclubId || ''}
                      onChange={(e) => setFormData({ ...formData, nightclubId: e.target.value })}
                      required
                    >
                      <option value="">Select nightclub...</option>
                      {nightclubs.map(club => (
                        <option key={club.id} value={club.id}>{club.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Ticket Price (€)</label>
                    <input
                      type="number"
                      value={formData.price || 0}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      value={formData.description || ''}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows="3"
                    />
                  </div>
                </>
              )}

              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingItem ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
