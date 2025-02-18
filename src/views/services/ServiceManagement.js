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
  CListGroup,
  CListGroupItem,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilTrash, cilPencil, cilViewColumn, cilPlus } from '@coreui/icons';
import '../Users/Usermanagement.css';

const API_URL = 'http://44.196.64.110:7777/api/service/getAllServices';

const ServiceManagement = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newServiceName, setNewServiceName] = useState('');
  const [newServiceItem, setNewServiceItem] = useState('');
  const [newServiceItems, setNewServiceItems] = useState([]);
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

  const addServiceItem = () => {
    if (newServiceItem.trim() !== '') {
      setNewServiceItems([...newServiceItems, newServiceItem.trim()]);
      setNewServiceItem('');
    }
  };

  const removeServiceItem = (index) => {
    setNewServiceItems(newServiceItems.filter((_, i) => i !== index));
  };

  const handleAddService = async () => {
    const payload = { name: newServiceName, services: newServiceItems };
    try {
      await axios.post('http://44.196.64.110:7777/api/service/createService', payload);
      fetchServices();
      setShowAddModal(false);
      setNewServiceName('');
      setNewServiceItems([]);
    } catch (error) {
      console.error('Error adding service:', error);
    }
  };

  const handleEditService = (service) => {
    setEditService(service);
    setShowEditModal(true);
  };

  const handleSaveEditService = async () => {
    try {
      await axios.put(`http://44.196.64.110:7777/api/service/editService/${editService._id}`, editService);
      fetchServices();
      setShowEditModal(false);
      setEditService(null);
    } catch (error) {
      console.error('Error editing service:', error);
    }
  };

  const handleDeleteService = async (serviceId) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      try {
        await axios.delete(`http://44.196.64.110:7777/api/service/delete/${serviceId}`);
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
                  <CTableHeaderCell>Business Type</CTableHeaderCell>
                  <CTableHeaderCell>Services</CTableHeaderCell>
                  <CTableHeaderCell>Actions</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {services.map((service, index) => (
                  <CTableRow key={service._id || index}>
                    <CTableDataCell style={{ textAlign: 'left' }}>{service.name}</CTableDataCell>
                    <CTableDataCell style={{ textAlign: 'left' }}>
                      {service.services.length > 3
                        ? `${service.services.slice(0, 3).join(', ')}...`
                        : service.services.join(', ')}
                    </CTableDataCell>
                    <CTableDataCell style={{ display: 'flex', alignItems: 'center' }}>
                      <CIcon
                        className="fw-bold text-success me-2"
                        onClick={() => handleViewService(service)}
                        icon={cilViewColumn}
                        size="lg"
                      />
                      <CIcon
                        className="fw-bold text-success me-2"
                        onClick={() => handleEditService(service)}
                        icon={cilPencil}
                        size="lg"
                      />
                      <CIcon
                        className="text-danger"
                        onClick={() => handleDeleteService(service._id)}
                        icon={cilTrash}
                        size="lg"
                      />
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          )}
        </CCardBody>
      </CCard>

      <CModal scrollable visible={showAddModal}  className="custom-modal" onClose={() => setShowAddModal(false)}>
        <CModalHeader>
          <CModalTitle>Add Service</CModalTitle>
        </CModalHeader>
        <CModalBody style={{ maxHeight: '60vh', overflowY: 'auto' }}>
          <CForm>
            <CFormInput
              placeholder="Business Type"
              value={newServiceName}
              onChange={(e) => setNewServiceName(e.target.value)}
              className="mb-2"
            />
            <CFormInput
              placeholder="Services"
              value={newServiceItem}
              onChange={(e) => setNewServiceItem(e.target.value)}
              className="mb-2"
            />
            <CButton onClick={addServiceItem} color="secondary" size="sm" className="mb-2">
              Add Service
            </CButton>
            <div>
              {newServiceItems.map((item, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                  <span style={{ marginRight: '10px' }}>{item}</span>
                  <CIcon
                    className="text-danger"
                    icon={cilTrash}
                    size="lg"
                    style={{ cursor: 'pointer' }}
                    onClick={() => removeServiceItem(index)}
                  />
                </div>
              ))}
            </div>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowAddModal(false)}>
            Cancel
          </CButton>
          <CButton color="primary" onClick={handleAddService}>
            Save Service
          </CButton>
        </CModalFooter>
      </CModal>

      <CModal scrollable visible={showViewModal}  className="custom-modal" onClose={() => setShowViewModal(false)}>
        <CModalHeader>
          <CModalTitle>Service Details</CModalTitle>
        </CModalHeader>
        <CModalBody style={{ maxHeight: '60vh', overflowY: 'auto' }}>
          <h5>{viewService?.name}</h5>
          <CListGroup className="mt-2">
            {viewService?.services.map((item, index) => (
              <CListGroupItem key={index}>{item}</CListGroupItem>
            ))}
          </CListGroup>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowViewModal(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>

      <CModal scrollable visible={showEditModal} className="custom-modal" onClose={() => setShowEditModal(false)}>
        <CModalHeader>
          <CModalTitle>Edit Service</CModalTitle>
        </CModalHeader>
        <CModalBody style={{ maxHeight: '60vh', overflowY: 'auto' }}>
          {editService && (
            <CForm>
              <CFormInput
                placeholder="Service Group Name"
                value={editService.name}
                onChange={(e) => setEditService({ ...editService, name: e.target.value })}
                className="mb-2"
              />
              <CListGroup>
                {editService.services.map((item, index) => (
                  <CListGroupItem key={index} className="d-flex justify-content-between align-items-center">
                    <CFormInput
                      value={item}
                      onChange={(e) => {
                        const updatedServices = [...editService.services];
                        updatedServices[index] = e.target.value;
                        setEditService({ ...editService, services: updatedServices });
                      }}
                      className="me-2"
                    />
                    <CIcon
                      className="text-danger"
                      icon={cilTrash}
                      size="lg"
                      style={{ cursor: 'pointer' }}
                      onClick={() =>
                        setEditService({
                          ...editService,
                          services: editService.services.filter((_, i) => i !== index),
                        })
                      }
                    />
                  </CListGroupItem>
                ))}
              </CListGroup>
              <CButton
                color="success"
                className="mt-2 d-flex align-items-center"
                onClick={() =>
                  setEditService({
                    ...editService,
                    services: [...editService.services, ""],
                  })
                }
              >
                <CIcon icon={cilPlus} className="me-1" />
              </CButton>
            </CForm>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </CButton>
          <CButton color="primary" onClick={handleSaveEditService}>
            Save Changes
          </CButton>
        </CModalFooter>
      </CModal>
    </CContainer>
  );
};

export default ServiceManagement;
