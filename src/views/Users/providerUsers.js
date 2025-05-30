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
  cilBriefcase,
} from '@coreui/icons'
import { useNavigate } from 'react-router-dom'
import './Usermanagement.css'

import { ref, push, onValue } from 'firebase/database'
import { realtimeDb } from '../chat/firestore'

const formatDate = (dateObj) => {
  if (!dateObj) return 'N/A'
  const date = new Date(dateObj)
  return date.toLocaleDateString()
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
  const [notifTitle, setNotifTitle] = useState('')
  const [notifBody, setNotifBody] = useState('')
  const [hasMoreData, setHasMoreData] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')
  const [totalCount, setTotalCount] = useState(0)

  const [chatUser, setChatUser] = useState(null)
  const [chatMessages, setChatMessages] = useState([])
  const [newChatMessage, setNewChatMessage] = useState('')

  const token = localStorage.getItem('token')
  const authHeaders = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  }

  const currentUser = localStorage.getItem('adminId')
  const navigate = useNavigate()

  const handleAssignedJobs = (providerId) => {
    navigate('/ProviderAssignedJobs', { state: { providerId } })
  }

  useEffect(() => {
    console.log('Firebase DB Instance:', realtimeDb)
    console.log('Current Admin ID:', currentUser)
  }, [currentUser])

  const generateChatId = (otherUserId) => {
    const chatId = [currentUser, otherUserId].sort().join('_chat_')
    console.log('Generated Chat ID:', chatId)
    return chatId
  }

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await axios.get(
        `http://18.209.91.97:7787/api/Prvdr?page=${page}&limit=10&search=${search}&userStatus=${statusFilter}`,
        authHeaders,
      )
      const fetchedProviders = response.data.data || []
      setTotalCount(response.data.metadata.total || 0)

      setUsers(fetchedProviders)
      setHasMoreData(fetchedProviders.length === 10)
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
        await axios.delete(`http://18.209.91.97:7787/api/DeleteAccount/provider/${id}`, authHeaders)
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
      await axios.put(
        `http://18.209.91.97:7787/api/provider/updateById/${editUser._id}`,
        editUser,
        authHeaders,
      )
      fetchUsers()
      setIsEditModalOpen(false)
    } catch (error) {
      console.error('Error editing user:', error)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === 'emailVerified' || name === 'documentStatus' || name === 'subscriptionStatus') {
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
      const response = await axios.get(
        `http://18.209.91.97:7787/api/pushNotification/getAdminNotification/${userId}`,
        authHeaders,
      )
      setNotifications(response.data.data || [])
    } catch (error) {
      console.error('Error fetching notifications:', error)
    }
  }

  const handleSendNotification = async () => {
    if (!notifTitle.trim() || !notifBody.trim()) {
      alert('Please enter both notification title and body.')
      return
    }
    try {
      await axios.post(
        `http://18.209.91.97:7787/api/pushNotification/sendAdminNotification/${notifUser._id}`,
        { title: notifTitle, body: notifBody },
        authHeaders,
      )
      setNotifTitle('')
      setNotifBody('')
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

    const deleteUrl = `http://18.209.91.97:7787/api/pushNotification/deleteNotification/${notifId}`
    if (window.confirm('Are you sure you want to delete this notification?')) {
      try {
        await axios.delete(deleteUrl, authHeaders)
        fetchNotifications(notifUser._id)
      } catch (error) {
        console.error('Error deleting notification:', error)
        alert('Failed to delete notification. Please try again.')
      }
    }
  }

    const handleChat = (user) => {
    setChatUser(user)
    setIsChatModalOpen(true)
  }
  useEffect(() => {
    if (!chatUser) return
    const chatChannelId = generateChatId(chatUser._id)
    const chatMessagesRef = ref(realtimeDb, `chatsAdmin/${chatChannelId}/messages`)
    const unsubscribe = onValue(chatMessagesRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        const messagesArray = Object.values(data).sort((a, b) => a.timeStamp - b.timeStamp)
        setChatMessages(messagesArray)
      } else {
        setChatMessages([])
      }
    })
    return unsubscribe
  }, [chatUser])

  const handleSendChatMessage = () => {
    const text = newChatMessage.trim()
    if (!text || !chatUser?._id) return
    const chatChannelId = generateChatId(chatUser._id)
    const chatRef = ref(realtimeDb, `chatsAdmin/${chatChannelId}/messages`)
    const message = {
      senderId: currentUser,
      receiverId: chatUser._id,
      receiverName: chatUser.businessName,
      type: 'provider',
      msg: text,
      timeStamp: Date.now(),
    }
    push(chatRef, message)
      .then(async () => {
        setNewChatMessage('')
        try {
          await axios.post(
            `http://18.209.91.97:7787/api/pushNotification/sendAdminNotification/${chatUser._id}`,
            { title: 'You have a new message from Trade Hunters', body: 'You have a new message from Trade Hunters go to support to view ' },
            authHeaders,
          )
          console.log('Provider notified via pushNotification API')
        } catch (err) {
          console.error('Failed to send provider notification', err)
        }
      })
      .catch((error) => console.error('Error sending chat message:', error))
  }


  return (
    <CContainer className="hunter-container">
      <CCard className="hunter-card">
        <CCardHeader className="hunter-card-header">
          <h4>Providers List</h4>
          <div className="hunter-search-container">
            <CFormInput
              type="text"
              placeholder="Search by Business Name , Email or Address"
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
                <CTableHead className="sticky-header">

                  <CTableRow>
                    <CTableHeaderCell>Sr. No</CTableHeaderCell>
                    <CTableHeaderCell>Joining Date</CTableHeaderCell>
                    <CTableHeaderCell>Business Name</CTableHeaderCell>
                    <CTableHeaderCell>Email</CTableHeaderCell>
                    <CTableHeaderCell>Contact</CTableHeaderCell>
                    <CTableHeaderCell>User Status</CTableHeaderCell>
                    <CTableHeaderCell>Admin Verified</CTableHeaderCell>
                    <CTableHeaderCell>Document Status</CTableHeaderCell>
                    <CTableHeaderCell>Account Status</CTableHeaderCell>
                    <CTableHeaderCell>Subscription Status</CTableHeaderCell>
                    <CTableHeaderCell>Actions</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {users.map((user, index) => (
                    <CTableRow key={user._id}>
                      <CTableDataCell>{totalCount - (index + (page - 1) * 10)}</CTableDataCell>
                      <CTableDataCell>{formatDate(user.insDate)}</CTableDataCell>
                      <CTableDataCell>{user.businessName}</CTableDataCell>
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
                      <CTableDataCell>
                        {user.documentStatus ? 'Approved' : 'Pending'}
                      </CTableDataCell>
                      <CTableDataCell>{user.accountStatus}</CTableDataCell>
                      <CTableDataCell>
                        {user.subscriptionStatus ? 'Active' : 'Inactive'}
                      </CTableDataCell>
                      <CTableDataCell className="hunter-actions-cell">
                        <span
                          onClick={() => handleView(user)}
                          className="hunter-action-icon"
                          title="view"
                        >
                          <CIcon icon={cilInfo} size="lg" />
                        </span>
                        <span
                          onClick={() => handleNotification(user)}
                          className="hunter-action-icon"
                          title="send Notification"
                        >
                          <CIcon icon={cilEnvelopeOpen} size="lg" />
                        </span>
                        <span
                          onClick={() => handleChat(user)}
                          className="hunter-action-icon"
                          title="chat"
                        >
                          <CIcon icon={cilCommentBubble} size="lg" />
                        </span>
                        <span
                          onClick={() => handleEdit(user)}
                          className="hunter-action-icon"
                          title="edit User"
                        >
                          <CIcon icon={cilPencil} size="lg" />
                        </span>
                        <span
                          onClick={() => handleDelete(user._id)}
                          className="hunter-action-icon"
                          title="delete user"
                        >
                          <CIcon icon={cilTrash} size="lg" />
                        </span>
                        <span
                          onClick={() => handleAssignedJobs(user._id)}
                          className="hunter-action-icon"
                          title="Assigned jobs"
                        >
                          <CIcon icon={cilBriefcase} size="lg" />
                        </span>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </div>
          )}
          <div className="hunter-pagination">
            <CButton
              color="secondary"
              onClick={prevPage}
              disabled={page === 1}
              className="hunter-pagination-btn"
            >
              Previous
            </CButton>
            <span className="hunter-page-info">Page: {page}</span>
            <CButton
              color="secondary"
              onClick={nextPage}
              disabled={!hasMoreData}
              className="hunter-pagination-btn"
            >
              Next
            </CButton>
          </div>
        </CCardBody>
      </CCard>

      <CModal
        scrollable
        visible={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        className="hunter-modal"
      >
        <CModalHeader className="hunter-modal-header">
          <CModalTitle>Edit User</CModalTitle>
        </CModalHeader>
        <CModalBody className="hunter-modal-body" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
          <CFormInput
            type="text"
            name="Business Name"
            label="Name"
            value={editUser?.businessName || ''}
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
          <CFormSelect
            name="userStatus"
            label="User Status"
            value={editUser?.userStatus || ''}
            onChange={handleChange}
            className="hunter-modal-select"
          >
            <option value="Active">Active</option>
            <option value="Suspended">Suspended</option>
            <option value="Pending">Pending</option>
          </CFormSelect>
          <CFormSelect
            name="adminVerified"
            label="Admin Verified"
            value={editUser?.adminVerified || ''}
            onChange={handleChange}
            className="hunter-modal-select"
          >
            <option value="Verified">Verified</option>
            <option value="Not-Verified">Not Verified</option>
          </CFormSelect>
          <CFormSelect
            name="accountStatus"
            label="Account Status"
            value={editUser?.accountStatus || ''}
            onChange={handleChange}
            className="hunter-modal-select"
          >
            <option value="Suspend">Suspend</option>
            <option value="Deactivate">Deactivate</option>
            <option value="Reactivate">Reactivate</option>
          </CFormSelect>
          <CFormSelect
            name="emailVerified"
            label="Email Verified"
            value={editUser?.emailVerified ? 'true' : 'false'}
            onChange={(e) =>
              setEditUser((prev) => ({ ...prev, emailVerified: e.target.value === 'true' }))
            }
            className="hunter-modal-select"
          >
            <option value="true">Yes</option>
            <option value="false">No</option>
          </CFormSelect>
          <CFormSelect
            name="documentStatus"
            label="Document Status"
            value={editUser?.documentStatus ? 'true' : 'false'}
            onChange={(e) =>
              setEditUser((prev) => ({ ...prev, documentStatus: e.target.value === 'true' }))
            }
            className="hunter-modal-select"
          >
            <option value="true">Approved</option>
            <option value="false">Pending</option>
          </CFormSelect>
          <CFormSelect
            name="subscriptionStatus"
            label="Subscription Status"
            value={editUser?.subscriptionStatus ? 'true' : 'false'}
            onChange={(e) =>
              setEditUser((prev) => ({ ...prev, subscriptionStatus: e.target.value === 'true' }))
            }
            className="hunter-modal-select"
          >
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </CFormSelect>
        </CModalBody>
        <CModalFooter className="hunter-modal-footer">
          <CButton
            color="secondary"
            onClick={() => setIsEditModalOpen(false)}
            className="hunter-modal-btn"
          >
            Close
          </CButton>
          <CButton color="primary" onClick={handleSaveEdit} className="hunter-modal-btn">
            Save Changes
          </CButton>
        </CModalFooter>
      </CModal>

      <CModal
        scrollable
        visible={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        className="hunter-modal"
      >
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
              <p>
                <strong>Name:</strong> {viewUser.businessName}
              </p>
              <p>
                <strong>Email:</strong> {viewUser.email}
              </p>
              <p>
                <strong>Phone Number:</strong> {viewUser.phoneNo}
              </p>
              <p>
                <strong>User Type:</strong> {viewUser.userType}
              </p>
              <p>
                <strong>User Status:</strong> {viewUser.userStatus || 'N/A'}
              </p>
              <p>
                <strong>Account Status:</strong> {viewUser.accountStatus || 'N/A'}
              </p>
              <p>
                <strong>Email Verified:</strong> {viewUser.emailVerified ? 'Yes' : 'No'}
              </p>
              <p>
                <strong>ABN number: </strong> {viewUser.ABN_Number}
              </p>
              <p>
                <strong>Address: </strong> {viewUser.address?.addressLine}
              </p>
              <p>
                <strong>Subscription Type: </strong> {viewUser.subscriptionType}
              </p>
              <p>
                <strong>Joining Date:</strong> {formatDate(viewUser.insDate)}
              </p>
              <p>
                <strong>Terms &amp; Conditions:</strong>{' '}
                {viewUser.termsAndCondition ? 'Accepted' : 'Not Accepted'}
              </p>
              {viewUser.files && viewUser.files.length > 0 && (
                <div className="hunter-files-section">
                  <strong>Files:</strong>
                  <ul>
                    {viewUser.files.map((file, idx) => (
                      <li key={idx}>
                        <a href={file.path} target="_blank" rel="noopener noreferrer">
                          {file.path}
                        </a>{' '}
                        - {file.description}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <p>
                <strong>Created At:</strong> {formatDate(viewUser.createdAt)}
              </p>
              <p>
                <strong>Updated At:</strong> {formatDate(viewUser.updatedAt)}
              </p>
            </div>
          )}
        </CModalBody>
        <CModalFooter className="hunter-modal-footer">
          <CButton
            color="secondary"
            onClick={() => setIsViewModalOpen(false)}
            className="hunter-modal-btn"
          >
            Close
          </CButton>
        </CModalFooter>
      </CModal>

      <CModal
        scrollable
        visible={isNotifModalOpen}
        onClose={() => setIsNotifModalOpen(false)}
        className="hunter-modal"
      >
        <CModalHeader className="hunter-modal-header">
          <CModalTitle>Send Notification</CModalTitle>
        </CModalHeader>
        <CModalBody className="hunter-modal-body">
          {notifUser && (
            <>
              <div className="hunter-notif-section mb-3">
                <label className="hunter-notif-label">
                  <strong>Notification Title</strong>
                </label>
                <CFormInput
                  type="text"
                  placeholder="Enter notification title"
                  value={notifTitle}
                  onChange={(e) => setNotifTitle(e.target.value)}
                  className="hunter-notif-input"
                  title="Enter Notification Title"
                />
              </div>
              <div className="hunter-notif-section mb-3">
                <label className="hunter-notif-label">
                  <strong>Notification Body</strong>
                </label>
                <CFormInput
                  type="text"
                  placeholder="Enter notification body"
                  value={notifBody}
                  onChange={(e) => setNotifBody(e.target.value)}
                  className="hunter-notif-input"
                  title="Enter Notification Body"
                />
              </div>
              <div className="hunter-notif-send text-center mb-3" title="Send Notification">
                <span onClick={handleSendNotification} className="hunter-notif-send-icon">
                  <CIcon icon={cilEnvelopeOpen} size="lg" />
                </span>
                <p className="hunter-notif-send-text">Send</p>
              </div>
              <hr />
              <h5 className="hunter-notif-header">Notifications</h5>
              {notifications.length === 0 ? (
                <p>No notifications sent yet.</p>
              ) : (
                notifications.map((notif) => (
                  <div key={notif._id} className="hunter-notif-item">
                    <div className="hunter-notif-text">
                      <strong>{notif.title.toUpperCase()}</strong>: {notif.body}
                    </div>
                    <span
                      onClick={() => handleDeleteNotification(notif._id)}
                      className="hunter-notif-delete"
                      title="Delete Notification"
                    >
                      <CIcon icon={cilTrash} size="lg" />
                    </span>
                  </div>
                ))
              )}
            </>
          )}
        </CModalBody>
        <CModalFooter className="hunter-modal-footer">
          <CButton
            color="secondary"
            onClick={() => setIsNotifModalOpen(false)}
            className="hunter-modal-btn"
            title="Close Notification Modal"
          >
            Close
          </CButton>
        </CModalFooter>
      </CModal>
      <CModal
        visible={isChatModalOpen}
        onClose={() => setIsChatModalOpen(false)}
        size="md"
        className="hunter-modal"
      >
        <CModalHeader onClose={() => setIsChatModalOpen(false)}>
          <CModalTitle>Chat with {chatUser?.businessName}</CModalTitle>
        </CModalHeader>
        <div style={{ display: 'flex', flexDirection: 'column', height: '400px' }}>
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
            {chatMessages.length === 0 ? (
              <p>No messages yet.</p>
            ) : (
              chatMessages.map((msg, i) => (
                <div
                  key={i}
                  style={{
                    textAlign: msg.senderId === currentUser ? 'right' : 'left',
                    marginBottom: '10px',
                  }}
                >
                  <span
                    style={{
                      backgroundColor: msg.senderId === currentUser ? '#007bff' : '#f1f1f1',
                      color: msg.senderId === currentUser ? '#fff' : '#333',
                      padding: '10px 15px',
                      borderRadius: '20px',
                      display: 'inline-block',
                      maxWidth: '70%',
                      wordBreak: 'break-word',
                    }}
                  >
                    {msg.msg}
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
                <CButton color="primary" onClick={handleSendChatMessage}>
                  Send
                </CButton>
              </CCol>
            </CRow>
          </div>
        </div>
      </CModal>
    </CContainer>
  )
}

export default Provider
