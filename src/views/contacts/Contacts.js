import React, { useState, useEffect } from 'react';
import {
  CContainer,
  CCard,
  CCardHeader,
  CCardBody,
  CRow,
  CCol,
  CFormInput,
  CButton,
  CListGroup,
  CListGroupItem,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilEnvelopeOpen } from '@coreui/icons';
import '../Users/Usermanagement.css';

const Contact = () => {
  const [recentChats, setRecentChats] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [newChatMessage, setNewChatMessage] = useState('');

  useEffect(() => {
    setRecentChats([
      { id: '1', name: 'Hunter Alpha', lastMessage: 'Hello, are you available?' },
      { id: '2', name: 'Provider Beta', lastMessage: 'Your service is ready.' },
      { id: '3', name: 'Hunter Gamma', lastMessage: 'Let’s catch up soon.' },
    ]);
  }, []);

  const openChatPanel = (contact) => {
    setSelectedContact(contact);
    setChatMessages([
      { id: 'm1', text: 'Hello!', sender: 'them' },
      { id: 'm2', text: 'Hi, how can I help you?', sender: 'me' },
    ]);
  };

  const handleSendChatMessage = () => {
    if (!newChatMessage.trim()) return;
    const message = {
      id: Date.now().toString(),
      text: newChatMessage,
      sender: 'me',
    };
    setChatMessages([...chatMessages, message]);
    setNewChatMessage('');
  };

  return (
    <CContainer fluid className="contact-module-container" style={{ padding: '20px' }}>
      <CRow>
        <CCol md={3} style={{ borderRight: '1px solid #ddd', maxHeight: '80vh', overflowY: 'auto' }}>
          <CCard>
            <CCardHeader>Recent Chats</CCardHeader>
            <CCardBody>
              <CListGroup>
                {recentChats.map(chat => (
                  <CListGroupItem
                    key={chat.id}
                    className="d-flex justify-content-between align-items-center"
                    style={{ cursor: 'pointer' }}
                    onClick={() => openChatPanel(chat)}
                  >
                    <div>
                      <strong>{chat.name}</strong>
                      <p className="mb-0 text-muted" style={{ fontSize: '0.85rem' }}>{chat.lastMessage}</p>
                    </div>
                  </CListGroupItem>
                ))}
              </CListGroup>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol md={9}>
          <CCard
            className="chat-panel-card"
            style={{ height: '75vh', display: 'flex', flexDirection: 'column', position: 'relative' }}
          >
            <CCardHeader>
              {selectedContact ? `Chat with ${selectedContact.name}` : 'Chat Panel'}
            </CCardHeader>
            <CCardBody style={{ flex: 1, overflowY: 'auto', paddingBottom: '70px' }}>
              {selectedContact ? (
                chatMessages.length === 0 ? (
                  <p>No messages yet.</p>
                ) : (
                  chatMessages.map(msg => (
                    <div
                      key={msg.id}
                      style={{ textAlign: msg.sender === 'me' ? 'right' : 'left', marginBottom: '5px' }}
                    >
                      <span
                        style={{
                          backgroundColor: msg.sender === 'me' ? '#007bff' : '#f1f1f1',
                          color: msg.sender === 'me' ? '#fff' : '#333',
                          padding: '5px 10px',
                          borderRadius: '15px',
                        }}
                      >
                        {msg.text}
                      </span>
                    </div>
                  ))
                )
              ) : (
                <p className="text-center">Start a chat by selecting a chat</p>
              )}
            </CCardBody>
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '10px',
                background: '#fff',
                borderTop: '1px solid #ddd',
              }}
            >
              <CRow className="align-items-center">
                <CCol md={10}>
                  <CFormInput
                    type="text"
                    placeholder="Type a message..."
                    value={newChatMessage}
                    onChange={(e) => setNewChatMessage(e.target.value)}
                  />
                </CCol>
                <CCol md={2}>
                  <CButton color="primary" onClick={handleSendChatMessage}>
                    Send
                  </CButton>
                </CCol>
              </CRow>
            </div>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  );
};

export default Contact;
