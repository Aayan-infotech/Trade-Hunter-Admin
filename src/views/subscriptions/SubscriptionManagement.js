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
  CFormSelect,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CListGroup,
  CListGroupItem,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPlus, cilPencil, cilTrash, cilViewColumn } from '@coreui/icons'
import '../Users/Usermanagement.css'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

const SubscriptionManagement = () => {
  const [subscriptions, setSubscriptions] = useState([])
  const [loading, setLoading] = useState(false)

  // Modal visibility states
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showAddTypeModal, setShowAddTypeModal] = useState(false)

  // State for Add Subscription Modal fields
  const [newTitle, setNewTitle] = useState('')
  const [newAmount, setNewAmount] = useState('')
  const [newValidity, setNewValidity] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [newType, setNewType] = useState('')
  const [newKmRadius, setNewKmRadius] = useState('')

  // State for Edit Subscription Modal
  const [editSubscription, setEditSubscription] = useState(null)
  // State for View Subscription Modal
  const [viewSubscription, setViewSubscription] = useState(null)

  // State for Add Subscription Type Modal
  const [newSubscriptionType, setNewSubscriptionType] = useState('')

  // State to hold available subscription types for the dropdown and modal list
  const [subscriptionTypes, setSubscriptionTypes] = useState([])

  // Fetch subscriptions from new API endpoint
  const fetchSubscriptions = async () => {
    setLoading(true)
    try {
      const response = await axios.get(
        'http://3.223.253.106:7777/api/SubscriptionNew/subscription-plans',
      )
      setSubscriptions(response.data.data || [])
    } catch (error) {
      console.error('Error fetching subscriptions:', error)
    } finally {
      setLoading(false)
    }
  }

  // Fetch subscription types for the dropdown and modal list
  const fetchSubscriptionTypes = async () => {
    try {
      const response = await axios.get(
        'http://3.223.253.106:7777/api/SubscriptionNew/subscription-type',
      )
      setSubscriptionTypes(response.data.data || response.data)
    } catch (error) {
      console.error('Error fetching subscription types:', error)
    }
  }

  useEffect(() => {
    fetchSubscriptions()
    fetchSubscriptionTypes()
  }, [])

  const handleAddSubscription = async () => {
    if (!newTitle || !newAmount || !newValidity || !newType) {
      alert('Please fill in all required fields.')
      return
    }

    const payload = {
      planName: newTitle,
      amount: Number(newAmount),
      validity: Number(newValidity),
      description: newDescription,
      kmRadius: Number(newKmRadius || 0),
      type: newType,
    }

    try {
      await axios.post('http://3.223.253.106:7777/api/SubscriptionNew/subscription-plan', payload)
      fetchSubscriptions()
      setShowAddModal(false)
      setNewTitle('')
      setNewAmount('')
      setNewValidity('')
      setNewDescription('')
      setNewKmRadius('')
      setNewType('')
    } catch (error) {
      console.error('Error adding subscription plan:', error)
    }
  }

  const handleEditSubscription = (subscription) => {
    setEditSubscription(subscription)
    setShowEditModal(true)
  }

  const handleSaveEditSubscription = async () => {
    try {
      await axios.put(
        `http://3.223.253.106:7777/api/SubscriptionNew/subscription-plan/${editSubscription._id}`,
        editSubscription,
      )
      fetchSubscriptions()
      setShowEditModal(false)
      setEditSubscription(null)
    } catch (error) {
      console.error('Error editing subscription:', error)
    }
  }

  const handleDeleteSubscription = async (subscriptionId) => {
    if (window.confirm('Delete Subscription?')) {
      try {
        await axios.delete(
          `http://3.223.253.106:7777/api/SubscriptionNew/subscription-plan/${subscriptionId}`,
        )
        fetchSubscriptions()
      } catch (error) {
        console.error('Error deleting subscription:', error)
      }
    }
  }

  const handleViewSubscription = (subscription) => {
    setViewSubscription(subscription)
    setShowViewModal(true)
  }

  const handleAddSubscriptionType = async () => {
    const payload = {
      type: newSubscriptionType,
    }
    try {
      await axios.post('http://3.223.253.106:7777/api/SubscriptionNew/subscription-type', payload)
      setShowAddTypeModal(false)
      setNewSubscriptionType('')
      fetchSubscriptionTypes()
    } catch (error) {
      console.error('Error adding subscription type:', error)
    }
  }

  const handleDeleteSubscriptionType = async (id) => {
    if (window.confirm('Are you sure you want to delete this subscription type?')) {
      try {
        await axios.delete(`http://3.223.253.106:7777/api/SubscriptionNew/subscription-type/${id}`)
        fetchSubscriptionTypes()
      } catch (error) {
        console.error('Error deleting subscription type:', error)
      }
    }
  }

  const groupedSubscriptions = subscriptions.reduce((groups, subscription) => {
    const { type } = subscription
    if (!groups[type]) {
      groups[type] = []
    }
    groups[type].push(subscription)
    return groups
  }, {})

  return (
    <CContainer style={{ maxHeight: '100vh', overflowY: 'auto' }}>
      <CCard>
        <CCardHeader className="service-card-header d-flex justify-content-between align-items-center">
          <div>
            <CButton color="primary" className="me-2" onClick={() => setShowAddTypeModal(true)}>
              <CIcon icon={cilPlus} /> Add Subscription Type
            </CButton>
          </div>
          <h4>Subscription Management</h4>
          <div>
            <CButton color="primary" onClick={() => setShowAddModal(true)}>
              <CIcon icon={cilPlus} /> Add Subscription
            </CButton>
          </div>
        </CCardHeader>
        <CCardBody style={{ maxHeight: '65vh', overflowY: 'auto' }}>
          {loading ? (
            <div>Loading subscriptions...</div>
          ) : (
            <CTable hover responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Types</CTableHeaderCell>
                  <CTableHeaderCell>Plan Names</CTableHeaderCell>
                  <CTableHeaderCell>Amount</CTableHeaderCell>
                  <CTableHeaderCell>Validity (days)</CTableHeaderCell>
                  <CTableHeaderCell>Descriptions</CTableHeaderCell>
                  <CTableHeaderCell>Radius</CTableHeaderCell>
                  <CTableHeaderCell>Actions</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {Object.keys(groupedSubscriptions).map((type) => {
                  const group = groupedSubscriptions[type]
                  return group.map((subscription, index) => (
                    <CTableRow key={subscription._id || index}>
                      {index === 0 && (
                        <CTableDataCell rowSpan={group.length} style={{ textAlign: 'left' }}>
                          {type}
                        </CTableDataCell>
                      )}
                      <CTableDataCell style={{ textAlign: 'left' }}>
                        {subscription.planName}
                      </CTableDataCell>
                      <CTableDataCell style={{ textAlign: 'left' }}>
                        {subscription.amount}
                      </CTableDataCell>
                      <CTableDataCell style={{ textAlign: 'left' }}>
                        {subscription.validity}
                      </CTableDataCell>
                      <CTableDataCell style={{ textAlign: 'left' }}>
                        <div
                          style={{ textAlign: 'left' }}
                          dangerouslySetInnerHTML={{ __html: subscription.description }}
                        />
                      </CTableDataCell>
                      <CTableDataCell style={{ textAlign: 'left' }}>
                        {subscription.kmRadius}
                      </CTableDataCell>
                      <CTableDataCell style={{ textAlign: 'left', display: 'flex', alignItems: 'center' }}>
                        <CIcon
                          className="fw-bold text-success me-2"
                          onClick={() => handleViewSubscription(subscription)}
                          icon={cilViewColumn}
                          size="lg"
                          style={{ cursor: 'pointer' }}
                        />
                        <CIcon
                          className="fw-bold text-success me-2"
                          onClick={() => handleEditSubscription(subscription)}
                          icon={cilPencil}
                          size="lg"
                          style={{ cursor: 'pointer' }}
                        />
                        <CIcon
                          className="fw-bold text-danger me-2"
                          onClick={() => handleDeleteSubscription(subscription._id)}
                          icon={cilTrash}
                          size="lg"
                          style={{ cursor: 'pointer' }}
                        />
                      </CTableDataCell>
                    </CTableRow>
                  ))
                })}
              </CTableBody>
            </CTable>
          )}
        </CCardBody>
      </CCard>

      {/* Add Subscription Modal */}
      <CModal scrollable visible={showAddModal} onClose={() => setShowAddModal(false)}>
        <CModalHeader className="service-card-header">
          <CModalTitle>Add Subscription</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {/* Subscription Type Dropdown */}
          <CFormSelect
            label="Subscription Type"
            value={newType}
            onChange={(e) => setNewType(e.target.value)}
            className="mb-2"
            required
          >
            <option value="">Select a Subscription Type</option>
            {subscriptionTypes.map((typeObj) => (
              <option key={typeObj._id} value={typeObj._id}>
                {typeObj.type}
              </option>
            ))}
          </CFormSelect>
          <CFormInput
            label="Plan Name"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="mb-2"
            required
          />
          <CFormInput
            label="Amount"
            type="number"
            value={newAmount}
            onChange={(e) => setNewAmount(e.target.value)}
            className="mb-2"
            required
          />
          <CFormInput
            label="Validity (days)"
            type="number"
            value={newValidity}
            onChange={(e) => setNewValidity(e.target.value)}
            className="mb-2"
            required
          />
          <label>Description</label>
          <ReactQuill value={newDescription} onChange={(value) => setNewDescription(value)} className="mb-2" />
          <CFormInput
            label="KM Radius"
            type="number"
            value={newKmRadius}
            onChange={(e) => setNewKmRadius(e.target.value)}
            className="mb-2"
          />
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowAddModal(false)}>
            Cancel
          </CButton>
          <CButton color="primary" onClick={handleAddSubscription}>
            Add Subscription
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Edit Subscription Modal */}
      <CModal scrollable visible={showEditModal} onClose={() => setShowEditModal(false)}>
        <CModalHeader className="service-card-header">
          <CModalTitle>Edit Subscription</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {editSubscription && (
            <>
              <CFormSelect
                label="Subscription Type"
                value={editSubscription.type}
                onChange={(e) => setEditSubscription({ ...editSubscription, type: e.target.value })}
                className="mb-2"
                required
              >
                <option value="">Select a Subscription Type</option>
                {subscriptionTypes.map((typeObj) => (
                  <option key={typeObj._id} value={typeObj._id}>
                    {typeObj.type}
                  </option>
                ))}
              </CFormSelect>
              <CFormInput
                label="Plan Name"
                value={editSubscription.planName}
                onChange={(e) =>
                  setEditSubscription({ ...editSubscription, planName: e.target.value })
                }
                className="mb-2"
              />
              <CFormInput
                label="Amount"
                type="number"
                value={editSubscription.amount}
                onChange={(e) =>
                  setEditSubscription({ ...editSubscription, amount: Number(e.target.value) })
                }
                className="mb-2"
              />
              <CFormInput
                label="Validity (days)"
                type="number"
                value={editSubscription.validity}
                onChange={(e) =>
                  setEditSubscription({ ...editSubscription, validity: Number(e.target.value) })
                }
                className="mb-2"
              />
              <label>Description</label>
              <ReactQuill
                value={editSubscription.description}
                onChange={(value) =>
                  setEditSubscription({ ...editSubscription, description: value })
                }
                className="mb-2"
              />
              <CFormInput
                label="KM Radius"
                type="number"
                value={editSubscription.kmRadius}
                onChange={(e) =>
                  setEditSubscription({ ...editSubscription, kmRadius: Number(e.target.value) })
                }
                className="mb-2"
              />
            </>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </CButton>
          <CButton color="primary" onClick={handleSaveEditSubscription}>
            Save Changes
          </CButton>
        </CModalFooter>
      </CModal>

      {/* View Subscription Modal */}
      <CModal scrollable visible={showViewModal} onClose={() => setShowViewModal(false)}>
        <CModalHeader className="service-card-header">
          <CModalTitle>Subscription Details</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {viewSubscription && (
            <CListGroup>
              <CListGroupItem style={{ textAlign: 'left' }}>
                <strong>Plan Name: </strong>{viewSubscription.planName}
              </CListGroupItem>
              <CListGroupItem style={{ textAlign: 'left' }}>
                <strong>Amount: </strong>{viewSubscription.amount}
              </CListGroupItem>
              <CListGroupItem style={{ textAlign: 'left' }}>
                <strong>Validity (days): </strong>{viewSubscription.validity}
              </CListGroupItem>
              <CListGroupItem style={{ textAlign: 'left' }}>
                <strong>Description: </strong>
                <div
                  style={{ textAlign: 'left' }}
                  dangerouslySetInnerHTML={{ __html: viewSubscription.description }}
                />
              </CListGroupItem>
              <CListGroupItem style={{ textAlign: 'left' }}>
                <strong>Radius: </strong>{viewSubscription.kmRadius}
              </CListGroupItem>
              <CListGroupItem style={{ textAlign: 'left' }}>
                <strong>Subscription Type: </strong>{viewSubscription.type}
              </CListGroupItem>
            </CListGroup>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowViewModal(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Add Subscription Type Modal */}
      <CModal scrollable visible={showAddTypeModal} onClose={() => setShowAddTypeModal(false)}>
        <CModalHeader className="service-card-header">
          <CModalTitle>Add Subscription Type</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CFormInput
            label="Subscription Type"
            value={newSubscriptionType}
            onChange={(e) => setNewSubscriptionType(e.target.value)}
            className="mb-2"
          />
          {/* List all existing subscription types with a clickable trash icon */}
          <CListGroup>
            {subscriptionTypes.map((typeObj) => (
              <CListGroupItem
                key={typeObj._id}
                className="d-flex justify-content-between align-items-center"
              >
                <span>{typeObj.type}</span>
                <CIcon
                  icon={cilTrash}
                  className="text-danger"
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleDeleteSubscriptionType(typeObj._id)}
                />
              </CListGroupItem>
            ))}
          </CListGroup>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowAddTypeModal(false)}>
            Cancel
          </CButton>
          <CButton color="primary" onClick={handleAddSubscriptionType}>
            Add Type
          </CButton>
        </CModalFooter>
      </CModal>
    </CContainer>
  )
}

export default SubscriptionManagement
