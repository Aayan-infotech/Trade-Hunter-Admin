import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {
  CContainer,
  CCard,
  CCardHeader,
  CCardBody,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CButton,
  CFormInput,
  CFormSelect,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CBadge,
  CRow,
  CCol,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilSearch,
  cilTrash,
  cilPencil,
  cilInfo,
  cilEnvelopeOpen,
  cilCommentBubble,
} from '@coreui/icons'
import './Usermanagement.css'

// Firebase imports
import { ref, push, onValue } from 'firebase/database'
import { realtimeDb } from '../chat/firestore' // Adjust the path as needed

// Updated formatDate returns only the date portion (no time)
const formatDate = (dateObj) => {
  if (!dateObj) return 'N/A'
  const date = new Date(dateObj)
  return date.toLocaleDateString()  // Only the date is returned
}

const Provider = () => {
  const [users, setUsers] = useState([])
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isNotifModalOpen, setIsNotifModalOpen] = useState(false)
  const [isChatModalOpen, setIsChatModalOpen] = useState(false)
  const [editUser, setEditUser] = useState(null)
  const [viewUser, setViewUser] = useState(null)
  const [notifUser, setNotifUser] = useState(null)
  const [notifications, setNotifications] = useState([])
  const [notifType, setNotifType] = useState('alert')
  const [notifText, setNotifText] = useState('')
  const [hasMoreData, setHasMoreData] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')

  // Chat state variables
  const [chatUser, setChatUser] = useState(null)
  const [chatMessages, setChatMessages] = useState([])
  const [newChatMessage, setNewChatMessage] = useState('')

  // IMPORTANT: The sender is always the admin.
  const currentUser = localStorage.getItem('adminId')
  useEffect(() => {
    console.log('Firebase DB Instance:', realtimeDb)
    console.log('Current Admin ID:', currentUser)
  }, [currentUser])

  // Helper: Generate a stable chat ID using the admin id and the selected provider's ID.
  const generateChatId = (otherUserId) => {
    const chatId = [currentUser, otherUserId].sort().join('_')
    console.log('Generated Chat ID:', chatId)
    return chatId
  }

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await axios.get(
        `http://54.236.98.193:7777/api/Prvdr?page=${page}&limit=10&search=${search}&userStatus=${statusFilter}`
      )
      setUsers(response.data.data)
      setHasMoreData(response.data.data.length === 10)
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [page, search, statusFilter])

  const handleSearch = (e) => {
    setSearch(e.target.value)
    setPage(1)
  }

  const nextPage = () => {
    if (hasMoreData) setPage((prevPage) => prevPage + 1)
  }

  const prevPage = () => setPage((prevPage) => Math.max(prevPage - 1, 1))

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`http://54.236.98.193:7777/api/Prvdr/${id}`)
        fetchUsers()
      } catch (error) {
        console.error('Error deleting user:', error)
      }
    }
  }

  const handleEdit = (user) => {
    setEditUser(user)
    setIsEditModalOpen(true)
  }

  const handleView = (user) => {
    setViewUser(user)
    setIsViewModalOpen(true)
  }

  const handleSaveEdit = async () => {
    try {
      await axios.put(`http://54.236.98.193:7777/api/Prvdr/${editUser._id}`, editUser)
      fetchUsers()
      setIsEditModalOpen(false)
    } catch (error) {
      console.error('Error editing user:', error)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    if (
      name === 'emailVerified' ||
      name === 'documentStatus' ||
      name === 'subscriptionStatus'
    ) {
      setEditUser((prev) => ({ ...prev, [name]: value === 'true' }))
    } else {
      setEditUser((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleNotification = (user) => {
    setNotifUser(user)
    setIsNotifModalOpen(true)
    fetchNotifications(user._id)
  }

  const fetchNotifications = async (userId) => {
    try {
      const response = await axios.get(`http://54.236.98.193:7777/api/notification/getAll/provider/${userId}`)
      setNotifications(response.data.data || [])
    } catch (error) {
      console.error('Error fetching notifications:', error)
    }
  }

  const handleSendNotification = async () => {
    if (!notifText) {
      alert('Please enter notification text.')
      return
    }
    try {
      await axios.post(`http://54.236.98.193:7777/api/notification/send/provider/${notifUser._id}`, {
        type: notifType,
        text: notifText,
      })
      setNotifText('')
      fetchNotifications(notifUser._id)
      alert('Notification sent successfully!')
    } catch (error) {
      console.error('Error sending notification:', error)
      alert('Failed to send notification. Please try again.')
    }
  }

  const handleDeleteNotification = async (notifId) => {
    if (!notifUser || !notifUser._id) {
      alert('Notification user not defined')
      return
    }
    const deleteUrl = `http://54.236.98.193:7777/api/notification/delete/provider/${notifUser._id}/${notifId}`
    if (window.confirm('Are you sure you want to delete this notification?')) {
      try {
        await axios.delete(deleteUrl)
        fetchNotifications(notifUser._id)
      } catch (error) {
        console.error('Error deleting notification:', error)
        alert('Failed to delete notification. Please try again.')
      }
    }
  }

  // Open chat modal with the selected provider.
  const handleChat = (user) => {
    console.log('Chat initiated with:', user)
    setChatUser(user)
    setIsChatModalOpen(true)
    // Firebase will load chat messages; no dummy messages are set here.
  }

  // Subscribe to chat messages from Firebase when a chat user is selected.
  useEffect(() => {
    if (chatUser) {
      const chatChannelId = generateChatId(chatUser._id)
      const chatMessagesRef = ref(realtimeDb, `chats/${chatChannelId}/messages`)
      console.log('Subscribing to Firebase chat messages at:', `chats/${chatChannelId}/messages`)

      const unsubscribe = onValue(chatMessagesRef, (snapshot) => {
        const data = snapshot.val()
        if (data) {
          const messagesArray = Object.values(data).sort((a, b) => a.createdAt - b.createdAt)
          console.log('Received messages:', messagesArray)
          setChatMessages(messagesArray)
        } else {
          console.log('No messages found at this channel.')
          setChatMessages([])
        }
      })

      return () => {
        console.log('Unsubscribing from Firebase chat messages.')
        unsubscribe()
      }
    }
  }, [chatUser])

  const handleSendChatMessage = () => {
    if (!newChatMessage.trim()) return

    if (!chatUser || !chatUser._id) {
      console.error('Chat user is not defined.')
      return
    }

    const chatChannelId = generateChatId(chatUser._id)
    const chatRef = ref(realtimeDb, `chats/${chatChannelId}/messages`)
    console.log('Sending message to:', `chats/${chatChannelId}/messages`)
    console.log('Current Admin (Sender):', currentUser, 'Chat Provider (Receiver):', chatUser)

    const message = {
      senderId: currentUser, // Always the admin
      receiverId: chatUser._id,
      receiverName: chatUser.contactName,
      type: chatUser.userType,
      text: newChatMessage,
      createdAt: Date.now(),
    }

    push(chatRef, message)
      .then(() => {
        console.log('Message sent successfully:', message)
        setNewChatMessage('')
      })
      .catch((error) => {
        console.error('Error sending message:', error)
      })
  }

  return (
    <CContainer className="hunter-container">
      <CCard className="hunter-card">
        <CCardHeader className="hunter-card-header">
          <h4>Providers List</h4>
          <div className="hunter-search-container">
            <CFormInput
              type="text"
              placeholder="Search by name or email"
              value={search}
              onChange={handleSearch}
              className="hunter-search-input"
            />
            <CButton color="primary" onClick={fetchUsers} className="hunter-search-button">
              <CIcon icon={cilSearch} /> Search
            </CButton>
            <CFormSelect
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value)
                setPage(1)
              }}
              className="hunter-status-select"
            >
              <option value="">User Status</option>
              <option value="Active">Active</option>
              <option value="Suspended">Suspended</option>
              <option value="Pending">Pending</option>
            </CFormSelect>
          </div>
        </CCardHeader>
        <CCardBody className="hunter-card-body">
          {loading ? (
            <div className="loading-text">Loading...</div>
          ) : (
            <div className="hunter-table-container">
              <CTable hover responsive className="hunter-table">
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Sr. No</CTableHeaderCell>
                    <CTableHeaderCell>Joining Date</CTableHeaderCell>
                    <CTableHeaderCell>Name</CTableHeaderCell>
                    <CTableHeaderCell>Email</CTableHeaderCell>
                    <CTableHeaderCell>Contact</CTableHeaderCell>
                    <CTableHeaderCell>User Status</CTableHeaderCell>
                    <CTableHeaderCell>Admin Verified</CTableHeaderCell>
                    <CTableHeaderCell>Email Verified</CTableHeaderCell>
                    <CTableHeaderCell>Document Status</CTableHeaderCell>
                    <CTableHeaderCell>Subscription Status</CTableHeaderCell>
                    <CTableHeaderCell>Actions</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {users.map((user, index) => (
                    <CTableRow key={user._id}>
                      <CTableDataCell>{index + 1 + (page - 1) * 10}</CTableDataCell>
                      <CTableDataCell>{formatDate(user.insDate)}</CTableDataCell>
                      <CTableDataCell>{user.contactName}</CTableDataCell>
                      <CTableDataCell>{user.email}</CTableDataCell>
                      <CTableDataCell>{user.phoneNo}</CTableDataCell>
                      <CTableDataCell>
                        <CBadge
                          color={
                            user.userStatus === 'Active'
                              ? 'success'
                              : user.userStatus === 'Suspended'
                              ? 'danger'
                              : 'warning'
                          }
                        >
                          {user.userStatus}
                        </CBadge>
                      </CTableDataCell>
                      <CTableDataCell>{user.adminVerified}</CTableDataCell>
                      <CTableDataCell>{user.emailVerified ? 'Yes' : 'No'}</CTableDataCell>
                      <CTableDataCell>{user.documentStatus ? 'Approved' : 'Pending'}</CTableDataCell>
                      <CTableDataCell>{user.subscriptionStatus ? 'Active' : 'Inactive'}</CTableDataCell>
                      <CTableDataCell className="hunter-actions-cell">
                        <span onClick={() => handleView(user)} className="hunter-action-icon">
                          <CIcon icon={cilInfo} size="lg" />
                        </span>
                        <span onClick={() => handleNotification(user)} className="hunter-action-icon">
                          <CIcon icon={cilEnvelopeOpen} size="lg" />
                        </span>
                        <span onClick={() => handleChat(user)} className="hunter-action-icon">
                          <CIcon icon={cilCommentBubble} size="lg" />
                        </span>
                        <span onClick={() => handleEdit(user)} className="hunter-action-icon">
                          <CIcon icon={cilPencil} size="lg" />
                        </span>
                        <span onClick={() => handleDelete(user._id)} className="hunter-action-icon">
                          <CIcon icon={cilTrash} size="lg" />
                        </span>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </div>
          )}
          <div className="hunter-pagination">
            <CButton color="secondary" onClick={prevPage} disabled={page === 1} className="hunter-pagination-btn">
              Previous
            </CButton>
            <span className="hunter-page-info">Page: {page}</span>
            <CButton color="secondary" onClick={nextPage} disabled={!hasMoreData} className="hunter-pagination-btn">
              Next
            </CButton>
          </div>
        </CCardBody>
      </CCard>

      {/* Edit Modal */}
      <CModal scrollable visible={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} className="hunter-modal">
        <CModalHeader className="hunter-modal-header">
          <CModalTitle>Edit User</CModalTitle>
        </CModalHeader>
        <CModalBody className="hunter-modal-body" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
          <CFormInput
            type="text"
            name="contactName"
            label="Name"
            value={editUser?.contactName || ''}
            onChange={handleChange}
            className="hunter-modal-input"
          />
          <CFormInput
            type="email"
            name="email"
            label="Email"
            value={editUser?.email || ''}
            onChange={handleChange}
            className="hunter-modal-input"
          />
          <CFormInput
            type="text"
            name="phoneNo"
            label="Phone Number"
            value={editUser?.phoneNo || ''}
            onChange={handleChange}
            className="hunter-modal-input"
          />
          <CFormSelect name="userStatus" label="User Status" value={editUser?.userStatus || ''} onChange={handleChange} className="hunter-modal-select">
            <option value="Active">Active</option>
            <option value="Suspended">Suspended</option>
            <option value="Pending">Pending</option>
          </CFormSelect>
          <CFormSelect name="adminVerified" label="Admin Verified" value={editUser?.adminVerified || ''} onChange={handleChange} className="hunter-modal-select">
            <option value="Verified">Verified</option>
            <option value="Not-Verified">Not Verified</option>
          </CFormSelect>
          <CFormSelect name="accountStatus" label="Account Status" value={editUser?.accountStatus || ''} onChange={handleChange} className="hunter-modal-select">
            <option value="Suspend">Suspend</option>
            <option value="Deactivate">Deactivate</option>
            <option value="Reactivate">Reactivate</option>
          </CFormSelect>
          <CFormSelect
            name="emailVerified"
            label="Email Verified"
            value={editUser?.emailVerified ? 'true' : 'false'}
            onChange={(e) => setEditUser((prev) => ({ ...prev, emailVerified: e.target.value === 'true' }))}
            className="hunter-modal-select"
          >
            <option value="true">Yes</option>
            <option value="false">No</option>
          </CFormSelect>
          <CFormSelect
            name="documentStatus"
            label="Document Status"
            value={editUser?.documentStatus ? 'true' : 'false'}
            onChange={(e) => setEditUser((prev) => ({ ...prev, documentStatus: e.target.value === 'true' }))}
            className="hunter-modal-select"
          >
            <option value="true">Approved</option>
            <option value="false">Pending</option>
          </CFormSelect>
          <CFormSelect
            name="subscriptionStatus"
            label="Subscription Status"
            value={editUser?.subscriptionStatus ? 'true' : 'false'}
            onChange={(e) => setEditUser((prev) => ({ ...prev, subscriptionStatus: e.target.value === 'true' }))}
            className="hunter-modal-select"
          >
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </CFormSelect>
        </CModalBody>
        <CModalFooter className="hunter-modal-footer">
          <CButton color="secondary" onClick={() => setIsEditModalOpen(false)} className="hunter-modal-btn">
            Close
          </CButton>
          <CButton color="primary" onClick={handleSaveEdit} className="hunter-modal-btn">
            Save Changes
          </CButton>
        </CModalFooter>
      </CModal>

      {/* View Modal */}
      <CModal scrollable visible={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} className="hunter-modal">
        <CModalHeader className="hunter-modal-header">
          <CModalTitle>View User</CModalTitle>
        </CModalHeader>
        <CModalBody className="hunter-modal-body" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
          {viewUser && (
            <div className="hunter-view-content">
              {viewUser.images && (
                <div className="hunter-view-image">
                  <img src={viewUser.images} alt="User" className="hunter-user-image" />
                </div>
              )}
              <p><strong>Name:</strong> {viewUser.contactName}</p>
              <p><strong>Email:</strong> {viewUser.email}</p>
              <p><strong>Phone Number:</strong> {viewUser.phoneNo}</p>
              <p><strong>User Type:</strong> {viewUser.userType}</p>
              <p><strong>User Status:</strong> {viewUser.userStatus || 'N/A'}</p>
              <p><strong>Email Verified:</strong> {viewUser.emailVerified ? 'Yes' : 'No'}</p>
              <p><strong>Joining Date:</strong> {formatDate(viewUser.insDate)}</p>
              <p><strong>Terms &amp; Conditions:</strong> {viewUser.termsAndCondition ? 'Accepted' : 'Not Accepted'}</p>
              {viewUser.files && viewUser.files.length > 0 && (
                <div className="hunter-files-section">
                  <strong>Files:</strong>
                  <ul>
                    {viewUser.files.map((file, idx) => (
                      <li key={idx}>
                        {file.filename} - {file.description}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <p><strong>Created At:</strong> {formatDate(viewUser.createdAt)}</p>
              <p><strong>Updated At:</strong> {formatDate(viewUser.updatedAt)}</p>
            </div>
          )}
        </CModalBody>
        <CModalFooter className="hunter-modal-footer">
          <CButton color="secondary" onClick={() => setIsViewModalOpen(false)} className="hunter-modal-btn">
            Close
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Notification Modal */}
      <CModal scrollable visible={isNotifModalOpen} onClose={() => setIsNotifModalOpen(false)} className="hunter-modal">
        <CModalHeader className="hunter-modal-header">
          <CModalTitle>Send Notification</CModalTitle>
        </CModalHeader>
        <CModalBody className="hunter-modal-body" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
          {notifUser && (
            <>
              <div className="mb-3">
                <label><strong>Notification Type</strong></label>
                <CFormSelect value={notifType} onChange={(e) => setNotifType(e.target.value)}>
                  <option value="alert">Alert</option>
                  <option value="reminder">Reminder</option>
                  <option value="promotion">Promotion</option>
                </CFormSelect>
              </div>
              <div className="mb-3">
                <label><strong>Notification Text</strong></label>
                <CFormInput
                  type="text"
                  placeholder="Enter notification text"
                  value={notifText}
                  onChange={(e) => setNotifText(e.target.value)}
                />
              </div>
              <div className="text-center mb-3">
                <span onClick={handleSendNotification} style={{ cursor: 'pointer', color: '#0d6efd', fontSize: '1.8rem' }}>
                  <CIcon icon={cilEnvelopeOpen} />
                </span>
                <p style={{ margin: '0.5rem 0', fontSize: '0.9rem' }}>Send</p>
              </div>
              <hr />
              <h5>Sent Notifications</h5>
              {notifications.length === 0 ? (
                <p>No notifications sent yet.</p>
              ) : (
                notifications.map((notif) => (
                  <div key={notif._id} className="d-flex justify-content-between align-items-center border p-2 my-1">
                    <div>
                      <strong>{notif.type.toUpperCase()}</strong>: {notif.text}
                    </div>
                    <span onClick={() => handleDeleteNotification(notif._id)} style={{ cursor: 'pointer', color: 'red', fontSize: '1.3rem' }}>
                      <CIcon icon={cilTrash} />
                    </span>
                  </div>
                ))
              )}
            </>
          )}
        </CModalBody>
        <CModalFooter className="hunter-modal-footer">
          <CButton color="secondary" onClick={() => setIsNotifModalOpen(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Chat Modal with Firebase Integration */}
      <CModal visible={isChatModalOpen} onClose={() => setIsChatModalOpen(false)} size="md" className="hunter-modal">
        <CModalHeader onClose={() => setIsChatModalOpen(false)}>
          <CModalTitle>Chat with {chatUser?.contactName || chatUser?.name}</CModalTitle>
        </CModalHeader>
        <div style={{ display: 'flex', flexDirection: 'column', height: '400px' }}>
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
            {chatMessages.length === 0 ? (
              <p>No messages yet.</p>
            ) : (
              chatMessages.map((msg, index) => (
                <div key={index} style={{ textAlign: msg.senderId === currentUser ? 'right' : 'left', marginBottom: '10px' }}>
                  <span style={{
                    backgroundColor: msg.senderId === currentUser ? '#007bff' : '#f1f1f1',
                    color: msg.senderId === currentUser ? '#fff' : '#333',
                    padding: '10px 15px',
                    borderRadius: '20px',
                    display: 'inline-block',
                    maxWidth: '70%',
                    wordBreak: 'break-word'
                  }}>
                    {msg.text}
                  </span>
                </div>
              ))
            )}
          </div>
          <div style={{ padding: '10px', borderTop: '1px solid #ddd', background: '#fff' }}>
            <CRow className="align-items-center">
              <CCol md={10}>
                <CFormInput
                  type="text"
                  placeholder="Type a message..."
                  value={newChatMessage}
                  onChange={(e) => setNewChatMessage(e.target.value)}
                />
              </CCol>
              <CCol md={2}>
                <CButton color="primary" onClick={handleSendChatMessage}>Send</CButton>
              </CCol>
            </CRow>
          </div>
        </div>
      </CModal>
    </CContainer>
  )
}

export default Provider
