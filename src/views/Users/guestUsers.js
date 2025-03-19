import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilSearch, cilEnvelopeOpen, cilTrash, cilViewColumn } from '@coreui/icons';
import '../Users/Usermanagement.css';

// Helper function to display only the date portion
const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  const date = new Date(dateStr);
  return date.toLocaleDateString();
};

const GuestUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [hasMoreData, setHasMoreData] = useState(true);

  // View modal state
  const [viewUser, setViewUser] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);

  // Notification modal state
  const [notifUser, setNotifUser] = useState(null);
  const [showNotifModal, setShowNotifModal] = useState(false);
  const [notifText, setNotifText] = useState('');
  const [notifType, setNotifType] = useState('alert');
  const [notifications, setNotifications] = useState([]);

  const fetchGuestUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://3.223.253.106:7777/api/Prvdr/GuestMode/?page=${page}&limit=10&search=${search}`
      );
      // Sort users by insDate (joining date) in descending order (latest joining first)
      const sortedUsers = (response.data.data || []).sort(
        (a, b) => new Date(b.insDate) - new Date(a.insDate)
      );
      setUsers(sortedUsers);
      setHasMoreData((response.data.data || []).length === 10);
    } catch (error) {
      console.error('Error fetching guest users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuestUsers();
  }, [page, search]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const nextPage = () => {
    if (hasMoreData) setPage((prev) => prev + 1);
  };

  const prevPage = () => setPage((prev) => Math.max(prev - 1, 1));

  // View modal functions
  const handleViewUser = (user) => {
    setViewUser(user);
    setShowViewModal(true);
  };

  // Notification modal functions
  const handleNotification = (user) => {
    setNotifUser(user);
    setShowNotifModal(true);
    fetchNotifications(user._id);
  };

  const fetchNotifications = async (userId) => {
    try {
      const response = await axios.get(
        `http://3.223.253.106:7777/api/notification/getAll/provider/${userId}`
      );
      setNotifications(response.data.data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleSendNotification = async () => {
    if (!notifText.trim()) {
      alert('Please enter notification text.');
      return;
    }
    try {
      await axios.post(
        `http://3.223.253.106:7777/api/notification/send/provider/${notifUser._id}`,
        { type: notifType, text: notifText }
      );
      alert('Notification sent successfully!');
      setNotifText('');
      fetchNotifications(notifUser._id);
    } catch (error) {
      console.error('Error sending notification:', error);
      alert('Failed to send notification.');
    }
  };

  const handleDeleteNotification = async (notifId) => {
    if (!notifUser || !notifUser._id) {
      alert('Notification user not defined');
      return;
    }
    const deleteUrl = `http://3.223.253.106:7777/api/notification/delete/provider/${notifUser._id}/${notifId}`;
    if (window.confirm('Are you sure you want to delete this notification?')) {
      try {
        await axios.delete(deleteUrl);
        fetchNotifications(notifUser._id);
      } catch (error) {
        console.error('Error deleting notification:', error);
        alert('Failed to delete notification. Please try again.');
      }
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this guest user?')) {
      try {
        await axios.delete(`http://3.223.253.106:7777/api/Prvdr/${userId}`);
        alert('User deleted successfully.');
        fetchGuestUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete user.');
      }
    }
  };

  return (
    <CContainer className="hunter-container">
      <CCard className="hunter-card">
        <CCardHeader className="hunter-card-header">
          <h4>Guest Users</h4>
          <div className="hunter-search-container" style={{ gap: '10px', flexWrap: 'wrap' }}>
            <CFormInput
              type="text"
              placeholder="Search by name, Email or Address"
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
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Sr. No</CTableHeaderCell>
                  <CTableHeaderCell>Joining Date</CTableHeaderCell>
                  <CTableHeaderCell>Name</CTableHeaderCell>
                  <CTableHeaderCell>Email</CTableHeaderCell>
                  <CTableHeaderCell>Contact No</CTableHeaderCell>
                  <CTableHeaderCell>Business Name</CTableHeaderCell>
                  <CTableHeaderCell>Actions</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {users.map((user, index) => (
                  <CTableRow key={user._id}>
                    <CTableDataCell>{index + 1 + (page - 1) * 10}</CTableDataCell>
                    <CTableDataCell>{formatDate(user.insDate)}</CTableDataCell>
                    <CTableDataCell className="text-left">{user.contactName}</CTableDataCell>
                    <CTableDataCell className="text-left">{user.email}</CTableDataCell>
                    <CTableDataCell className="text-left">{user.phoneNo}</CTableDataCell>
                    <CTableDataCell className="text-left">{user.businessName || 'N/A'}</CTableDataCell>
                    <CTableDataCell
                      className="text-left"
                      style={{ display: 'flex', gap: '10px', alignItems: 'center' }}
                    >
                      <CIcon
                        className="action-icon view-icon"
                        onClick={() => handleViewUser(user)}
                        icon={cilViewColumn}
                        size="lg"
                      />
                      <CIcon
                        className="action-icon notif-icon"
                        onClick={() => handleNotification(user)}
                        icon={cilEnvelopeOpen}
                        size="lg"
                      />
                      <CIcon
                        className="action-icon delete-icon"
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
            <CButton color="secondary" onClick={prevPage} disabled={page === 1} className="hunter-pagination-btn">
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

      {/* View User Modal */}
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

      {/* Notification Modal */}
      <CModal
        scrollable
        visible={showNotifModal}
        onClose={() => setShowNotifModal(false)}
        className="custom-modal"
      >
        <CModalHeader className="modal-header-custom">
          <CModalTitle>Send Notification</CModalTitle>
        </CModalHeader>
        <CModalBody className="modal-body-custom">
          {notifUser && (
            <>
              <div className="mb-3">
                <label>
                  <strong>Notification Type</strong>
                </label>
                <CFormSelect value={notifType} onChange={(e) => setNotifType(e.target.value)}>
                  <option value="alert">Alert</option>
                  <option value="reminder">Reminder</option>
                  <option value="promotion">Promotion</option>
                </CFormSelect>
              </div>
              <div className="mb-3">
                <label>
                  <strong>Notification Text</strong>
                </label>
                <CFormInput
                  type="text"
                  placeholder="Enter notification text"
                  value={notifText}
                  onChange={(e) => setNotifText(e.target.value)}
                />
              </div>
              <hr />
              <h5>Sent Notifications</h5>
              {notifications.length === 0 ? (
                <p>No notifications sent yet.</p>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif._id}
                    className="d-flex justify-content-between align-items-center border p-2 my-1"
                  >
                    <div>
                      <strong>{notif.type.toUpperCase()}</strong>: {notif.text}
                    </div>
                    <span
                      onClick={() => handleDeleteNotification(notif._id)}
                      style={{ cursor: 'pointer', color: 'red', fontSize: '1.3rem' }}
                    >
                      <CIcon icon={cilTrash} />
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
  );
};

export default GuestUsers;
