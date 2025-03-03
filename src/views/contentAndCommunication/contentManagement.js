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
  
  const [postType, setPostType] = useState('');
  const [postTitle, setPostTitle] = useState('');
  const [postMessage, setPostMessage] = useState('');
  
  const [notificationRecipient, setNotificationRecipient] = useState('');
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

  const fetchContent = async (section) => {
    try {
      setError(null);
      const endpointSection = sectionMapping[section] || section;
      const response = await axios.get(`http://54.236.98.193:7777/api/StaticContent/${endpointSection}`);
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
      await axios.post('http://54.236.98.193:7777/api/StaticContent', { section: endpointSection, content: contentData[activeSection] });
      alert('Content saved successfully!');
    } catch (err) {
      console.error('Error saving content:', err);
      setError('Error saving content.');
    }
  };

  const savePost = async () => {
    try {
      setError(null);
      await axios.post('http://54.236.98.193:7777/api/Posts', { type: postType, title: postTitle, message: postMessage });
      alert('Post saved successfully!');
      setPostType('');
      setPostTitle('');
      setPostMessage('');
    } catch (err) {
      console.error('Error saving post:', err);
      setError('Error saving post.');
    }
  };

  const sendNotification = () => {
    console.log('Sending notification to:', notificationRecipient);
    console.log('Notification message:', notificationMessage);
    alert('Notification feature is under development.');
    setNotificationRecipient('');
    setNotificationMessage('');
  };

  const saveAlerts = () => {
    console.log('Pending Verifications Alert:', pendingVerificationsAlert);
    console.log('Unresolved Disputes Alert:', unresolvedDisputesAlert);
    console.log('Subscription Renewals Alert:', subscriptionRenewalsAlert);
    alert('Automated alerts saved successfully!');
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
      
      <CRow className="mb-4" style={{ backgroundColor: '#f0f2f5', padding: '10px 0' }}>
        {['Static Content', 'Posts', 'Notifications', 'Automated Alerts'].map((module) => (
          <CCol key={module} xs="3">
            <CButton 
              color={activeModule === module ? 'primary' : 'secondary'} 
              block 
              onClick={() => setActiveModule(module)}
              style={{ borderRadius: 0, fontWeight: 'bold' }}
            >
              {module}
            </CButton>
          </CCol>
        ))}
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

      {activeModule === 'Posts' && (
        <CCard className="p-4 mb-5">
          <CCardHeader className="service-card-header">Post Announcements, Blogs & Promotions</CCardHeader>
          <CCardBody>
            <CFormSelect
              value={postType}
              onChange={(e) => setPostType(e.target.value)}
            >
              <option value="">Select Post Type</option>
              <option value="announcement">Announcement</option>
              <option value="blog">Blog</option>
              <option value="promotion">Promotion</option>
            </CFormSelect>
            <CFormInput 
              className="mt-3" 
              type="text" 
              placeholder="Enter post title" 
              value={postTitle} 
              onChange={(e) => setPostTitle(e.target.value)} 
            />
            <ReactQuill 
              className="mt-3" 
              value={postMessage} 
              onChange={setPostMessage} 
              placeholder="Enter your message" 
              style={{ height: "250px", marginBottom: "50px" }} 
            />
            <CButton color="success" className="mt-3" onClick={savePost}>
              Post Content
            </CButton>
          </CCardBody>
        </CCard>
      )}

      {activeModule === 'Notifications' && (
        <CCard className="p-4 mb-5">
          <CCardHeader className="service-card-header">Send Mass Notifications</CCardHeader>
          <CCardBody>
            <CFormSelect
              value={notificationRecipient}
              onChange={(e) => setNotificationRecipient(e.target.value)}
            >
              <option value="">Select Recipient</option>
              <option value="clients">To Clients</option>
              <option value="providers">To Providers</option>
            </CFormSelect>
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

      {activeModule === 'Automated Alerts' && (
        <CCard className="p-4 mb-5">
          <CCardHeader className="service-card-header">Automated Alerts</CCardHeader>
          <CCardBody>
            <CRow className="mb-3">
              <CCol md={12}>
                <strong>Pending Verifications Alert:</strong>
                <CFormTextarea
                  className="mt-2"
                  placeholder="Enter alert message for pending verifications"
                  value={pendingVerificationsAlert}
                  onChange={(e) => setPendingVerificationsAlert(e.target.value)}
                  style={{ height: "120px" }}
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol md={12}>
                <strong>Unresolved Disputes Alert:</strong>
                <CFormTextarea
                  className="mt-2"
                  placeholder="Enter alert message for unresolved disputes"
                  value={unresolvedDisputesAlert}
                  onChange={(e) => setUnresolvedDisputesAlert(e.target.value)}
                  style={{ height: "120px" }}
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol md={12}>
                <strong>Subscription Renewal Alert:</strong>
                <CFormTextarea
                  className="mt-2"
                  placeholder="Enter alert message for subscription renewals"
                  value={subscriptionRenewalsAlert}
                  onChange={(e) => setSubscriptionRenewalsAlert(e.target.value)}
                  style={{ height: "120px" }}
                />
              </CCol>
            </CRow>
            <CButton color="info" onClick={saveAlerts}>
              Save Automated Alerts
            </CButton>
          </CCardBody>
        </CCard>
      )}

      {error && <div className="text-danger mb-3">{error}</div>}
    </CContainer>
  );
};

export default ContentAndCommunicationManagement;
