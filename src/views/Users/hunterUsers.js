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
  CFormInput,
  CFormSelect,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CBadge,
  CRow,
  CCol,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilSearch,
  cilTrash,
  cilPencil,
  cilBriefcase,
  cilInfo,
  cilEnvelopeOpen,
  cilCommentBubble,
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

const Hunter = () => {
  const [users, setUsers] = useState([])
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [loading, setLoading] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isNotifModalOpen, setIsNotifModalOpen] = useState(false)
  const [isChatModalOpen, setIsChatModalOpen] = useState(false)
  const [editUser, setEditUser] = useState(null)
  const [viewUser, setViewUser] = useState(null)
  const [chatUser, setChatUser] = useState(null)
  const [notifUser, setNotifUser] = useState(null)
  const [notifications, setNotifications] = useState([])
  const [notifTitle, setNotifTitle] = useState('')
  const [notifBody, setNotifBody] = useState('')
  const [chatMessages, setChatMessages] = useState([])
  const [newChatMessage, setNewChatMessage] = useState('')
  const [hasMoreData, setHasMoreData] = useState(true)
const [totalCount, setTotalCount] = useState(0)

  const token = localStorage.getItem('token')
  console.log('🛡️ token:', token)
  const authHeaders = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  }

  const navigate = useNavigate()
  const currentUser = localStorage.getItem('adminId')

  useEffect(() => {
    console.log('Firebase DB Instance:', realtimeDb)
    console.log('Current User (adminId):', currentUser)
  }, [currentUser])

  const generateChatId = (otherUserId) => {
    return [currentUser, otherUserId].sort().join('_chat_')
  }

  const JobsManagemen = (_id) => {
    navigate('/JobsHunter', { state: { _id } })
  }

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const response = await axios.get(
        `http://18.209.91.97:7787/api/users/type/hunter/pagelimit/10?page=${page}&search=${search}&userStatus=${statusFilter}`,
        authHeaders
      )
      const fetchedUsers = response.data.users || []
      setTotalCount(response.data.totalUsers || 0)

      setUsers(fetchedUsers)
      setHasMoreData(fetchedUsers.length === 10)
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
    if (hasMoreData) setPage((prev) => prev + 1)
  }

  const prevPage = () => {
    setPage((prev) => Math.max(prev - 1, 1))
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(
          `http://18.209.91.97:7787/api/DeleteAccount/hunter/${id}`,
          authHeaders
        )
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
        `http://18.209.91.97:7787/api/users/${editUser._id}`,
        editUser,
        authHeaders
      )
      fetchUsers()
      setIsEditModalOpen(false)
    } catch (error) {
      console.error('Error editing user:', error)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setEditUser((prevUser) => ({ ...prevUser, [name]: value }))
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
        authHeaders
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
        { title: notifTitle, body: notifBody + `\n From Trade Hunters Admin Team` },
        authHeaders
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
    if (!notifUser?._id) {
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
    const chatMessagesRef = ref(
      realtimeDb,
      `chatsAdmin/${chatChannelId}/messages`
    )
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
    if (!newChatMessage.trim() || !chatUser?._id) return
    const chatChannelId = generateChatId(chatUser._id)
    const chatRef = ref(
      realtimeDb,
      `chatsAdmin/${chatChannelId}/messages`
    )
    const message = {
      senderId: currentUser,
      receiverId: chatUser._id,
      receiverName: chatUser.name,
      type: 'hunter',
      msg: newChatMessage,
      timeStamp: Date.now(),
    }
  
    push(chatRef, message)
      .then(async () => {
        setNewChatMessage('')
        try {
          await axios.post(
            'http://18.209.91.97:7787/api/pushNotification/adminNotification',
            {
              title: 'New message from Support',
              body: `New message from Trade Hunters go to Support to see the message \n From Trade Hunters Support Team`,
              receiverId: chatUser._id,
            },
            authHeaders
          )
          console.log('Admin notification sent')
        } catch (err) {
          console.error('Failed to send admin notification', err)
        }
      })
      .catch((error) => console.error('Error sending message:', error))
  }

  return (
    <CContainer className="hunter-container">
      <CCard className="hunter-card">
        <CCardHeader className="hunter-card-header">
          <h4>Hunters List</h4>
          <div className="hunter-search-container">
            <CFormInput
              type="text"
              placeholder="Search by name, email or Address"
              value={search}
              onChange={handleSearch}
              className="hunter-search-input"
              title="Search by name, email or address"
            />
            <CButton
              color="primary"
              onClick={fetchUsers}
              className="hunter-search-button"
              title="Search"
            >
              <CIcon icon={cilSearch} /> Search
            </CButton>
            <CFormSelect
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value)
                setPage(1)
              }}
              className="hunter-status-select"
              title="Filter by user status"
            >
              <option value="">All Status</option>
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
                    <CTableHeaderCell>Name</CTableHeaderCell>
                    <CTableHeaderCell>Email</CTableHeaderCell>
                    <CTableHeaderCell>Contact</CTableHeaderCell>
                    <CTableHeaderCell>User Status</CTableHeaderCell>
                    <CTableHeaderCell>Account Status</CTableHeaderCell>
                    <CTableHeaderCell>Email Verified</CTableHeaderCell>
                    <CTableHeaderCell>Actions</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {users.map((user, index) => (
                    <CTableRow key={user._id}>
                      <CTableDataCell>  {totalCount - (index + (page - 1) * 10)}</CTableDataCell>
                      <CTableDataCell>{formatDate(user.insDate)}</CTableDataCell>
                      <CTableDataCell>{user.name}</CTableDataCell>
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
                      <CTableDataCell>{user.accountStatus}</CTableDataCell>
                      <CTableDataCell>{user.emailVerified ? 'Yes' : 'No'}</CTableDataCell>
                      <CTableDataCell className="hunter-actions-cell">
                        <span
                          onClick={() => handleView(user)}
                          className="hunter-action-icon"
                          title="View User"
                        >
                          <CIcon icon={cilInfo} size="lg" />
                        </span>
                        <span
                          onClick={() => handleNotification(user)}
                          className="hunter-action-icon"
                          title="Send Notification"
                        >
                          <CIcon icon={cilEnvelopeOpen} size="lg" />
                        </span>
                        <span
                          onClick={() => handleChat(user)}
                          className="hunter-action-icon"
                          title="Chat"
                        >
                          <CIcon icon={cilCommentBubble} size="lg" />
                        </span>
                        <span
                          onClick={() => handleEdit(user)}
                          className="hunter-action-icon"
                          title="Edit User"
                        >
                          <CIcon icon={cilPencil} size="lg" />
                        </span>
                        <span
                          onClick={() => handleDelete(user._id)}
                          className="hunter-action-icon"
                          title="Delete User"
                        >
                          <CIcon icon={cilTrash} size="lg" />
                        </span>
                        <span
                          onClick={() => JobsManagemen(user._id)}
                          className="hunter-action-icon"
                          title="Manage Jobs"
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
              title="Previous Page"
            >
              Previous
            </CButton>
            <span className="hunter-page-info">Page: {page}</span>
            <CButton
              color="secondary"
              onClick={nextPage}
              disabled={!hasMoreData}
              className="hunter-pagination-btn"
              title="Next Page"
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
        <CModalBody className="hunter-modal-body">
          <CFormInput
            type="text"
            name="name"
            label="Name"
            value={editUser?.name || ''}
            onChange={handleChange}
            className="hunter-modal-input"
            title="Edit Name"
          />
          <CFormInput
            type="email"
            name="email"
            label="Email"
            value={editUser?.email || ''}
            onChange={handleChange}
            className="hunter-modal-input"
            title="Edit Email"
          />
          <CFormInput
            type="text"
            name="phoneNo"
            label="Phone Number"
            value={editUser?.phoneNo || ''}
            onChange={handleChange}
            className="hunter-modal-input"
            title="Edit Phone Number"
          />
          <CFormSelect
            name="userStatus"
            label="User Status"
            value={editUser?.userStatus || ''}
            onChange={handleChange}
            className="hunter-modal-select"
            title="Edit User Status"
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
            title="Edit Admin Verified Status"
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
            title="Edit Account Status"
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
            title="Edit Email Verification"
          >
            <option value="true">Yes</option>
            <option value="false">No</option>
          </CFormSelect>
        </CModalBody>
        <CModalFooter className="hunter-modal-footer">
          <CButton
            color="secondary"
            onClick={() => setIsEditModalOpen(false)}
            className="hunter-modal-btn"
            title="Close Edit Modal"
          >
            Close
          </CButton>
          <CButton
            color="primary"
            onClick={handleSaveEdit}
            className="hunter-modal-btn"
            title="Save Changes"
          >
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
        <CModalBody className="hunter-modal-body">
          {viewUser && (
            <div className="hunter-view-content">
              {viewUser.images && (
                <div className="hunter-view-image">
                  <img
                    src={viewUser.images}
                    alt="User"
                    className="hunter-user-image"
                    title="User Image"
                  />
                </div>
              )}
              <p>
                <strong>Name:</strong> {viewUser.name}
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
                <strong>Joining Date:</strong> {formatDate(viewUser.createdAt)}
              </p>
              <p>
                <strong>Address:</strong>
                {viewUser?.address?.addressLine}
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
                        {file.filename} - {file.description}
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
            title="Close View Modal"
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
              <h5 className="hunter-notif-header">Sent Notifications</h5>
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
          <CModalTitle>Chat with {chatUser?.contactName || chatUser?.name}</CModalTitle>
        </CModalHeader>
        <div style={{ display: 'flex', flexDirection: 'column', height: '400px' }}>
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
            {chatMessages.length === 0 ? (
              <p>No messages yet.</p>
            ) : (
              chatMessages.map((msg, idx) => (
                <div
                  key={idx}
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
                    title={msg.senderId === currentUser ? 'Sent Message' : 'Received Message'}
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
                  title="Type your message here"
                />
              </CCol>
              <CCol md={2}>
                <CButton
                  color="primary"
                  onClick={handleSendChatMessage}
                  title="Send Chat Message"
                >
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

export default Hunter
