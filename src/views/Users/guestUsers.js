import React, { useState, useEffect } from 'react'
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
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilSearch, cilEnvelopeOpen, cilTrash, cilViewColumn } from '@coreui/icons'
import '../Users/Usermanagement.css'

const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A'
  const date = new Date(dateStr)
  return date.toLocaleDateString()
}

const GuestUsers = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [hasMoreData, setHasMoreData] = useState(true)

  const [viewUser, setViewUser] = useState(null)
  const [showViewModal, setShowViewModal] = useState(false)

  const [notifUser, setNotifUser] = useState(null)
  const [showNotifModal, setShowNotifModal] = useState(false)
  const [notifBody, setNotifBody] = useState('')
  const [notifTitle, setNotifTitle] = useState('')
  const [notifications, setNotifications] = useState([])
  const [totalCount, setTotalCount] = useState(0)

  const token = localStorage.getItem('token')
  const authHeaders = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  }

  const fetchGuestUsers = async () => {
    setLoading(true)
    try {
      const response = await axios.get(
        `http://18.209.91.97:7787/api/Prvdr/GuestMode/?page=${page}&limit=10&search=${search}`,
        authHeaders,
      )
      const fetchedUsers = response.data.data || []
      setTotalCount(response.data.metadata.total || 0)

      setUsers(fetchedUsers)
      setHasMoreData(fetchedUsers.length === 10)
    } catch (error) {
      console.error('Error fetching guest users:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchGuestUsers()
  }, [page, search])

  const handleSearchChange = (e) => {
    setSearch(e.target.value)
    setPage(1)
  }

  const nextPage = () => {
    if (hasMoreData) setPage((prev) => prev + 1)
  }

  const prevPage = () => setPage((prev) => Math.max(prev - 1, 1))

  const handleViewUser = (user) => {
    setViewUser(user)
    setShowViewModal(true)
  }

  const handleNotification = (user) => {
    setNotifUser(user)
    setNotifTitle('')
    setNotifBody('')
    setShowNotifModal(true)
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
    if (!notifBody.trim()) {
      alert('Please enter notification body.')
      return
    }
    try {
      await axios.post(
        `http://18.209.91.97:7787/api/pushNotification/sendAdminNotification/${notifUser._id}`,
        { title: notifTitle, body: notifBody },
        authHeaders,
      )
      alert('Notification sent successfully!')
      setNotifBody('')
      setNotifTitle('')
      fetchNotifications(notifUser._id)
    } catch (error) {
      console.error('Error sending notification:', error)
      alert('Failed to send notification.')
    }
  }

  const handleDeleteNotification = async (notifId) => {
    if (!notifUser?._id) {
      alert('Notification user not defined')
      return
    }
    const deleteUrl = `http://18.209.91.97:7787/api/notification/delete/provider/${notifUser._id}/${notifId}`
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

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this guest user?')) {
      try {
        await axios.delete(`http://18.209.91.97:7787/api/Prvdr/delete/${userId}`, authHeaders)
        alert('User deleted successfully.')
        fetchGuestUsers()
      } catch (error) {
        console.error('Error deleting user:', error)
        alert('Failed to delete user.')
      }
    }
  }

  return (
    <CContainer className="hunter-container">
      <CCard className="hunter-card">
        <CCardHeader className="hunter-card-header">
          <h4>Guest Users</h4>
          <div className="hunter-search-container" style={{ gap: '10px', flexWrap: 'wrap' }}>
            <CFormInput
              type="text"
              placeholder="Search by Business Name, Email or Address"
              value={search}
              onChange={handleSearchChange}
              className="guest-search-input"
            />
            <CButton color="primary" onClick={fetchGuestUsers} className="hunter-search-button">
              <CIcon icon={cilSearch} /> Search
            </CButton>
          </div>
        </CCardHeader>
        <CCardBody className="hunter-card-body">
          {loading ? (
            <div className="text-center">Loading...</div>
          ) : (
            <CTable hover responsive className="hunter-table">
              <CTableHead className="sticky-header">

                <CTableRow>
                  <CTableHeaderCell>Sr. No</CTableHeaderCell>
                  <CTableHeaderCell>Joining Date</CTableHeaderCell>
                  <CTableHeaderCell>Business Name</CTableHeaderCell>
                  <CTableHeaderCell>Email</CTableHeaderCell>
                  <CTableHeaderCell>Contact No</CTableHeaderCell>
                  <CTableHeaderCell>Actions</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {users.map((user, index) => (
                  <CTableRow key={user._id}>
                     <CTableDataCell>{totalCount - (index + (page - 1) * 10)}</CTableDataCell>
                    <CTableDataCell>{formatDate(user.insDate)}</CTableDataCell>
                    <CTableDataCell className="text-left">
                      {user.businessName || 'N/A'}
                    </CTableDataCell>
                    <CTableDataCell className="text-left">{user.email}</CTableDataCell>
                    <CTableDataCell className="text-left">{user.phoneNo}</CTableDataCell>
                    <CTableDataCell
                      className="text-left"
                      style={{ display: 'flex', gap: '10px', alignItems: 'center' }}
                    >
                      <CIcon
                        className="action-icon view-icon"
                        title="view"
                        onClick={() => handleViewUser(user)}
                        icon={cilViewColumn}
                        size="lg"
                      />
                      <CIcon
                        className="action-icon notif-icon"
                        title="send Notification"
                        onClick={() => handleNotification(user)}
                        icon={cilEnvelopeOpen}
                        size="lg"
                      />
                      <CIcon
                        className="action-icon delete-icon"
                        title="delete user"
                        onClick={() => handleDeleteUser(user._id)}
                        icon={cilTrash}
                        size="lg"
                        style={{ color: 'red', cursor: 'pointer' }}
                      />
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          )}
          <div
            className="hunter-pagination d-flex justify-content-center align-items-center mt-3"
            style={{ gap: '20px' }}
          >
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
        visible={showViewModal}
        onClose={() => setShowViewModal(false)}
        className="custom-modal"
      >
        <CModalHeader className="modal-header-custom">
          <CModalTitle>Guest User Details</CModalTitle>
        </CModalHeader>
        <CModalBody className="modal-body-custom">
          {viewUser && (
            <div>
              <p>
                <strong>Name:</strong> {viewUser.contactName}
              </p>
              <p>
                <strong>Email:</strong> {viewUser.email}
              </p>
              <p>
                <strong>Contact No:</strong> {viewUser.phoneNo}
              </p>
              <p>
                <strong>Address:</strong> {viewUser?.address?.addressLine || 'N/A'}
              </p>
              <p>
                <strong>Email Verified:</strong> {viewUser.emailVerified === 1 ? 'Yes' : 'No'}
              </p>
              <p>
                <strong>Business Name:</strong> {viewUser.businessName}
              </p>
              <p>
                <strong>ABN Number:</strong> {viewUser.ABN_Number}
              </p>
            </div>
          )}
        </CModalBody>
        <CModalFooter className="modal-footer-custom">
          <CButton color="secondary" onClick={() => setShowViewModal(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>

      <CModal
        scrollable
        visible={showNotifModal}
        onClose={() => setShowNotifModal(false)}
        className="custom-modal"
      >
        <CModalHeader className="modal-header-custom">
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
        <CModalFooter className="modal-footer-custom">
          <CButton color="secondary" onClick={() => setShowNotifModal(false)}>
            Close
          </CButton>
          <CButton color="primary" onClick={handleSendNotification}>
            Send
          </CButton>
        </CModalFooter>
      </CModal>
    </CContainer>
  )
}

export default GuestUsers
