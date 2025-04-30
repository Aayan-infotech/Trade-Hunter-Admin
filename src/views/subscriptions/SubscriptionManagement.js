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
  const token = localStorage.getItem('token')
  const commonConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  }

  const [subscriptions, setSubscriptions] = useState([])
  const [loading, setLoading] = useState(false)

  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showAddTypeModal, setShowAddTypeModal] = useState(false)

  const [newTitle, setNewTitle] = useState('')
  const [newAmount, setNewAmount] = useState('')
  const [newValidity, setNewValidity] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [newType, setNewType] = useState('')
  const [newKmRadius, setNewKmRadius] = useState('')
  const [newLeadCount, setNewLeadCount] = useState('')

  const [editSubscription, setEditSubscription] = useState(null)
  const [viewSubscription, setViewSubscription] = useState(null)

  const [newSubscriptionType, setNewSubscriptionType] = useState('')
  const [subscriptionTypes, setSubscriptionTypes] = useState([])

  useEffect(() => {
    fetchSubscriptions()
    fetchSubscriptionTypes()
  }, [])

  const fetchSubscriptions = async () => {
    setLoading(true)
    try {
      const res = await axios.get(
        'http://3.223.253.106:7787/api/SubscriptionNew/subscription-plans',
        commonConfig
      )
      setSubscriptions(res.data.data || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const fetchSubscriptionTypes = async () => {
    try {
      const res = await axios.get(
        'http://3.223.253.106:7787/api/SubscriptionNew/subscription-type',
        commonConfig
      )
      setSubscriptionTypes(res.data.data || res.data)
    } catch (e) {
      console.error(e)
    }
  }

  const selectedNewTypeName = subscriptionTypes.find(t => t._id === newType)?.type
  const isNewPayPerLead = selectedNewTypeName === 'Pay Per Lead'

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
      leadCount: isNewPayPerLead ? Number(newLeadCount) : 0,
    }
    try {
      await axios.post(
        'http://3.223.253.106:7787/api/SubscriptionNew/subscription-plan',
        payload,
        commonConfig
      )
      fetchSubscriptions()
      setShowAddModal(false)
      setNewTitle('')
      setNewAmount('')
      setNewValidity('')
      setNewDescription('')
      setNewKmRadius('')
      setNewType('')
      setNewLeadCount('')
    } catch (e) {
      console.error(e)
    }
  }

  const handleEditSubscription = sub => {
    setEditSubscription(sub)
    setShowEditModal(true)
  }

  const handleSaveEditSubscription = async () => {
    const updated = {
      ...editSubscription,
      leadCount:
        subscriptionTypes.find(t => t._id === editSubscription.type)?.type === 'Pay Per Lead'
          ? Number(editSubscription.leadCount)
          : 0,
    }
    try {
      await axios.put(
        `http://3.223.253.106:7787/api/SubscriptionNew/subscription-plan/${editSubscription._id}`,
        updated,
        commonConfig
      )
      fetchSubscriptions()
      setShowEditModal(false)
      setEditSubscription(null)
    } catch (e) {
      console.error(e)
    }
  }

  const handleDeleteSubscription = async id => {
    if (window.confirm('Delete Subscription?')) {
      try {
        await axios.delete(
          `http://3.223.253.106:7787/api/SubscriptionNew/subscription-plan/${id}`,
          commonConfig
        )
        fetchSubscriptions()
      } catch (e) {
        console.error(e)
      }
    }
  }

  const handleViewSubscription = sub => {
    setViewSubscription(sub)
    setShowViewModal(true)
  }

  const handleAddSubscriptionType = async () => {
    try {
      await axios.post(
        'http://3.223.253.106:7787/api/SubscriptionNew/subscription-type',
        { type: newSubscriptionType },
        commonConfig
      )
      setShowAddTypeModal(false)
      setNewSubscriptionType('')
      fetchSubscriptionTypes()
    } catch (e) {
      console.error(e)
    }
  }

  const handleDeleteSubscriptionType = async id => {
    if (window.confirm('Are you sure you want to delete this subscription type?')) {
      try {
        await axios.delete(
          `http://3.223.253.106:7787/api/SubscriptionNew/subscription-type/${id}`,
          commonConfig
        )
        fetchSubscriptionTypes()
      } catch (e) {
        console.error(e)
      }
    }
  }

  const groupedSubscriptions = subscriptions.reduce((acc, sub) => {
    acc[sub.type] = acc[sub.type] || []
    acc[sub.type].push(sub)
    return acc
  }, {})

  return (
    <CContainer style={{ maxHeight: '100vh', overflowY: 'auto' }}>
      <CCard>
        <CCardHeader className="service-card-header d-flex justify-content-between align-items-center">
          <CButton color="primary" onClick={() => setShowAddTypeModal(true)}>
            <CIcon icon={cilPlus} /> Add Subscription Type
          </CButton>
          <h4>Subscription Management</h4>
          <CButton color="primary" onClick={() => setShowAddModal(true)}>
            <CIcon icon={cilPlus} /> Add Subscription
          </CButton>
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
                {Object.keys(groupedSubscriptions).map(type =>
                  groupedSubscriptions[type].map((sub, i) => (
                    <CTableRow key={sub._id || i}>
                      {i === 0 && (
                        <CTableDataCell rowSpan={groupedSubscriptions[type].length}>
                          {type}
                        </CTableDataCell>
                      )}
                      <CTableDataCell>{sub.planName}</CTableDataCell>
                      <CTableDataCell>{sub.amount}</CTableDataCell>
                      <CTableDataCell>{sub.validity}</CTableDataCell>
                      <CTableDataCell>
                        <div dangerouslySetInnerHTML={{ __html: sub.description }} />
                      </CTableDataCell>
                      <CTableDataCell>{sub.kmRadius}</CTableDataCell>
                      <CTableDataCell>
                        <CIcon
                          icon={cilViewColumn}
                          size="lg"
                          onClick={() => handleViewSubscription(sub)}
                          style={{ cursor: 'pointer' }}
                        />
                        <CIcon
                          icon={cilPencil}
                          size="lg"
                          className="mx-2"
                          onClick={() => handleEditSubscription(sub)}
                          style={{ cursor: 'pointer' }}
                        />
                        <CIcon
                          icon={cilTrash}
                          size="lg"
                          onClick={() => handleDeleteSubscription(sub._id)}
                          style={{ cursor: 'pointer' }}
                        />
                      </CTableDataCell>
                    </CTableRow>
                  ))
                )}
              </CTableBody>
            </CTable>
          )}
        </CCardBody>
      </CCard>

      <CModal scrollable visible={showAddModal} onClose={() => setShowAddModal(false)}>
        <CModalHeader className="service-card-header">
          <CModalTitle>Add Subscription</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CFormSelect
            label="Subscription Type"
            value={newType}
            onChange={e => setNewType(e.target.value)}
            className="mb-2"
            required
          >
            <option value="">Select a Subscription Type</option>
            {subscriptionTypes.map(t => (
              <option key={t._id} value={t._id}>{t.type}</option>
            ))}
          </CFormSelect>
          <CFormInput
            label="Plan Name"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            className="mb-2"
            required
          />
          <CFormInput
            label="Amount"
            type="number"
            value={newAmount}
            onChange={e => setNewAmount(e.target.value)}
            className="mb-2"
            required
          />
          <CFormInput
            label="Validity (days)"
            type="number"
            value={newValidity}
            onChange={e => setNewValidity(e.target.value)}
            className="mb-2"
            required
          />
          <label>Description</label>
          <ReactQuill
            value={newDescription}
            onChange={setNewDescription}
            className="mb-2"
          />
          <CFormInput
            label="KM Radius"
            type="number"
            value={newKmRadius}
            onChange={e => setNewKmRadius(e.target.value)}
            className="mb-2"
          />
          {isNewPayPerLead && (
            <CFormInput
              label="Lead Count"
              type="number"
              value={newLeadCount}
              onChange={e => setNewLeadCount(e.target.value)}
              className="mb-2"
            />
          )}
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
                onChange={e => setEditSubscription({ ...editSubscription, type: e.target.value })}
                className="mb-2"
                required
              >
                <option value="">Select a Subscription Type</option>
                {subscriptionTypes.map(t => (
                  <option key={t._id} value={t._id}>{t.type}</option>
                ))}
              </CFormSelect>
              <CFormInput
                label="Plan Name"
                value={editSubscription.planName}
                onChange={e => setEditSubscription({ ...editSubscription, planName: e.target.value })}
                className="mb-2"
              />
              <CFormInput
                label="Amount"
                type="number"
                value={editSubscription.amount}
                onChange={e => setEditSubscription({ ...editSubscription, amount: Number(e.target.value) })}
                className="mb-2"
              />
              <CFormInput
                label="Validity (days)"
                type="number"
                value={editSubscription.validity}
                onChange={e => setEditSubscription({ ...editSubscription, validity: Number(e.target.value) })}
                className="mb-2"
              />
              <label>Description</label>
              <ReactQuill
                value={editSubscription.description}
                onChange={value => setEditSubscription({ ...editSubscription, description: value })}
                className="mb-2"
              />
              <CFormInput
                label="KM Radius"
                type="number"
                value={editSubscription.kmRadius}
                onChange={e => setEditSubscription({ ...editSubscription, kmRadius: Number(e.target.value) })}
                className="mb-2"
              />
              {subscriptionTypes.find(t => t._id === editSubscription.type)?.type === 'Pay Per Lead' && (
                <CFormInput
                  label="Lead Count"
                  type="number"
                  value={editSubscription.leadCount || ''}
                  onChange={e => setEditSubscription({ ...editSubscription, leadCount: Number(e.target.value) })}
                  className="mb-2"
                />
              )}
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

      <CModal scrollable visible={showViewModal} onClose={() => setShowViewModal(false)}>
        <CModalHeader className="service-card-header">
          <CModalTitle>Subscription Details</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {viewSubscription && (
            <CListGroup>
              <CListGroupItem><strong>Plan Name: </strong>{viewSubscription.planName}</CListGroupItem>
              <CListGroupItem><strong>Amount: </strong>{viewSubscription.amount}</CListGroupItem>
              <CListGroupItem><strong>Validity (days): </strong>{viewSubscription.validity}</CListGroupItem>
              <CListGroupItem>
                <strong>Description: </strong>
                <div dangerouslySetInnerHTML={{ __html: viewSubscription.description }} />
              </CListGroupItem>
              <CListGroupItem><strong>Radius: </strong>{viewSubscription.kmRadius}</CListGroupItem>
              <CListGroupItem><strong>Subscription Type: </strong>{viewSubscription.type}</CListGroupItem>
              {subscriptionTypes.find(t => t._id === viewSubscription.type)?.type === 'Pay Per Lead' && (
                <CListGroupItem><strong>Lead Count: </strong>{viewSubscription.leadCount}</CListGroupItem>
              )}
            </CListGroup>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowViewModal(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>

      <CModal scrollable visible={showAddTypeModal} onClose={() => setShowAddTypeModal(false)}>
        <CModalHeader className="service-card-header">
          <CModalTitle>Add Subscription Type</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CFormInput
            label="Subscription Type"
            value={newSubscriptionType}
            onChange={e => setNewSubscriptionType(e.target.value)}
            className="mb-2"
          />
          <CListGroup>
            {subscriptionTypes.map(t => (
              <CListGroupItem key={t._id} className="d-flex justify-content-between align-items-center">
                <span>{t.type}</span>
                <CIcon
                  icon={cilTrash}
                  className="text-danger"
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleDeleteSubscriptionType(t._id)}
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
