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
  CFormSelect,
} from '@coreui/react';
import { cilUser,cilUserPlus, cilSearch, cilTrash, cilPencil } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import './Usermanagement.css';

const Usermanagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [userTypeFilter, setUserTypeFilter] = useState('all'); // 'all', 'hunter', 'provider'
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://44.196.64.110:7777/api/users');
      setUsers(response.data);
      setFilteredUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const deleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`http://44.196.64.110:7777/api/users/${id}`);
        setUsers(users.filter((user) => user._id !== id));
        setFilteredUsers(filteredUsers.filter((user) => user._id !== id));
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

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    const lowercasedSearchTerm = e.target.value.toLowerCase();
    const filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(lowercasedSearchTerm) ||
        user.email.toLowerCase().includes(lowercasedSearchTerm)
    );
    setFilteredUsers(filtered);
    setCurrentPage(1); // Reset to the first page
  };

  const handleUserTypeFilter = (e) => {
    const filter = e.target.value;
    setUserTypeFilter(filter);

    let filtered = users;
    if (filter === 'hunter') {
      filtered = users.filter((user) => user.userType === 'hunter');
    } else if (filter === 'provider') {
      filtered = users.filter((user) => user.userType === 'provider');
    }
    setFilteredUsers(filtered);
    setCurrentPage(1); // Reset to the first page
  };

  const renderFilePreview = (file) => {
    const fileExtension = file.split('.').pop().toLowerCase();
    if (['jpg', 'png', 'jpeg'].includes(fileExtension)) {
      return <img src={`http://44.196.64.110:7777/uploads/${file}`} alt={file} style={{ width: '100px', height: 'auto' }} />;
    }
    if (fileExtension === 'pdf') {
      return <embed src={`http://44.196.64.110:7777/uploads/${file}`} type="application/pdf" width="100px" height="100px" />;
    }
    return <a href={`http://44.196.64.110:7777/uploads/${file}`} target="_blank" rel="noopener noreferrer">Download {file}</a>;
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <CContainer>
      <CCard>
        <CCardHeader>User Management</CCardHeader>
        <CCardBody>
          {/* Search Bar and Filter */}
          <div className="mb-4 d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              {/* Search Input */}
              <CFormInput
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-50 me-3"
              />
              <CButton color="primary" onClick={() => fetchUsers()}>Reset</CButton>
            </div>

            {/* User Type Filter */}
            <CFormSelect value={userTypeFilter} onChange={handleUserTypeFilter} className="w-25">
              <option value="all">All</option>
              <option value="hunter">
                <CIcon icon={cilUser} className="me-2" />
                Hunter
              </option>
              <option value="provider">
                <CIcon icon={cilUserPlus} className="me-2" />
                Provider
              </option>
            </CFormSelect>
          </div>

          {/* User Table */}
          <CTable hover responsive className="ctable">
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
    {currentUsers.map((user, index) => (
      <CTableRow key={user._id}>
        <CTableDataCell>{index + 1}</CTableDataCell>
        <CTableDataCell>{user.name}</CTableDataCell>
        <CTableDataCell>{user.email}</CTableDataCell>
        <CTableDataCell>{user.phoneNo}</CTableDataCell>
        <CTableDataCell>
          <CIcon
            icon={user.userType === 'hunter' ? cilUser : cilUserPlus}
            className="me-2"
          />
          {user.userType}
        </CTableDataCell>
        <CTableDataCell>{user.userStatus ? 'Active' : 'Inactive'}</CTableDataCell>
        <CTableDataCell>{user.emailVerified ? 'Verified' : 'Not Verified'}</CTableDataCell>
        <CTableDataCell>{user.documentStatus ? 'Approved' : 'Pending'}</CTableDataCell>
        <CTableDataCell>{user.subscriptionStatus ? 'Active' : 'Pending'}</CTableDataCell>
        <CTableDataCell>
          <CButton color="info" size="sm" onClick={() => handleView(user)}>
            <CIcon icon={cilSearch} />
          </CButton>

          <CButton color="primary" size="sm" className="ms-2" onClick={() => handleEdit(user)}>
            <CIcon icon={cilPencil} />
          </CButton>

          <CButton color="danger" size="sm" className="ms-2" onClick={() => deleteUser(user._id)}>
            <CIcon icon={cilTrash} />
          </CButton>
        </CTableDataCell>
      </CTableRow>
    ))}
  </CTableBody>
</CTable>


          {/* Pagination */}
          <div className="d-flex justify-content-center mt-4">
            <CButton
              color="secondary"
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Prev
            </CButton>
            <CButton color="secondary" className="mx-2">
              Page {currentPage}
            </CButton>
            <CButton
              color="secondary"
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage * usersPerPage >= filteredUsers.length}
            >
              Next
            </CButton>
          </div>
        </CCardBody>
      </CCard>

      {/* Modal for View/Edit */}
      {selectedUser && (
        <CModal visible={showModal} onClose={() => setShowModal(false)} className="c-modal">
          <CModalHeader className="c-modal-header">{isEditing ? 'Edit User' : 'View User'}</CModalHeader>
          <CModalBody className="c-modal-body">
            {isEditing ? (
              <>
                <CFormLabel className="c-form-label">Name</CFormLabel>
                <CFormInput
                  name="name"
                  value={selectedUser.name}
                  onChange={handleInputChange}
                  className="c-form-input"
                />

                <CFormLabel className="c-form-label">Email</CFormLabel>
                <CFormInput
                  name="email"
                  value={selectedUser.email}
                  onChange={handleInputChange}
                  className="c-form-input"
                />

                <CFormLabel className="c-form-label">Phone No</CFormLabel>
                <CFormInput
                  name="phoneNo"
                  value={selectedUser.phoneNo}
                  onChange={handleInputChange}
                  className="c-form-input"
                />

                <CFormLabel className="c-form-label">Document Status</CFormLabel>
                <CFormCheck
                  name="documentStatus"
                  label="Approved"
                  checked={selectedUser.documentStatus}
                  onChange={handleInputChange}
                  className="c-form-check"
                />

                <CFormLabel className="c-form-label">Business Type</CFormLabel>
                <CFormInput
                  name="businessType"
                  value={selectedUser.businessType}
                  onChange={handleInputChange}
                  className="c-form-input"
                />
              </>
            ) : (
              <>
                <div className="modal-text"><strong>Name:</strong> {selectedUser.name}</div>
                <div className="modal-text"><strong>Email:</strong> {selectedUser.email}</div>
                <div className="modal-text"><strong>Phone No:</strong> {selectedUser.phoneNo}</div>
                <div className="modal-text"><strong>Address:</strong> {selectedUser.address}</div>
                <div className="modal-text"><strong>ABN Number:</strong> {selectedUser.ABN_Number}</div>
                <div className="modal-text"><strong>Business Type:</strong> {selectedUser.businessType}</div>
                <div className="modal-text"><strong>Service Type:</strong> {selectedUser.serviceType.join(', ')}</div>
                <div className="modal-text"><strong>User Type:</strong> {selectedUser.userType}</div>
                <div className="modal-text"><strong>User Status:</strong> {selectedUser.userStatus ? 'Active' : 'Inactive'}</div>
                <div className="modal-text"><strong>Email Verified:</strong> {selectedUser.emailVerified ? 'Verified' : 'Not Verified'}</div>
                <div className="modal-text"><strong>Document Status:</strong> {selectedUser.documentStatus ? 'Approved' : 'Pending'}</div>
                <div className="modal-text"><strong>Subscription Status:</strong> {selectedUser.subscriptionStatus ? 'Active' : 'Pending'}</div>
                <div className="modal-text"><strong>Terms and Conditions Accepted:</strong> {selectedUser.termsAndCondition ? 'Yes' : 'No'}</div>
                <div className="modal-text"><strong>Ins Ip:</strong> {selectedUser.insIp}</div>
                <div className="modal-text"><strong>Updated At:</strong> {new Date(selectedUser.updatedAt).toLocaleString()}</div>

                {/* Display files if available */}
                <div className="modal-text">
                  <strong>Files:</strong>
                  <div className="file-preview-container">
                    {selectedUser.files.length > 0 ? (
                      selectedUser.files.map((file, index) => (
                        <div key={index}>
                          {renderFilePreview(file)}
                        </div>
                      ))
                    ) : (
                      <p>No files available</p>
                    )}
                  </div>
                </div>
              </>
            )}
          </CModalBody>
          <CModalFooter className="c-modal-footer">
            {isEditing && (
              <CButton color="success" onClick={handleSave} className="btn btn-success">
                Save
              </CButton>
            )}
            <CButton color="secondary" onClick={() => setShowModal(false)} className="btn btn-secondary">
              Close
            </CButton>
          </CModalFooter>
        </CModal>
      )}



    </CContainer>
  );
};

export default Usermanagement;
