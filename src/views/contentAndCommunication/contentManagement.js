import React, { useState, useEffect } from 'react';
import { 
  CContainer, 
  CRow, 
  CCol, 
  CCard, 
  CCardHeader, 
  CCardBody, 
  CButton, 
  CHeader, 
  CHeaderBrand, 
  CFormSelect, 
  CFormInput, 
  CFormTextarea 
} from '@coreui/react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faFileContract, faShieldAlt } from '@fortawesome/free-solid-svg-icons';
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
    "About Us": "",
    "Terms & Conditions": "",
    "Privacy Policy": ""
  });
  
  const [notificationRecipient, setNotificationRecipient] = useState('');
  const [notificationSubject, setNotificationSubject] = useState('');
  const [notificationMessage, setNotificationMessage] = useState('');
  
  const [pendingVerificationsAlert, setPendingVerificationsAlert] = useState('');
  const [unresolvedDisputesAlert, setUnresolvedDisputesAlert] = useState('');
  const [subscriptionRenewalsAlert, setSubscriptionRenewalsAlert] = useState('');
  
  const [error, setError] = useState(null);

  useEffect(() => {
    if(activeModule === 'Static Content'){
      fetchContent(activeSection);
    }
  }, [activeSection, activeModule]);
  
  const commonConfig = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json'
    },
  };

  const fetchContent = async (section) => {
    try {
      setError(null);
      const endpointSection = sectionMapping[section] || section;
      const response = await axios.get(
        `http://3.223.253.106:7777/api/StaticContent/${endpointSection}`,
        commonConfig
      );
      setContentData(prev => ({ ...prev, [section]: response.data.content }));
    } catch (err) {
      console.error('Error fetching content:', err);
      setError('Error fetching content.');
    }
  };

  const handleDescriptionChange = (value) => {
    setContentData({ ...contentData, [activeSection]: value });
  };

  const saveContent = async () => {
    try {
      setError(null);
      const endpointSection = sectionMapping[activeSection] || activeSection;
      await axios.post(
        'http://3.223.253.106:7777/api/StaticContent',
        { section: endpointSection, content: contentData[activeSection] },
        commonConfig
      );
      alert('Content saved successfully!');
    } catch (err) {
      console.error('Error saving content:', err);
      setError('Error saving content.');
    }
  };

  const sendNotification = async () => {
    try {
      const payload = {
        userType: notificationRecipient, 
        subject: notificationSubject,
        message: notificationMessage,
      };
      const response = await axios.post(
        'http://3.223.253.106:7777/api/massNotification/',
        payload,
        commonConfig
      );
      alert('Notification sent successfully!\nResponse: ' + JSON.stringify(response.data));
      setNotificationRecipient('');
      setNotificationSubject('');
      setNotificationMessage('');
    } catch (err) {
      console.error('Error sending notification:', err);
      setError('Error sending notification.');
    }
  };

  const saveAlerts = () => {
    console.log('Pending Verifications Alert:', pendingVerificationsAlert);
    console.log('Unresolved Disputes Alert:', unresolvedDisputesAlert);
    console.log('Subscription Renewals Alert:', subscriptionRenewalsAlert);
    setPendingVerificationsAlert('');
    setUnresolvedDisputesAlert('');
    setSubscriptionRenewalsAlert('');
  };

  const staticSections = [
    { name: "About Us", icon: faInfoCircle, color: "primary" },
    { name: "Terms & Conditions", icon: faFileContract, color: "warning" },
    { name: "Privacy Policy", icon: faShieldAlt, color: "success" },
  ];

  return (
    <CContainer fluid className="mt-4">
      <CHeader className="service-card-header">
        <CHeaderBrand className="service-card-header" style={{ height: "30px" }}>
          Content & Communication Management
        </CHeaderBrand>
      </CHeader>
      
      <CRow className="mb-4 module-nav-row" style={{ padding: '10px 0' }}>
        <CCol md="4" className="text-end">
          <CButton 
            color={activeModule === 'Static Content' ? 'primary' : 'secondary'} 
            block 
            onClick={() => setActiveModule('Static Content')}
            style={{ borderRadius: 0, fontWeight: 'bold' }}
          >
            Static Content
          </CButton>
        </CCol>
        <CCol md="8" className="text-center">
          <CButton 
            color={activeModule === 'Send Mass Notifications' ? 'primary' : 'secondary'} 
            block 
            onClick={() => setActiveModule('Send Mass Notifications')}
            style={{ borderRadius: 0, fontWeight: 'bold' }}
          >
            Send Mass Notifications
          </CButton>
        </CCol>
      </CRow>

      {activeModule === 'Static Content' && (
        <>
          <CRow className="mb-4">
            {staticSections.map((section) => (
              <CCol md={4} key={section.name}>
                <CCard 
                  className={`p-3 text-white bg-${section.color}`} 
                  style={{ cursor: 'pointer' }} 
                  onClick={() => setActiveSection(section.name)}
                >
                  <h5>
                    <FontAwesomeIcon icon={section.icon} className="me-2" />
                    {section.name}
                  </h5>
                  <p>Add & update {section.name.toLowerCase()}</p>
                </CCard>
              </CCol>
            ))}
          </CRow>

          <CCard className="p-4 mb-5">
            <CCardBody>
              <h4>{activeSection}</h4>
              <CRow>
                <CCol md={12}>
                  <ReactQuill
                    style={{ height: "250px", marginBottom: "50px" }}
                    value={contentData[activeSection]}
                    onChange={handleDescriptionChange}
                    placeholder={`Enter ${activeSection.toLowerCase()} content`}
                  />
                </CCol>
              </CRow>
              <CButton color="success" className="mt-3" onClick={saveContent}>
                Save Content
              </CButton>
            </CCardBody>
          </CCard>
        </>
      )}

      {activeModule === 'Send Mass Notifications' && (
        <CCard className="p-4 mb-5">
          <CCardHeader className="service-card-header">Send Mass Notifications</CCardHeader>
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
          </CCardBody>
        </CCard>
      )}

      

      {error && <div className="text-danger mb-3">{error}</div>}
    </CContainer>
  );
};

export default ContentAndCommunicationManagement;
