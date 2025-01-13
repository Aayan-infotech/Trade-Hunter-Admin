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
  CFormInput,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilSearch, cilTrash, cilPencil } from '@coreui/icons';
import './Usermanagement.css'; // Importing the CSS file

const Hunter = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        `http://localhost:7777/api/users/type/hunter/pagelimit/10?page=${page}&search=${search}`
      );
      setUsers(response.data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, search]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1); // Reset to first page on new search
  };

  const nextPage = () => setPage((prevPage) => prevPage + 1);
  const prevPage = () => setPage((prevPage) => Math.max(prevPage - 1, 1));

  return (
    <CContainer className="container">
      <CCard>
        <CCardHeader className="card-header">
          <h4>Hunter List</h4>
          <div className="d-flex align-items-center">
            <CFormInput
              type="text"
              placeholder="Search by name or email"
              value={search}
              onChange={handleSearch}
              className="me-2 c-form-input"
            />
            <CButton color="primary" onClick={fetchUsers} className="btn">
              <CIcon icon={cilSearch} /> Search
            </CButton>
          </div>
        </CCardHeader>
        <CCardBody>
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
              {users.map((user, index) => (
                <CTableRow key={user._id}>
                  <CTableDataCell>{index + 1 + (page - 1) * 10}</CTableDataCell>
                  <CTableDataCell>{user.name}</CTableDataCell>
                  <CTableDataCell>{user.email}</CTableDataCell>
                  <CTableDataCell>{user.phoneNo}</CTableDataCell>
                  <CTableDataCell>{user.userType}</CTableDataCell>
                  <CTableDataCell>{user.userStatus ? 'Active' : 'Inactive'}</CTableDataCell>
                  <CTableDataCell>{user.emailVerified ? 'Yes' : 'No'}</CTableDataCell>
                  <CTableDataCell>{user.documentStatus ? 'Approved' : 'Pending'}</CTableDataCell>
                  <CTableDataCell>{user.subscriptionStatus ? 'Active' : 'Inactive'}</CTableDataCell>
                  <CTableDataCell>
                    <CButton color="warning" size="sm" className="me-1 btn">
                      <CIcon icon={cilPencil} /> Edit
                    </CButton>
                    <CButton color="danger" size="sm" className="btn">
                      <CIcon icon={cilTrash} /> Delete
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
          <div className="d-flex justify-content-between mt-3">
            <CButton color="secondary" onClick={prevPage} disabled={page === 1} className="btn">
              Previous
            </CButton>
            <span>Page: {page}</span>
            <CButton color="secondary" onClick={nextPage} className="btn">
              Next
            </CButton>
          </div>
        </CCardBody>
      </CCard>
    </CContainer>
  );
};

export default Hunter;
