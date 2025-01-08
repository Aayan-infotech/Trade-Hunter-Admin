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
  CButton,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CFormInput,
  CFormLabel,
  CFormCheck,
} from '@coreui/react';
import './Usermanagement.css';

const Usermanagement = () => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://44.196.64.110:7777/api/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const deleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`http://44.196.64.110:7777/api/users/${id}`);
        setUsers(users.filter((user) => user._id !== id));
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleView = (user) => {
    setSelectedUser(user);
    setIsEditing(false);
    setShowModal(true);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      await axios.put(`http://44.196.64.110:7777/api/users/${selectedUser._id}`, selectedUser);
      fetchUsers();
      setShowModal(false);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, checked, type } = e.target;
    setSelectedUser({ ...selectedUser, [name]: type === 'checkbox' ? checked : value });
  };

  return (
    <CContainer>
      <CCard>
        <CCardHeader>User Management</CCardHeader>
        <CCardBody>
          <CTable hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Sr. No</CTableHeaderCell>
                <CTableHeaderCell>Name</CTableHeaderCell>
                <CTableHeaderCell>Email</CTableHeaderCell>
                <CTableHeaderCell>Contact</CTableHeaderCell>
                <CTableHeaderCell>User Type</CTableHeaderCell>
                <CTableHeaderCell>User Status</CTableHeaderCell>
                <CTableHeaderCell>Email Verified</CTableHeaderCell>
                <CTableHeaderCell>Document Status</CTableHeaderCell>
                <CTableHeaderCell>Subscription Status</CTableHeaderCell>
                <CTableHeaderCell>Actions</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {users.map((user, index) => (
                <CTableRow key={user._id}>
                  <CTableDataCell>{index + 1}</CTableDataCell>
                  <CTableDataCell>{user.name}</CTableDataCell>
                  <CTableDataCell>{user.email}</CTableDataCell>
                  <CTableDataCell>{user.phoneNo}</CTableDataCell>
                  <CTableDataCell>{user.userType}</CTableDataCell>
                  <CTableDataCell>{user.userStatus ? 'Active' : 'Inactive'}</CTableDataCell>
                  <CTableDataCell>{user.emailVerified ? 'Verified' : 'Not Verified'}</CTableDataCell>
                  <CTableDataCell>{user.documentStatus ? 'Approved' : 'Pending'}</CTableDataCell>
                  <CTableDataCell>{user.subscriptionStatus ? 'Active' : 'Pending'}</CTableDataCell>
                  <CTableDataCell>
                    <CButton color="info" size="sm" onClick={() => handleView(user)}>
                      View
                    </CButton>
                    <CButton color="primary" size="sm" className="ms-2" onClick={() => handleEdit(user)}>
                      Edit
                    </CButton>
                    <CButton color="danger" size="sm" className="ms-2" onClick={() => deleteUser(user._id)}>
                      Delete
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>

      {/* Modal for View/Edit */}
      {selectedUser && (
        <CModal visible={showModal} onClose={() => setShowModal(false)}>
          <CModalHeader>{isEditing ? 'Edit User' : 'View User'}</CModalHeader>
          <CModalBody>
            {isEditing ? (
              <>
                <CFormLabel>Name</CFormLabel>
                <CFormInput
                  name="name"
                  value={selectedUser.name}
                  onChange={handleInputChange}
                />
                <CFormLabel>Email</CFormLabel>
                <CFormInput
                  name="email"
                  value={selectedUser.email}
                  onChange={handleInputChange}
                />
                <CFormLabel>Phone Number</CFormLabel>
                <CFormInput
                  name="phoneNo"
                  value={selectedUser.phoneNo}
                  onChange={handleInputChange}
                />
                <CFormLabel>User Status</CFormLabel>
                <CFormCheck
                  name="userStatus"
                  label="Active"
                  checked={selectedUser.userStatus}
                  onChange={handleInputChange}
                />
              </>
            ) : (
              <>
                <p><strong>Name:</strong> {selectedUser.name}</p>
                <p><strong>Email:</strong> {selectedUser.email}</p>
                <p><strong>Contact:</strong> {selectedUser.phoneNo}</p>
                <p><strong>User Type:</strong> {selectedUser.userType}</p>
                <p><strong>User Status:</strong> {selectedUser.userStatus ? 'Active' : 'Inactive'}</p>
              </>
            )}
          </CModalBody>
          <CModalFooter>
            {isEditing && (
              <CButton color="success" onClick={handleSave}>
                Save
              </CButton>
            )}
            <CButton color="secondary" onClick={() => setShowModal(false)}>
              Close
            </CButton>
          </CModalFooter>
        </CModal>
      )}
    </CContainer>
  );
};

export default Usermanagement;
