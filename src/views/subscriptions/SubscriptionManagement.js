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
  CListGroup,
  CListGroupItem,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPlus, cilPencil, cilTrash, cilViewColumn } from '@coreui/icons';
import '../Users/Usermanagement.css';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const SubscriptionManagement = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newDescription, setNewDescription] = useState(''); // HTML
  const [newType, setNewType] = useState('advertising');

  const [showEditModal, setShowEditModal] = useState(false);
  const [editSubscription, setEditSubscription] = useState(null);

  const [showViewModal, setShowViewModal] = useState(false);
  const [viewSubscription, setViewSubscription] = useState(null);

  const fetchSubscriptions = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://44.196.64.110:7777/api/subscription/getAllSubscription');
      setSubscriptions(response.data.data || []);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const handleAddSubscription = async () => {
    const payload = {
      title: newTitle,
      amount: Number(newAmount),
      description: newDescription,
      type: newType,
    };
    try {
      await axios.post('http://44.196.64.110:7777/api/subscription/addSubscription', payload);
      fetchSubscriptions();
      setShowAddModal(false);
      setNewTitle('');
      setNewAmount('');
      setNewDescription('');
      setNewType('advertising');
    } catch (error) {
      console.error('Error adding subscription:', error);
    }
  };

  const handleEditSubscription = (subscription) => {
    setEditSubscription(subscription);
    setShowEditModal(true);
  };

  const handleSaveEditSubscription = async () => {
    try {
      await axios.put(
        `http://44.196.64.110:7777/api/subscription/update/${editSubscription._id}`,
        editSubscription
      );
      fetchSubscriptions();
      setShowEditModal(false);
      setEditSubscription(null);
    } catch (error) {
      console.error('Error editing subscription:', error);
    }
  };

  const handleDeleteSubscription = async (subscriptionId) => {
    if (window.confirm('Delete Subscription?')) {
      try {
        await axios.delete(`http://44.196.64.110:7777/api/subscription/delete/${subscriptionId}`);
        fetchSubscriptions();
      } catch (error) {
        console.error('Error deleting subscription:', error);
      }
    }
  };

  const handleViewSubscription = (subscription) => {
    setViewSubscription(subscription);
    setShowViewModal(true);
  };

  const groupedSubscriptions = subscriptions.reduce((groups, subscription) => {
    const { type } = subscription;
    if (!groups[type]) {
      groups[type] = [];
    }
    groups[type].push(subscription);
    return groups;
  }, {});

  return (
    <CContainer style={{ maxHeight: '100vh', overflowY: 'auto' }}>
      <CCard>
        <CCardHeader className="d-flex justify-content-between align-items-center">
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
                  <CTableHeaderCell>Type</CTableHeaderCell>
                  <CTableHeaderCell>Plan Name</CTableHeaderCell>
                  <CTableHeaderCell>Amount</CTableHeaderCell>
                  <CTableHeaderCell>Description</CTableHeaderCell>
                  <CTableHeaderCell>Actions</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {Object.keys(groupedSubscriptions).map((type) => {
                  const group = groupedSubscriptions[type];
                  return group.map((subscription, index) => (
                    <CTableRow key={subscription._id || index}>
                      {index === 0 && (
                        <CTableDataCell rowSpan={group.length}>
                          {type}
                        </CTableDataCell>
                      )}
                      <CTableDataCell>{subscription.title}</CTableDataCell>
                      <CTableDataCell>{subscription.amount}</CTableDataCell>
                      <CTableDataCell>
                        <div dangerouslySetInnerHTML={{ __html: subscription.description }} />
                      </CTableDataCell>
                      <CTableDataCell style={{ display: 'flex', alignItems: 'center' }}>
                        <CIcon
                          className="fw-bold text-success me-2"
                          onClick={() => handleViewSubscription(subscription)}
                          icon={cilViewColumn}
                          size="lg"
                        />
                        <CIcon
                          className="fw-bold text-success me-2"
                          onClick={() => handleEditSubscription(subscription)}
                          icon={cilPencil}
                          size="lg"
                        />
                        <CIcon
                          className="fw-bold text-danger me-2"
                          onClick={() => handleDeleteSubscription(subscription._id)}
                          icon={cilTrash}
                          size="lg"
                        />
                      </CTableDataCell>
                    </CTableRow>
                  ));
                })}
              </CTableBody>
            </CTable>
          )}
        </CCardBody>
      </CCard>

      <CModal scrollable visible={showAddModal} onClose={() => setShowAddModal(false)}>
        <CModalHeader>
          <CModalTitle>Add Subscription</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CFormInput
            label="Plan Name"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="mb-2"
          />
          <CFormInput
            label="Amount"
            type="number"
            value={newAmount}
            onChange={(e) => setNewAmount(e.target.value)}
            className="mb-2"
          />
          <label>Description</label>
          <ReactQuill
            value={newDescription}
            onChange={(value) => setNewDescription(value)}
            className="mb-2"
          />
          <CFormSelect
            label="Type"
            value={newType}
            onChange={(e) => setNewType(e.target.value)}
            className="mb-2"
          >
            <option value="advertising">Advertising</option>
            <option value="pay per load">Pay Per Lead</option>
            <option value="subscription">Subscription</option>
          </CFormSelect>
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
        <CModalHeader>
          <CModalTitle>Edit Subscription</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {editSubscription && (
            <>
              <CFormInput
                label="Title"
                value={editSubscription.title}
                onChange={(e) =>
                  setEditSubscription({ ...editSubscription, title: e.target.value })
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
              <label>Description</label>
              <ReactQuill
                value={editSubscription.description}
                onChange={(value) =>
                  setEditSubscription({ ...editSubscription, description: value })
                }
                className="mb-2"
              />
              <CFormSelect
                label="Type"
                value={editSubscription.type}
                onChange={(e) =>
                  setEditSubscription({ ...editSubscription, type: e.target.value })
                }
                className="mb-2"
              >
                <option value="advertising">Advertising</option>
                <option value="pay per load">Pay Per Lead</option>
                <option value="subscription">Subscription</option>
              </CFormSelect>
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
        <CModalHeader>
          <CModalTitle>Subscription Details</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {viewSubscription && (
            <CListGroup>
              <CListGroupItem>
                <strong>Title: </strong>{viewSubscription.title}
              </CListGroupItem>
              <CListGroupItem>
                <strong>Amount: </strong>{viewSubscription.amount}
              </CListGroupItem>
              <CListGroupItem>
                <strong>Description: </strong>
                <div dangerouslySetInnerHTML={{ __html: viewSubscription.description }} />
              </CListGroupItem>
              <CListGroupItem>
                <strong>Type: </strong>{viewSubscription.type}
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
    </CContainer>
  );
};

export default SubscriptionManagement;
