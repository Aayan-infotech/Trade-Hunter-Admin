import React, { useState, useEffect } from 'react';
import { 
  CContainer, CRow, CCol, CCard, CCardHeader, CCardBody, 
  CButton, CHeader, CHeaderBrand, CFormSelect, CFormInput, CFormTextarea, CBadge
} from '@coreui/react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faFileContract, faShieldAlt, faBell } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import "../Users/Usermanagement.css";

const sectionMapping = {
  "About Us": "about",
  "Terms & Conditions": "terms",
  "Privacy Policy": "privacy",
};

const ContentAndCommunicationManagement = () => {
  const [activeModule, setActiveModule] = useState('Static Content');
  const [activeSection, setActiveSection] = useState('About Us');
  const [contentData, setContentData] = useState({
    "About Us": "", "Terms & Conditions": "", "Privacy Policy": ""
  });
  
  const [notificationRecipient, setNotificationRecipient] = useState('');
  const [notificationSubject, setNotificationSubject] = useState('');
  const [notificationMessage, setNotificationMessage] = useState('');
  const [allNotifications, setAllNotifications] = useState([]);
  
  const [error, setError] = useState(null);

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
        `http://18.209.91.97:7787/api/StaticContent/${endpoint}`, commonConfig
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
        'http://18.209.91.97:7787/api/StaticContent',
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
        'http://18.209.91.97:7787/api/massNotification/getAll',
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
        message: notificationMessage,
      };
      await axios.post(
        'http://18.209.91.97:7787/api/massNotification/',
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

  const staticSections = [
    { name: "About Us", icon: faInfoCircle, color: "primary" },
    { name: "Terms & Conditions", icon: faFileContract, color: "warning" },
    { name: "Privacy Policy", icon: faShieldAlt, color: "success" },
  ];

  return (
    <CContainer fluid className="mt-4">
      <CHeader className="service-card-header">
        <CHeaderBrand style={{ height: "30px" }}>
          Content & Communication Management
        </CHeaderBrand>
      </CHeader>
      
      {/* Module Toggle */}
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

      {/* Static Content Module */}
      {activeModule === 'Static Content' && (
        <>
          <CRow className="mb-4">
            {staticSections.map((sec) => (
              <CCol md={4} key={sec.name}>
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

      {/* Mass Notifications Module */}
      {activeModule === 'Send Mass Notifications' && (
        <CCard className="p-4 mb-5">
          <CCardHeader className="service-card-header">
            <FontAwesomeIcon icon={faBell} className="me-2" />
            Send Mass Notifications
          </CCardHeader>
          <CCardBody>
            {/* existing form untouched */}
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

            {/* enhanced notifications list */}
            <div className="mt-5">
              <h5 className="mb-3">Sent Notifications</h5>
              <CRow xs={{ cols: 1, md: 2, lg: 3 }} className="g-3">
                {allNotifications.length === 0 
                  ? <p className="text-muted">No notifications sent yet.</p>
                  : allNotifications.map((n) => (
                    <CCol key={n._id}>
                      <CCard className="h-100 shadow-sm">
                        <CCardHeader className="service-card-header">
                          <CBadge color={n.userType === 'hunter' ? 'info' : 'success'}>
                            {n.userType.toUpperCase()}
                          </CBadge>
                          <small>{new Date(n.createdAt).toLocaleDateString()}</small>
                        </CCardHeader>
                        <CCardBody>
                          <h6>{n.title}</h6>
                          <p className="mb-2">{n.body}</p>
                          <small className="text-muted">
                            {new Date(n.createdAt).toLocaleTimeString()}
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
