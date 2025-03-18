import React, { useState, useEffect } from 'react'
import {
  CContainer,
  CRow,
  CCol,
  CCard,
  CCardHeader,
  CCardBody,
  CForm,
  CFormInput,
  CFormLabel,
  CButton,
  CTable,
  CTableHead,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
} from '@coreui/react'
import { FaTicketAlt } from 'react-icons/fa'
import CIcon from '@coreui/icons-react'
import { cilTrash, cilPencil } from '@coreui/icons'
import '../Users/Usermanagement.css'

const API_CREATE = "http://54.236.98.193:7777/api/voucher/create"
const API_GET = "http://54.236.98.193:7777/api/voucher"
const API_DELETE = "http://54.236.98.193:7777/api/voucher" // DELETE: /:id
const API_UPDATE = "http://54.236.98.193:7777/api/voucher/update" // PUT: /:id

const CreateVoucher = () => {
  // Create voucher state
  const [code, setCode] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [usageLimit, setUsageLimit] = useState('')
  const [vouchers, setVouchers] = useState([])
  const [loading, setLoading] = useState(false)

  // Edit voucher state
  const [showEditModal, setShowEditModal] = useState(false)
  const [editVoucher, setEditVoucher] = useState(null)

  // Handler for create voucher code change
  const handleCodeChange = (e) => {
    setCode(e.target.value.toUpperCase())
  }

  // Create voucher submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const data = { code, startDate, endDate, usageLimit: Number(usageLimit) }
    try {
      await fetch(API_CREATE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      fetchVouchers()
      setCode('')
      setStartDate('')
      setEndDate('')
      setUsageLimit('')
    } catch (error) {
      console.error("Error creating voucher:", error)
    }
    setLoading(false)
  }

  // Fetch vouchers from API
  const fetchVouchers = async () => {
    try {
      const res = await fetch(API_GET)
      const result = await res.json()
      setVouchers(result.data || [])
    } catch (error) {
      console.error("Error fetching vouchers:", error)
    }
  }

  // Delete voucher by id
  const handleDeleteVoucher = async (id) => {
    if (window.confirm("Are you sure you want to delete this voucher?")) {
      try {
        await fetch(`${API_DELETE}/${id}`, {
          method: 'DELETE'
        })
        fetchVouchers()
      } catch (error) {
        console.error("Error deleting voucher:", error)
      }
    }
  }

  // Open edit modal and prefill with voucher details
  const openEditModal = (voucher) => {
    setEditVoucher({ ...voucher })
    setShowEditModal(true)
  }

  // Update editVoucher state when a field changes
  const handleEditChange = (field, value) => {
    setEditVoucher(prev => ({ ...prev, [field]: value }))
  }

  // Save changes for edited voucher using PUT API
  const handleSaveEditVoucher = async () => {
    if (!editVoucher) return
    try {
      const res = await fetch(`${API_UPDATE}/${editVoucher._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: editVoucher.code,
          startDate: editVoucher.startDate,
          endDate: editVoucher.endDate,
          usageLimit: Number(editVoucher.usageLimit),
        }),
      })
      const result = await res.json()
      console.log("Update result:", result)
      fetchVouchers()
      setShowEditModal(false)
      setEditVoucher(null)
    } catch (error) {
      console.error("Error updating voucher:", error)
    }
  }

  // Format timestamp to only show date (locale string)
  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString()
  }

  useEffect(() => {
    fetchVouchers()
  }, [])

  return (
    <>
      <CContainer fluid className="d-flex align-items-center justify-content-center mt-5">
        <CCard className="voucher-card shadow" style={{ maxWidth: '600px' }}>
          <CCardHeader className="voucher-card-header text-center">
            <FaTicketAlt size={30} className="mr-2" />
            Create Voucher
          </CCardHeader>
          <CCardBody>
            <CForm onSubmit={handleSubmit}>
              <CRow className="mb-3">
                <CCol md={12}>
                  <CFormLabel htmlFor="voucherCode">Voucher Code</CFormLabel>
                  <CFormInput
                    type="text"
                    id="voucherCode"
                    value={code}
                    onChange={handleCodeChange}
                    placeholder="ENTER VOUCHER CODE"
                    required
                    style={{ textTransform: "uppercase", letterSpacing: "1px" }}
                  />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol md={6}>
                  <CFormLabel htmlFor="startDate">Valid From</CFormLabel>
                  <CFormInput
                    type="date"
                    id="startDate"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                  />
                </CCol>
                <CCol md={6}>
                  <CFormLabel htmlFor="endDate">Valid To</CFormLabel>
                  <CFormInput
                    type="date"
                    id="endDate"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                  />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol md={12}>
                  <CFormLabel htmlFor="usageLimit">Usage Limit</CFormLabel>
                  <CFormInput
                    type="number"
                    id="usageLimit"
                    value={usageLimit}
                    onChange={(e) => setUsageLimit(e.target.value)}
                    placeholder="Enter usage limit"
                    required
                  />
                </CCol>
              </CRow>
              <div className="text-center mb-3">
                <CButton type="submit" color="primary" disabled={loading}>
                  {loading ? "Creating..." : "Create Voucher"}
                </CButton>
              </div>
            </CForm>
          </CCardBody>
        </CCard>
      </CContainer>
      
      <CContainer fluid className="mt-5">
        <div className="vouchers-table-section">
          <CTable>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Voucher Code</CTableHeaderCell>
                <CTableHeaderCell>Valid From</CTableHeaderCell>
                <CTableHeaderCell>Valid To</CTableHeaderCell>
                <CTableHeaderCell>Usage Limit</CTableHeaderCell>
                <CTableHeaderCell>Used Count</CTableHeaderCell>
                <CTableHeaderCell>Actions</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {vouchers && vouchers.length > 0 ? (
                vouchers.map((voucher) => (
                  <CTableRow key={voucher._id}>
                    <CTableDataCell>{voucher.code}</CTableDataCell>
                    <CTableDataCell>{formatDate(voucher.startDate)}</CTableDataCell>
                    <CTableDataCell>{formatDate(voucher.endDate)}</CTableDataCell>
                    <CTableDataCell>{voucher.usageLimit}</CTableDataCell>
                    <CTableDataCell>{voucher.usedCount}</CTableDataCell>
                    <CTableDataCell>
                      <CIcon
                        icon={cilPencil}
                        size="lg"
                        className="text-success me-2"
                        style={{ cursor: 'pointer' }}
                        onClick={() => openEditModal(voucher)}
                      />
                      <CIcon
                        icon={cilTrash}
                        size="lg"
                        className="text-danger"
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleDeleteVoucher(voucher._id)}
                      />
                    </CTableDataCell>
                  </CTableRow>
                ))
              ) : (
                <CTableRow>
                  <CTableDataCell colSpan="6" className="text-center">
                    No vouchers available
                  </CTableDataCell>
                </CTableRow>
              )}
            </CTableBody>
          </CTable>
        </div>
      </CContainer>

      {/* Edit Voucher Modal */}
      {showEditModal && editVoucher && (
        <CModal scrollable visible={showEditModal} onClose={() => { setShowEditModal(false); setEditVoucher(null) }}>
          <CModalHeader className="voucher-card-header text-center">
            <CModalTitle>Edit Voucher</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CForm>
              <CRow className="mb-3">
                <CCol md={12}>
                  <CFormLabel htmlFor="editVoucherCode">Voucher Code</CFormLabel>
                  <CFormInput
                    type="text"
                    id="editVoucherCode"
                    value={editVoucher.code}
                    onChange={(e) => handleEditChange('code', e.target.value.toUpperCase())}
                    required
                    style={{ textTransform: "uppercase", letterSpacing: "1px" }}
                  />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol md={6}>
                  <CFormLabel htmlFor="editStartDate">Valid From</CFormLabel>
                  <CFormInput
                    type="date"
                    id="editStartDate"
                    value={editVoucher.startDate}
                    onChange={(e) => handleEditChange('startDate', e.target.value)}
                    required
                  />
                </CCol>
                <CCol md={6}>
                  <CFormLabel htmlFor="editEndDate">Valid To</CFormLabel>
                  <CFormInput
                    type="date"
                    id="editEndDate"
                    value={editVoucher.endDate}
                    onChange={(e) => handleEditChange('endDate', e.target.value)}
                    required
                  />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol md={12}>
                  <CFormLabel htmlFor="editUsageLimit">Usage Limit</CFormLabel>
                  <CFormInput
                    type="number"
                    id="editUsageLimit"
                    value={editVoucher.usageLimit}
                    onChange={(e) => handleEditChange('usageLimit', e.target.value)}
                    required
                  />
                </CCol>
              </CRow>
            </CForm>
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => { setShowEditModal(false); setEditVoucher(null) }}>
              Cancel
            </CButton>
            <CButton color="primary" onClick={handleSaveEditVoucher}>
              Save Changes
            </CButton>
          </CModalFooter>
        </CModal>
      )}
    </>
  )
}

export default CreateVoucher
