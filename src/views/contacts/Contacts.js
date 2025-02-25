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
import { ref, push, set, onValue , get } from "firebase/database";
import { realtimeDb } from "../chat/firestore";

const Contact = () => {
  const [recentChats, setRecentChats] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [newChatMessage, setNewChatMessage] = useState('');
  const [show, setShow] = useState(false);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const location = useLocation();
  const [chatId, setChatId] = useState(uuidv4());
  const [receiverId, setReceiverId] = useState("123");
  const [currentUser, setCurrentUser] = useState(null);




  useEffect(() => {
    if (!currentUser || !receiverId) return;
    
    const fetchMessages = async () => {
      const chatRef = ref(realtimeDb, "chats");
      const snapshot = await get(chatRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        const allMessages = [];
        
        Object.values(data).forEach((chat) => {
          if (chat.messages) {
            Object.values(chat.messages).forEach((msg) => {
              if (
                (msg.senderId === currentUser && msg.receiverId === receiverId)
              ) {
                allMessages.push(msg);
              }
            });
          }
        });
        
        setMessages(allMessages);
      }
    };
    
    fetchMessages();
    
    const chatMessagesRef = ref(realtimeDb, `chats/${chatId}/messages`);
    onValue(chatMessagesRef, (snapshot) => {
      const data = snapshot.val() ? Object.values(snapshot.val()) : [];
      setMessages((prevMessages) => [...prevMessages, ...data]);
    });
  }, [chatId, currentUser, receiverId]);

  const handleSend = async () => {
    if (text === "" || !currentUser) return;
    try {
      const newMessageRef = push(ref(realtimeDb, `chats/${chatId}/messages`));
      await set(newMessageRef, {
        senderId: currentUser,
        receiverId: receiverId,
        text,
        createdAt: Date.now(),
      });
      setText("");
    } catch (err) {
      console.log("Error sending message:", err);
    }
  };

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
          <CCard className="recent-chats-card">
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
            style={{
              height: '75vh',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              maxWidth: '800px',
              margin: '0 auto',
              border: '1px solid #ccc',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              borderRadius: '10px',
            }}
          >
            <CCardHeader style={{ backgroundColor: '#f8f9fa', fontWeight: 'bold', borderBottom: '1px solid #ccc' }}>
              {selectedContact ? `Chat with ${selectedContact.name}` : 'Chat Panel'}
            </CCardHeader>
            <CCardBody style={{ flex: 1, overflowY: 'auto', padding: '20px', paddingBottom: '70px' }}>
              {selectedContact ? (
                chatMessages.length === 0 ? (
                  <p>No messages yet.</p>
                ) : (
                  chatMessages.map(msg => (
                    <div
                      key={msg.id}
                      style={{ textAlign: msg.sender === 'me' ? 'right' : 'left', marginBottom: '10px' }}
                    >
                      <span
                        style={{
                          display: 'inline-block',
                          maxWidth: '70%',
                          backgroundColor: msg.sender === 'me' ? '#007bff' : '#e9ecef',
                          color: msg.sender === 'me' ? '#fff' : '#333',
                          padding: '10px 15px',
                          borderRadius: '20px',
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
                padding: '10px 20px',
                background: '#fff',
                borderTop: '1px solid #ddd',
              }}
            >
              <CRow className="align-items-center">
                <CCol md={10}>
                  <CFormInput
                    type="text"
                    placeholder="Type your message..."
                    value={newChatMessage}
                    onChange={(e) => setNewChatMessage(e.target.value)}
                    style={{
                      borderRadius: '25px',
                      padding: '10px 15px',
                      border: '1px solid #ced4da',
                      boxShadow: 'none',
                    }}
                  />
                </CCol>
                <CCol md={2}>
                  <CButton color="primary" onClick={handleSendChatMessage} style={{ borderRadius: '25px', padding: '10px 15px' }}>
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
