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
  CForm,
  CFormInput,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilTrash, cilPencil, cilViewColumn, cilPlus } from '@coreui/icons';

const API_URL = 'http://54.236.98.193:7777/api/service/getAllServices';

const ServiceManagement = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newServiceName, setNewServiceName] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editService, setEditService] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewService, setViewService] = useState(null);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL);
      setServices(response.data.data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleAddService = async () => {
    if (!newServiceName.trim()) {
      alert('Please enter a service name.');
      return;
    }
    try {
      await axios.post('http://54.236.98.193:7777/api/service/createService', { name: newServiceName });
      fetchServices();
      setShowAddModal(false);
      setNewServiceName('');
    } catch (error) {
      console.error('Error adding service:', error);
    }
  };

  const handleEditService = (service) => {
    setEditService({ ...service });
    setShowEditModal(true);
  };

  const handleSaveEditService = async () => {
    try {
      await axios.put(`http://54.236.98.193:7777/api/service/editService/${editService._id}`, { name: editService.name });
      fetchServices();
      setShowEditModal(false);
      setEditService(null);
    } catch (error) {
      console.error('Error editing service:', error);
    }
  };

  const handleDeleteService = async (serviceId) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await axios.delete(`http://54.236.98.193:7777/api/service/delete/${serviceId}`);
        fetchServices();
      } catch (error) {
        console.error('Error deleting service:', error);
      }
    }
  };

  const handleViewService = (service) => {
    setViewService(service);
    setShowViewModal(true);
  };

  return (
    <CContainer>
      <CCard>
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <h4>Services Management</h4>
          <CButton color="primary" onClick={() => setShowAddModal(true)}>
            <CIcon icon={cilPlus} /> Add Service
          </CButton>
        </CCardHeader>
        <CCardBody>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <CTable hover responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Service Name</CTableHeaderCell>
                  <CTableHeaderCell>Actions</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {services.map((service, index) => (
                  <CTableRow key={service._id || index}>
                    <CTableDataCell style={{ textAlign: 'left' }}>
                      {service.name}
                    </CTableDataCell>
                    <CTableDataCell style={{ display: 'flex', alignItems: 'center' }}>
                      <CIcon className="fw-bold text-success me-2" onClick={() => handleViewService(service)} icon={cilViewColumn} size="lg" />
                      <CIcon className="fw-bold text-success me-2" onClick={() => handleEditService(service)} icon={cilPencil} size="lg" />
                      <CIcon className="text-danger" onClick={() => handleDeleteService(service._id)} icon={cilTrash} size="lg" />
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          )}
        </CCardBody>
      </CCard>

      <CModal scrollable visible={showAddModal} onClose={() => setShowAddModal(false)}>
        <CModalHeader>
          <CModalTitle>Add Service</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CFormInput
              placeholder="Enter service name"
              value={newServiceName}
              onChange={(e) => setNewServiceName(e.target.value)}
              className="mb-2"
            />
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowAddModal(false)}>Cancel</CButton>
          <CButton color="primary" onClick={handleAddService}>Save Service</CButton>
        </CModalFooter>
      </CModal>

      <CModal scrollable visible={showViewModal} onClose={() => setShowViewModal(false)}>
        <CModalHeader>
          <CModalTitle>Service Details</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <p><strong>Service Name:</strong> {viewService?.name}</p>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowViewModal(false)}>Close</CButton>
        </CModalFooter>
      </CModal>

      <CModal scrollable visible={showEditModal} onClose={() => setShowEditModal(false)}>
        <CModalHeader>
          <CModalTitle>Edit Service</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {editService && (
            <CFormInput
              placeholder="Edit service name"
              value={editService.name}
              onChange={(e) => setEditService({ ...editService, name: e.target.value })}
              className="mb-2"
            />
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowEditModal(false)}>Cancel</CButton>
          <CButton color="primary" onClick={handleSaveEditService}>Save Changes</CButton>
        </CModalFooter>
      </CModal>
    </CContainer>
  );
};

export default ServiceManagement;
