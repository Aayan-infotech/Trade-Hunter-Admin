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
import { cilSearch, cilTrash, cilPencil } from '@coreui/icons'
import './Usermanagement.css'

const Provider = () => {
  const [users, setUsers] = useState([])
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editUser, setEditUser] = useState(null)
  const [hasMoreData, setHasMoreData] = useState(true)

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await axios.get(
        `http://44.196.64.110:7777/api/Prvdr?page=${page}&limit=10&search=${search}`,
      )
      setUsers(response.data.data) // Adjusted to match the API response structure
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
    try {
      await axios.delete(`http://44.196.64.110:7777/api/Prvdr/${id}`)
      fetchUsers()
    } catch (error) {
      console.error('Error deleting user:', error)
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
    const updatedValue = value === 'true' ? true : value === 'false' ? false : value

    setEditUser({
      ...editUser,
      [name]: updatedValue,
    })
  }

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
            <CTable hover responsive className="ctable">
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Sr. No</CTableHeaderCell>
                  <CTableHeaderCell>Name</CTableHeaderCell>
                  <CTableHeaderCell>Email</CTableHeaderCell>
                  <CTableHeaderCell>Contact</CTableHeaderCell>
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
                    <CTableDataCell>{user.contactName}</CTableDataCell>
                    <CTableDataCell>{user.email}</CTableDataCell>
                    <CTableDataCell>{user.phoneNo}</CTableDataCell>
                    <CTableDataCell>{user.userStatus ? 'Active' : 'Inactive'}</CTableDataCell>
                    <CTableDataCell>{user.emailVerified ? 'Yes' : 'No'}</CTableDataCell>
                    <CTableDataCell>{user.documentStatus ? 'Approved' : 'Pending'}</CTableDataCell>
                    <CTableDataCell>
                      {user.subscriptionStatus ? 'Active' : 'Inactive'}
                    </CTableDataCell>
                    <CTableDataCell className="d-flex justify-content-start">
                      <CIcon
                        className="fw-bold text-success me-2"
                        onClick={() => handleEdit(user)}
                        icon={cilPencil}
                      />
                      <CIcon
                        className="fw-bold text-success me-2"
                        onClick={() => handleDelete(user._id)}
                        icon={cilTrash}
                      />
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          )}
          <div className="d-flex justify-content-between mt-3">
            <CButton color="secondary" onClick={prevPage} disabled={page === 1} className="btn">
              Previous
            </CButton>
            <span>Page: {page}</span>
            <CButton color="secondary" onClick={nextPage} disabled={!hasMoreData} className="btn">
              Next
            </CButton>
          </div>
        </CCardBody>
      </CCard>

      {/* Edit User Modal */}
      <CModal visible={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <CModalHeader>
          <CModalTitle>Edit User</CModalTitle>
        </CModalHeader>
        <CModalBody>
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
            value={editUser?.userStatus !== undefined ? editUser?.userStatus.toString() : ''}
            onChange={handleChange}
          >
            <option value="true">Active</option>
            <option value="false">Inactive</option>
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
            value={
              editUser?.documentStatus !== undefined ? editUser?.documentStatus.toString() : ''
            }
            onChange={handleChange}
          >
            <option value="true">Approved</option>
            <option value="false">Pending</option>
          </CFormSelect>
          <CFormSelect
            name="subscriptionStatus"
            label="Subscription Status"
            value={
              editUser?.subscriptionStatus !== undefined
                ? editUser?.subscriptionStatus.toString()
                : ''
            }
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
    </CContainer>
  )
}

export default Provider
