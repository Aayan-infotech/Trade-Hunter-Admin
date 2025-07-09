import React, { useState, useEffect } from 'react';
import {
  CContainer, CRow, CCol, CCard, CCardHeader, CCardBody,
  CButton, CHeader, CHeaderBrand, CFormSelect, CFormInput, CFormTextarea, CBadge
} from '@coreui/react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faFileContract, faShieldAlt, faBell, faTrash } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import "../Users/Usermanagement.css";

const sectionMapping = {
  "About Us": "about",
  "Terms & Conditions": "terms",
  "Privacy Policy": "privacy",
  "Guide": "guide",
};

const ContentAndCommunicationManagement = () => {
  const [activeModule, setActiveModule] = useState('Static Content');
  const [activeSection, setActiveSection] = useState('About Us');
  const [contentData, setContentData] = useState({
    "About Us": "", "Terms & Conditions": "", "Privacy Policy": "", "Guide": ""
  });

  const [notificationRecipient, setNotificationRecipient] = useState('');
  const [notificationSubject, setNotificationSubject] = useState('');
  const [notificationMessage, setNotificationMessage] = useState('');
  const [allNotifications, setAllNotifications] = useState([]);
  const [error, setError] = useState(null);
  const [filterType, setFilterType] = useState('all');

  const commonConfig = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json'
    },
  };

  useEffect(() => {
    if (activeModule === 'Static Content') {
      fetchContent(activeSection);
    }
  }, [activeSection, activeModule]);

  useEffect(() => {
    if (activeModule === 'Send Mass Notifications') {
      fetchAllNotifications();
    }
  }, [activeModule]);

  const fetchContent = async (section) => {
    try {
      setError(null);
      const endpoint = sectionMapping[section];
      const res = await axios.get(
        `https://api.tradehunters.com.au/api/StaticContent/${endpoint}`, commonConfig
      );
      setContentData(prev => ({ ...prev, [section]: res.data.content }));
    } catch (err) {
      console.error('Error fetching content:', err);
      setError('Error fetching content.');
    }
  };

  const saveContent = async () => {
    try {
      setError(null);
      const endpoint = sectionMapping[activeSection];
      await axios.post(
        'https://api.tradehunters.com.au/api/StaticContent',
        { section: endpoint, content: contentData[activeSection] },
        commonConfig
      );
      alert('Content saved successfully!');
    } catch (err) {
      console.error('Error saving content:', err);
      setError('Error saving content.');
    }
  };

  const fetchAllNotifications = async () => {
    try {
      setError(null);
      const res = await axios.get(
        'https://api.tradehunters.com.au/api/massNotification/getAll',
        commonConfig
      );
      setAllNotifications(res.data);
    } catch (err) {
      console.error('Error fetching all notifications:', err);
      setError('Could not load sent notifications.');
    }
  };

  const sendNotification = async () => {
    try {
      setError(null);
      const payload = {
        userType: notificationRecipient,
        subject: notificationSubject,
        message: "You have received a notification from  Trade Hunters Admin Team"   + '--' + notificationMessage,
      };
      await axios.post(
        'https://api.tradehunters.com.au/api/massNotification/',
        payload,
        commonConfig
      );
      alert('Notification sent successfully!');
      setNotificationRecipient('');
      setNotificationSubject('');
      setNotificationMessage('');
      fetchAllNotifications();
    } catch (err) {
      console.error('Error sending notification:', err);
      setError('Error sending notification.');
    }
  };

  const deleteNotification = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this notification?");
    if (!confirmDelete) return;

    try {
      await axios.delete(
        `https://api.tradehunters.com.au/api/massNotification/delete/${id}`,
        commonConfig
      );
      setAllNotifications(prev => prev.filter(n => n._id !== id));
      alert("Notification deleted successfully!");
    } catch (err) {
      console.error("Error deleting notification:", err);
      setError("Error deleting notification.");
    }
  };

  const formatDateToAEST = (dateString) =>
    new Date(dateString).toLocaleString("en-AU", {
      timeZone: "Australia/Sydney",
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

  const staticSections = [
    { name: "About Us", icon: faInfoCircle, color: "primary" },
    { name: "Terms & Conditions", icon: faFileContract, color: "warning" },
    { name: "Privacy Policy", icon: faShieldAlt, color: "success" },
    { name: "Guide", icon: faInfoCircle, color: "info" },
  ];

  const filteredNotifications = filterType === 'all'
    ? allNotifications
    : allNotifications.filter(n => n.userType === filterType);

  return (
    <CContainer fluid className="mt-4">
      <CHeader className="service-card-header">
        <CHeaderBrand className='text-light' style={{ height: "30px" }}>
          Content & Communication Management
        </CHeaderBrand>
      </CHeader>

      <CRow className="mb-4" style={{ padding: '10px 0' }}>
        <CCol md="4" className="text-end">
          <CButton
            color={activeModule === 'Static Content' ? 'primary' : 'secondary'}
            block onClick={() => setActiveModule('Static Content')}
            style={{ borderRadius: 0, fontWeight: 'bold' }}
          >
            Static Content
          </CButton>
        </CCol>
        <CCol md="8" className="text-center">
          <CButton
            color={activeModule === 'Send Mass Notifications' ? 'primary' : 'secondary'}
            block onClick={() => setActiveModule('Send Mass Notifications')}
            style={{ borderRadius: 0, fontWeight: 'bold' }}
          >
            Send Mass Notifications
          </CButton>
        </CCol>
      </CRow>

      {activeModule === 'Static Content' && (
        <>
          <CRow className="mb-4">
            {staticSections.map((sec) => (
              <CCol md={3} key={sec.name}>
                <CCard
                  className={`p-3 text-white bg-${sec.color}`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setActiveSection(sec.name)}
                >
                  <h5>
                    <FontAwesomeIcon icon={sec.icon} className="me-2" />
                    {sec.name}
                  </h5>
                  <p>Edit {sec.name.toLowerCase()}</p>
                </CCard>
              </CCol>
            ))}
          </CRow>
          <CCard className="p-4 mb-5">
            <CCardBody>
              <h4>{activeSection}</h4>
              <ReactQuill
                style={{ height: "250px", marginBottom: "50px" }}
                value={contentData[activeSection]}
                onChange={(val) => setContentData(prev => ({
                  ...prev, [activeSection]: val
                }))}
                placeholder={`Enter ${activeSection.toLowerCase()} content`}
              />
              <CButton color="success" onClick={saveContent}>
                Save Content
              </CButton>
            </CCardBody>
          </CCard>
        </>
      )}

      {activeModule === 'Send Mass Notifications' && (
        <CCard className="p-4 mb-5">
          <CCardHeader className="service-card-header">
            <FontAwesomeIcon icon={faBell} className="me-2" />
            Send Mass Notifications
          </CCardHeader>
          <CCardBody>
            <CFormSelect
              value={notificationRecipient}
              onChange={(e) => setNotificationRecipient(e.target.value)}
            >
              <option value="">Select Recipient</option>
              <option value="hunter">To Hunters</option>
              <option value="provider">To Providers</option>
            </CFormSelect>
            <CFormInput
              className="mt-3"
              type="text"
              placeholder="Enter notification subject"
              value={notificationSubject}
              onChange={(e) => setNotificationSubject(e.target.value)}
            />
            <CFormTextarea
              className="mt-3"
              placeholder="Enter notification message"
              value={notificationMessage}
              onChange={(e) => setNotificationMessage(e.target.value)}
              style={{ height: "150px" }}
            />
            <CButton color="primary" className="mt-3" onClick={sendNotification}>
              Send Notification
            </CButton>

            {/* Filter Buttons Below Send */}
            <div className="mt-3">
              <CButton
                size="sm"
                color={filterType === 'all' ? 'light' : 'secondary'}
                onClick={() => setFilterType('all')}
                className="me-2"
              >All</CButton>
              <CButton
                size="sm"
                color={filterType === 'hunter' ? 'primary' : 'secondary'}
                onClick={() => setFilterType('hunter')}
                className="me-2"
              >Hunters</CButton>
              <CButton
                size="sm"
                color={filterType === 'provider' ? 'success' : 'secondary'}
                onClick={() => setFilterType('provider')}
              >Providers</CButton>
            </div>

            <div className="mt-5">
              <h5 className="mb-3">Sent Notifications</h5>
              <CRow xs={{ cols: 1, md: 2, lg: 3 }} className="g-3">
                {filteredNotifications.length === 0
                  ? <p className="text-muted">No notifications found.</p>
                  : filteredNotifications.map((n) => (
                    <CCol key={n._id}>
                      <CCard className="h-100 shadow-sm">
                        <CCardHeader className="service-card-header d-flex justify-content-between align-items-center">
                          <div>
                            <CBadge color={n.userType === 'hunter' ? 'info' : 'success'} className="me-2">
                              {n.userType.toUpperCase()}
                            </CBadge>
                            <small>{formatDateToAEST(n.createdAt)}</small>
                          </div>
                          <FontAwesomeIcon
                            icon={faTrash}
                            style={{ cursor: 'pointer', color: 'white' }}
                            title="Delete"
                            onClick={() => deleteNotification(n._id)}
                          />
                        </CCardHeader>
                        <CCardBody>
                          <h6>{n.title || n.subject}</h6>
                          <p className="mb-2">{n.body || n.message}</p>
                          <small className="text-muted">
                            {formatDateToAEST(n.createdAt)}
                          </small>
                        </CCardBody>
                      </CCard>
                    </CCol>
                  ))
                }
              </CRow>
            </div>
          </CCardBody>
        </CCard>
      )}

      {error && <div className="text-danger mb-3">{error}</div>}
    </CContainer>
  );
};

export default ContentAndCommunicationManagement;
