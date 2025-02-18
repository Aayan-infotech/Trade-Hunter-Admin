import React, { useEffect, useState } from 'react';
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
  CFormInput,
  CFormSelect,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CBadge,
  CButton
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import {
  cilSearch,
  cilTrash,
  cilPencil,
  cilBriefcase,
  cilInfo,
  cilEnvelopeOpen,
} from '@coreui/icons';
import { useNavigate } from 'react-router-dom';
import './Usermanagement.css';

const formatDate = (dateObj) => {
  if (!dateObj) return 'N/A';
  const date = new Date(dateObj);
  return date.toLocaleString();
};

const Hunter = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showUserStatusDropdown, setShowUserStatusDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isNotifModalOpen, setIsNotifModalOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [viewUser, setViewUser] = useState(null);
  const [notifUser, setNotifUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [notifType, setNotifType] = useState('alert');
  const [notifText, setNotifText] = useState('');
  const [hasMoreData, setHasMoreData] = useState(true);

  const navigate = useNavigate();

  const JobsManagemen = (_id) => {
    navigate('/JobsHunter', { state: { _id } });
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://44.196.64.110:7777/api/users/type/hunter/pagelimit/10?page=${page}&search=${search}&statusFilter=${statusFilter}`
      );
      setUsers(response.data.users);
      setHasMoreData(response.data.users.length === 10);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, search, statusFilter]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const nextPage = () => {
    if (hasMoreData) {
      setPage((prev) => prev + 1);
    }
  };

  const prevPage = () => {
    setPage((prev) => Math.max(prev - 1, 1));
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`http://44.196.64.110:7777/api/users/${id}`);
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleEdit = (user) => {
    setEditUser(user);
    setIsEditModalOpen(true);
  };

  const handleView = (user) => {
    setViewUser(user);
    setIsViewModalOpen(true);
  };

  const handleSaveEdit = async () => {
    try {
      await axios.put(`http://44.196.64.110:7777/api/users/${editUser._id}`, editUser);
      fetchUsers();
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Error editing user:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };
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
    if (!notifUser || !notifUser._id) {
      alert("Notification user not defined");
      return;
    }
    const deleteUrl = `http://localhost:7777/api/notification/delete/hunter/${notifUser._id}/${notifId}`;
    console.log("Deleting notification at:", deleteUrl);
    if (window.confirm("Are you sure you want to delete this notification?")) {
      try {
        await axios.delete(deleteUrl);
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
          <h4>Hunters List</h4>
          <div className="d-flex align-items-center">
            <CFormInput
              type="text"
              placeholder="Search by name, email or location"
              value={search}
              onChange={handleSearch}
              className="me-2 mb-0 c-form-input"
            />
            <CButton color="primary" onClick={fetchUsers} className="d-flex flex-row gap-2 align-items-center">
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
                    <CTableHeaderCell>Email Verified</CTableHeaderCell>
                    <CTableHeaderCell>Actions</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {users.map((user, index) => (
                    <CTableRow key={user._id}>
                      <CTableDataCell>{index + 1 + (page - 1) * 10}</CTableDataCell>
                      <CTableDataCell>{user.name}</CTableDataCell>
                      <CTableDataCell>{user.email}</CTableDataCell>
                      <CTableDataCell>{user.phoneNo}</CTableDataCell>
                      <CTableDataCell>{user.userStatus ? 'Active' : 'Inactive'}</CTableDataCell>
                      <CTableDataCell>{user.emailVerified ? 'Yes' : 'No'}</CTableDataCell>
                      <CTableDataCell className="d-flex justify-content-start">
                        <span onClick={() => handleView(user)} style={{ cursor: 'pointer', marginRight: '0.5rem' }}>
                          <CIcon icon={cilInfo} size="lg" />
                        </span>
                        <span onClick={() => handleNotification(user)} style={{ cursor: 'pointer', marginRight: '0.5rem' }}>
                          <CIcon icon={cilEnvelopeOpen} size="lg" />
                        </span>
                        <span onClick={() => handleEdit(user)} style={{ cursor: 'pointer', marginRight: '0.5rem' }}>
                          <CIcon icon={cilPencil} size="lg" />
                        </span>
                        <span onClick={() => handleDelete(user._id)} style={{ cursor: 'pointer', marginRight: '0.5rem' }}>
                          <CIcon icon={cilTrash} size="lg" />
                        </span>
                        <span onClick={() => JobsManagemen(user._id)} style={{ cursor: 'pointer' }}>
                          <CIcon icon={cilBriefcase} size="lg" />
                        </span>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </div>
          )}
          <div className="d-flex justify-content-between mt-3">
            <CButton color="secondary" onClick={prevPage} disabled={page === 1}>
              Previous
            </CButton>
            <span>Page: {page}</span>
            <CButton color="secondary" onClick={() => setPage(page + 1)} disabled={!hasMoreData}>
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
          <CFormInput type="text" name="name" label="Name" value={editUser?.name || ''} onChange={handleChange} />
          <CFormInput type="email" name="email" label="Email" value={editUser?.email || ''} onChange={handleChange} />
          <CFormInput type="text" name="phoneNo" label="Phone Number" value={editUser?.phoneNo || ''} onChange={handleChange} />
          <CFormSelect name="userStatus" label="User Status" value={editUser?.userStatus || ''} onChange={handleChange}>
            <option value="Active">Active</option>
            <option value="Suspended">Suspended</option>
            <option value="Pending">Pending</option>
          </CFormSelect>
          <CFormSelect name="emailVerified" label="Email Verified" value={editUser?.emailVerified ? 'true' : 'false'} onChange={handleChange}>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </CFormSelect>
          <CFormSelect name="accountStatus" label="Account Status" value={editUser?.accountStatus || ''} onChange={handleChange}>
            <option value="Suspend">Suspend</option>
            <option value="Deactivate">Deactivate</option>
            <option value="Reactivate">Reactivate</option>
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

      <CModal scrollable visible={isViewModalOpen} onClose={() => setIsViewModalOpen(false)}>
        <CModalHeader>
          <CModalTitle>View User</CModalTitle>
        </CModalHeader>
        <CModalBody style={{ maxHeight: '60vh', overflowY: 'auto' }}>
          {viewUser && (
            <div>
              {viewUser.images && (
                <div style={{ marginBottom: '1rem' }}>
                  <img src={viewUser.images} alt="User" style={{ width: '150px', height: 'auto', borderRadius: '5px' }} />
                </div>
              )}
              <p><strong>Name:</strong> {viewUser.name}</p>
              <p><strong>Email:</strong> {viewUser.email}</p>
              <p><strong>Phone Number:</strong> {viewUser.phoneNo}</p>
              <p><strong>User Type:</strong> {viewUser.userType}</p>
              <p><strong>User Status:</strong> {viewUser.userStatus || 'N/A'}</p>
              <p><strong>Email Verified:</strong> {viewUser.emailVerified ? 'Yes' : 'No'}</p>
              <p><strong>Insertion Date:</strong> {formatDate(viewUser.insDate)}</p>
              <p><strong>Terms &amp; Conditions:</strong> {viewUser.termsAndCondition ? 'Accepted' : 'Not Accepted'}</p>
              {viewUser.files && viewUser.files.length > 0 && (
                <div>
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
        <CModalFooter>
          <CButton color="secondary" onClick={() => setIsViewModalOpen(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>

      <CModal scrollable visible={isNotifModalOpen} onClose={() => setIsNotifModalOpen(false)}>
        <CModalHeader>
          <CModalTitle>Send Notification</CModalTitle>
        </CModalHeader>
        <CModalBody style={{ maxHeight: '60vh', overflowY: 'auto' }}>
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
        <CModalFooter>
          <CButton color="secondary" onClick={() => setIsNotifModalOpen(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>
    </CContainer>
  );
};

export default Hunter;
