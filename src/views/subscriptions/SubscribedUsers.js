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
  CFormInput,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CRow,
  CCol,
  CInputGroup,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilViewColumn, cilSearch } from '@coreui/icons'
import '../Users/Usermanagement.css'

const SubscriptionUsersManagement = () => {
  const [subscriptionUsers, setSubscriptionUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [viewSubscription, setViewSubscription] = useState(null)
  const [showViewModal, setShowViewModal] = useState(false)

  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [search, setSearch] = useState('')
  const [hasMore, setHasMore] = useState(false)

  const token = localStorage.getItem('token')
  const commonConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  }

  useEffect(() => {
    fetchSubscriptionUsers()
  }, [page, search])

  const fetchSubscriptionUsers = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await axios.get(
        `http://18.209.91.97:7787/api/SubscriptionNew/subscription-users`,
        {
          ...commonConfig,
          params: { search, page, limit },
        },
      )
      const data = res.data.data || []
      setSubscriptionUsers(data)
      setHasMore(data.length === limit)
    } catch (err) {
      console.error('Error fetching subscription users:', err)
      setError('Failed to load. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleViewSubscription = (subscription) => {
    setViewSubscription(subscription)
    setShowViewModal(true)
  }

  const formatDateToAEST = (dateString) =>
    new Date(dateString).toLocaleString('en-AU', {
      timeZone: 'Australia/Sydney',
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })

  return (
    <CContainer>
      <CCard>
        <CCardHeader className="service-card-header position-sticky top-0">
          <CRow className="align-items-center w-100">
            <CCol className="text-start">
              <h4>Subscribed Users</h4>
            </CCol>
            <CCol className="d-flex justify-content-end">
              <CInputGroup size="md" style={{ width: '360px' }}>
                <CFormInput
                  placeholder="Search by business name..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value)
                    setPage(1)
                  }}
                  style={{ height: '45px', fontSize: '1rem' }}
                />
                <CButton
                  color="primary"
                  size="md"
                  style={{ height: '45px', fontSize: '1.1rem' }}
                  onClick={fetchSubscriptionUsers}
                  title="Search"
                >
                  <CIcon icon={cilSearch} size="lg" />
                </CButton>
              </CInputGroup>
            </CCol>
          </CRow>
        </CCardHeader>

        <CCardBody style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {error && <p className="text-danger">{error}</p>}

          {loading ? (
            <div>Loading...</div>
          ) : subscriptionUsers.length > 0 ? (
            <CTable hover responsive>
              <CTableHead className="sticky-header">
                <CTableRow>
                  <CTableHeaderCell>Business Name</CTableHeaderCell>
                  <CTableHeaderCell>Email</CTableHeaderCell>
                  <CTableHeaderCell>Subscription Type</CTableHeaderCell>
                  <CTableHeaderCell>Plan Name</CTableHeaderCell>
                  <CTableHeaderCell>$</CTableHeaderCell>
                  <CTableHeaderCell>Start Date</CTableHeaderCell>
                  <CTableHeaderCell>End Date</CTableHeaderCell>
                  <CTableHeaderCell>Km Radius</CTableHeaderCell>
                  <CTableHeaderCell>Action</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {subscriptionUsers.map((sub) => (
                  <CTableRow key={sub._id}>
                    <CTableDataCell>{sub.userId?.businessName || 'User Deleted'}</CTableDataCell>
                    <CTableDataCell>{sub.userId?.email || 'User Deleted'}</CTableDataCell>
                    <CTableDataCell>{sub.subscriptionPlanId?.type?.type || 'N/A'}</CTableDataCell>
                    <CTableDataCell>{sub.subscriptionPlanId?.planName || 'N/A'}</CTableDataCell>
                    <CTableDataCell>${sub.subscriptionPlanId?.amount ?? '0.00'}</CTableDataCell>
                    <CTableDataCell>{formatDateToAEST(sub.startDate)}</CTableDataCell>
                    <CTableDataCell>{formatDateToAEST(sub.endDate)}</CTableDataCell>
                    <CTableDataCell>{sub.kmRadius || 'N/A'}</CTableDataCell>
                    <CTableDataCell>
                      <CIcon
                        className="me-2 text-primary cursor-pointer"
                        title="View Details"
                        onClick={() => handleViewSubscription(sub)}
                        icon={cilViewColumn}
                        size="lg"
                      />
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          ) : (
            <p className="text-center mt-4">No subscribed users found for “{search}”.</p>
          )}
        </CCardBody>

        <div className="d-flex justify-content-between align-items-center p-3">
          <CButton
            color="secondary"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </CButton>
          <span>Page {page}</span>
          <CButton
            color="secondary"
            size="sm"
            disabled={!hasMore}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </CButton>
        </div>
      </CCard>

      <CModal visible={showViewModal} onClose={() => setShowViewModal(false)}>
        <CModalHeader className="service-card-header">
          <CModalTitle>Subscription Details</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {viewSubscription && (
            <>
              <p>
                <strong>Business Name:</strong> {viewSubscription.userId?.businessName || 'N/A'}
              </p>
              <p>
                <strong>Email:</strong> {viewSubscription.userId?.email || 'N/A'}
              </p>
              <p>
                <strong>Subscription Type:</strong>{' '}
                {viewSubscription.subscriptionPlanId?.type?.type || 'N/A'}
              </p>
              <p>
                <strong>Plan Name:</strong> {viewSubscription.subscriptionPlanId?.planName || 'N/A'}
              </p>
              <p>
                <strong>Amount:</strong> ${viewSubscription.subscriptionPlanId?.amount || '0.00'}
              </p>
              <p>
                <strong>Start Date:</strong> {formatDateToAEST(viewSubscription.startDate)}
              </p>
              <p>
                <strong>End Date:</strong> {formatDateToAEST(viewSubscription.endDate)}
              </p>
              <p>
                <strong>Km Radius:</strong> {viewSubscription.kmRadius || 'N/A'}
              </p>
            </>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowViewModal(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>
    </CContainer>
  )
}

export default SubscriptionUsersManagement
