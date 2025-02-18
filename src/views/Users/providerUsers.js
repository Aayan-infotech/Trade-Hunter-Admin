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
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilSearch, cilTrash, cilPencil ,cilEnvelopeOpen} from '@coreui/icons'
import './Usermanagement.css'

const Provider = () => {
  const [users, setUsers] = useState([])
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isNotifModalOpen, setIsNotifModalOpen] = useState(false);
  const [editUser, setEditUser] = useState(null)
  const [notifUser, setNotifUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [notifType, setNotifType] = useState('alert');
  const [notifText, setNotifText] = useState('');
  const [hasMoreData, setHasMoreData] = useState(true)
  const [statusFilter, setStatusFilter] = useState('');
  const [showUserStatusDropdown, setShowUserStatusDropdown] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await axios.get(
        `http://44.196.64.110:7777/api/Prvdr?page=${page}&limit=10&search=${search}`
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
  }, [page, search])

  const handleSearch = (e) => {
    setSearch(e.target.value)
    setPage(1)
  }

  const nextPage = () => {
    if (hasMoreData) {
      setPage((prevPage) => prevPage + 1)
    }
  }

  const prevPage = () => setPage((prevPage) => Math.max(prevPage - 1, 1))

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?")
    if (confirmDelete) {
      try {
        await axios.delete(`http://44.196.64.110:7777/api/Prvdr/${id}`)
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

  const handleSaveEdit = async () => {
    try {
      await axios.put(`http://44.196.64.110:7777/api/Prvdr/${editUser._id}`, editUser)
      fetchUsers()
      setIsEditModalOpen(false)
    } catch (error) {
      console.error('Error editing user:', error)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    const updatedValue = value === 'true' ? 1 : value === 'false' ? 0 : value
    setEditUser({
      ...editUser,
      [name]: updatedValue,
    })
  }


  const handleNotification = (user) => {
    setNotifUser(user);
    setIsNotifModalOpen(true);
    fetchNotifications(user._id);
  };

  const fetchNotifications = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:7777/api/notification/getAll/hunter/${userId}`);
      setNotifications(response.data.data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleSendNotification = async () => {
    if (!notifText) {
      alert("Please enter notification text.");
      return;
    }
    try {
      await axios.post(`http://localhost:7777/api/notification/send/hunter/${notifUser._id}`, {
        type: notifType,
        text: notifText,
      });
      setNotifText('');
      fetchNotifications(notifUser._id);
      alert("Notification sent successfully!");
    } catch (error) {
      console.error("Error sending notification:", error);
      alert("Failed to send notification. Please try again.");
    }
  };

  const handleDeleteNotification = async (notifId) => {
    if (window.confirm("Are you sure you want to delete this notification?")) {
      try {
        await axios.delete(`http://localhost:7777/api/notification/delete/hunter/${notifUser._id}/${notifId}`);
        fetchNotifications(notifUser._id);
      } catch (error) {
        console.error("Error deleting notification:", error);
        alert("Failed to delete notification. Please try again.");
      }
    }
  };

  return (
    <CContainer className="container">
      <CCard>
        <CCardHeader className="card-header">
          <h4>Providers List</h4>
          <div className="d-flex align-items-center">
            <CFormInput
              type="text"
              placeholder="Search by name or email"
              value={search}
              onChange={handleSearch}
              className="me-2 mb-0 c-form-input"
            />
            <CButton color="primary" onClick={fetchUsers} className="btn d-flex flex-row gap-2 align-items-center">
              <CIcon icon={cilSearch} /> Search
            </CButton>
          </div>
        </CCardHeader>
        <CCardBody>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              <CTable hover responsive className="ctable">
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Sr. No</CTableHeaderCell>
                    <CTableHeaderCell>Name</CTableHeaderCell>
                    <CTableHeaderCell>Email</CTableHeaderCell>
                    <CTableHeaderCell>Contact</CTableHeaderCell>
                    <CTableHeaderCell style={{ position: 'relative' }}>
                                          {showUserStatusDropdown ? (
                                            <CFormSelect
                                              size="sm"
                                              value={statusFilter}
                                              onChange={(e) => {
                                                setStatusFilter(e.target.value);
                                                setPage(1);
                                                setShowUserStatusDropdown(false);
                                              }}
                                              onBlur={() => setShowUserStatusDropdown(false)}
                                              style={{ width: '100%' }}
                                              autoFocus
                                            >
                                              <option value="">All</option>
                                              <option value="Active">Active</option>
                                              <option value="Suspended">Suspended</option>
                                              <option value="Pending">Pending</option>
                                            </CFormSelect>
                                          ) : (
                                            <span onClick={() => setShowUserStatusDropdown(true)} style={{ cursor: 'pointer', display: 'block' }}>
                                              {statusFilter ? `User Status: ${statusFilter}` : 'User Status'}
                                            </span>
                                          )}
                                        </CTableHeaderCell>
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
                      <CTableDataCell>{user.contactName}</CTableDataCell>
                      <CTableDataCell>{user.email}</CTableDataCell>
                      <CTableDataCell>{user.phoneNo}</CTableDataCell>
                      <CTableDataCell>{user.userStatus}</CTableDataCell>
                      <CTableDataCell>{user.adminVerified}</CTableDataCell>
                      <CTableDataCell>{user.emailVerified ? 'Yes' : 'No'}</CTableDataCell>
                      <CTableDataCell>{user.documentStatus ? 'Approved' : 'Pending'}</CTableDataCell>
                      <CTableDataCell>{user.subscriptionStatus ? 'Active' : 'Inactive'}</CTableDataCell>
                      <CTableDataCell className="d-flex justify-content-start">
                        <CIcon className="fw-bold text-success me-2" onClick={() => handleEdit(user)} icon={cilPencil} />
                        <CIcon className="fw-bold text-success me-2" onClick={() => handleDelete(user._id)} icon={cilTrash} />
                          <CIcon className ="fw-bold text-success me-2" onClick={() => handleNotification(user)} icon={cilEnvelopeOpen}   />
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </div>
          )}
          <div className="d-flex justify-content-between mt-3">
            <CButton color="secondary" onClick={prevPage} disabled={page === 1} className="btn">
              Previous
            </CButton>
            <span>Page: {page}</span>
            <CButton color="secondary" onClick={() => setPage(page + 1)} disabled={!hasMoreData} className="btn">
              Next
            </CButton>
          </div>
        </CCardBody>
      </CCard>

      <CModal scrollable visible={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <CModalHeader>
          <CModalTitle>Edit User</CModalTitle>
        </CModalHeader>
        <CModalBody style={{ maxHeight: '60vh', overflowY: 'auto' }}>
          <CFormInput
            type="text"
            name="contactName"
            label="Name"
            value={editUser?.contactName || ''}
            onChange={handleChange}
          />
          <CFormInput
            type="email"
            name="email"
            label="Email"
            value={editUser?.email || ''}
            onChange={handleChange}
          />
          <CFormInput
            type="text"
            name="phoneNo"
            label="Phone Number"
            value={editUser?.phoneNo || ''}
            onChange={handleChange}
          />
          <CFormSelect
            name="userStatus"
            label="User Status"
            value={editUser?.userStatus || ''}
            onChange={handleChange}
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
          >
            <option value="Verified">Verified</option>
            <option value="Not-Verified">Not Verified</option>
          </CFormSelect>
          <CFormSelect
            name="accountStatus"
            label="Account Status"
            value={editUser?.accountStatus || ''}
            onChange={handleChange}
          >
            <option value="Suspend">Suspend</option>
            <option value="Deactivate">Deactivate</option>
            <option value="Reactivate">Reactivate</option>
          </CFormSelect>
          <CFormSelect
            name="emailVerified"
            label="Email Verified"
            value={editUser?.emailVerified !== undefined ? editUser?.emailVerified.toString() : ''}
            onChange={handleChange}
          >
            <option value="true">Yes</option>
            <option value="false">No</option>
          </CFormSelect>
          <CFormSelect
            name="documentStatus"
            label="Document Status"
            value={editUser?.documentStatus === 1 ? 'true' : 'false'}
            onChange={handleChange}
          >
            <option value="true">Approved</option>
            <option value="false">Pending</option>
          </CFormSelect>
          <CFormSelect
            name="subscriptionStatus"
            label="Subscription Status"
            value={editUser?.subscriptionStatus === 1 ? 'true' : 'false'}
            onChange={handleChange}
          >
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </CFormSelect>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setIsEditModalOpen(false)}>
            Close
          </CButton>
          <CButton color="primary" onClick={handleSaveEdit}>
            Save Changes
          </CButton>
        </CModalFooter>
      </CModal>

            {/* Notification Modal */}
            <CModal scrollable visible={isNotifModalOpen} onClose={() => setIsNotifModalOpen(false)}>
        <CModalHeader>
          <CModalTitle>Send Notification</CModalTitle>
        </CModalHeader>
        <CModalBody style={{ maxHeight: '60vh', overflowY: 'auto' }}>
          {notifUser && (
            <>
              <div className="mb-3">
                <label><strong>Notification Type</strong></label>
                <CFormSelect
                  value={notifType}
                  onChange={(e) => setNotifType(e.target.value)}
                >
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
              <CButton color="primary" onClick={handleSendNotification} className="mb-3">
                Send Notification
              </CButton>
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
                    <CButton color="danger" size="sm" onClick={() => handleDeleteNotification(notif._id)}>
                      <CIcon icon={cilTrash} />
                    </CButton>
                  </div>
                ))
              )}
            </>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setIsNotifModalOpen(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>
    </CContainer>
  )
}

export default Provider