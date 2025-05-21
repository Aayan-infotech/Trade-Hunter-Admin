import { ref, push, set, onValue, query, orderByChild, limitToLast, remove, update } from "firebase/database";
import React, { useEffect, useState } from 'react';
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
import { FaTrash } from 'react-icons/fa';
import '../Users/Usermanagement.css';
import { realtimeDb } from "../chat/firestore";

const Contact = () => {
  const [recentChats, setRecentChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [chatId, setChatId] = useState("");
  const [receiverId, setReceiverId] = useState("");
  const [limit, setLimit] = useState(10);
  const adminId = localStorage.getItem("adminId") || "aayaninfotech@gmail.com";

  useEffect(() => {
    if (!adminId) return;
    const chatsRef = ref(realtimeDb, "chatsAdmin");
    const chatsQuery = query(chatsRef, orderByChild("lastMessageTime"), limitToLast(limit));
    const unsubscribe = onValue(chatsQuery, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const chatsArray = [];
        Object.entries(data).forEach(([channelId, channelData]) => {
          if (channelId.includes(adminId)) {
            const messagesObj = channelData.messages || {};
            const messagesArray = Object.values(messagesObj);
            messagesArray.sort((a, b) => a.timeStamp - b.timeStamp);
            const unreadCount = messagesArray.filter(
              msg => msg.senderId !== adminId && (msg.read === false || msg.read === undefined)
            ).length;
            const lastMessage = messagesArray.length
              ? messagesArray[messagesArray.length - 1].msg
              : "";
            const lastMessageTime = messagesArray.length
              ? messagesArray[messagesArray.length - 1].timeStamp
              : 0;
            const firstMessage = Object.values(messagesObj)[0];
            chatsArray.push({
              id: channelId,
              name: firstMessage ? (firstMessage.name || firstMessage.receiverName) : "Unknown",
              type: firstMessage ? (firstMessage.type || firstMessage.userType) : "Unknown",
              lastMessage,
              lastMessageTime,
              unreadCount,
              isRead: unreadCount === 0,
            });
          }
        });
        chatsArray.sort((a, b) => b.lastMessageTime - a.lastMessageTime);
        setRecentChats(chatsArray);
      } else {
        setRecentChats([]);
      }
    });
    return () => unsubscribe();
  }, [adminId, limit]);

  useEffect(() => {
    if (!chatId) return;
    const chatMessagesRef = ref(realtimeDb, `chatsAdmin/${chatId}/messages`);
    const unsubscribe = onValue(chatMessagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const messagesArray = Object.values(data).sort((a, b) => a.timeStamp - b.timeStamp);
        setMessages(messagesArray);
      } else {
        setMessages([]);
      }
    });
    return () => unsubscribe();
  }, [chatId]);

  const openChatPanel = (chat) => {
    setSelectedChat(chat);
    setChatId(chat.id);
    const participants = chat.id.split('_chat_');
    const otherId = participants.find((id) => id !== adminId);
    setReceiverId(otherId);
    const chatMessagesRef = ref(realtimeDb, `chatsAdmin/${chat.id}/messages`);
    onValue(chatMessagesRef, (snapshot) => {
      snapshot.forEach(childSnapshot => {
        const msg = childSnapshot.val();
        if (msg.senderId !== adminId && (msg.read === false || msg.read === undefined)) {
          update(childSnapshot.ref, { read: true });
        }
      });
    }, { onlyOnce: true });
  };

  const handleSend = async () => {
    if (text.trim() === "" || !chatId) return;
    try {
      const chatMessagesRef = ref(realtimeDb, `chatsAdmin/${chatId}/messages`);
      const newMessageRef = push(chatMessagesRef);
      await set(newMessageRef, {
        senderId: adminId,
        receiverId: receiverId,
        msg: text,
        timeStamp: Date.now(),
        type: "text",
        read: false, 
      });
      setText("");
    } catch (err) {
      console.log("Error sending message:", err);
    }
  };

  const handleDeleteChat = async (chatIdToDelete, e) => {
    e.stopPropagation();
    const confirmed = window.confirm("Are you sure you want to delete this entire chat?");
    if (confirmed) {
      try {
        await remove(ref(realtimeDb, `chatsAdmin/${chatIdToDelete}`));
        window.alert("Chat deleted successfully!");
      } catch (error) {
        console.error("Error deleting chat:", error);
        window.alert("Error deleting chat. Please try again.");
      }
    }
  };

  return (
    <CContainer fluid className="contact-module-container" style={{ padding: '20px' }}>
      <CRow>
        <CCol md={3} style={{ borderRight: '1px solid var(--table-border-color)', maxHeight: '80vh', overflowY: 'auto' }}>
          <CCard className="recent-chats-card">
            <CCardHeader className="service-card-header">Recent Chats</CCardHeader>
            <CCardBody>
              <CListGroup>
                {recentChats.length > 0 ? (
                  recentChats.map(chat => {
                    const itemBg = chat.unreadCount > 0 ? 'var(--unread-bg)' : 'var(--container-bg)';
                    return (
                      <CListGroupItem
                        key={chat.id}
                        className="d-flex justify-content-between align-items-center"
                        style={{ cursor: 'pointer', backgroundColor: itemBg, borderColor: 'var(--table-border-color)' }}
                        onClick={() => openChatPanel(chat)}
                      >
                        <div>
                          <div style={{ fontSize: 'small', width: '100%' }}>
                            <span style={{ fontWeight: 'bold' }}>{chat.name}</span> <code>({chat.type})</code>
                            {chat.unreadCount > 0 && (
                              <span style={{
                                backgroundColor: '#d9534f',
                                color: '#fff',
                                borderRadius: '50%',
                                padding: '2px 6px',
                                marginLeft: '8px',
                                fontSize: '10px',
                              }}>
                                {chat.unreadCount}
                              </span>
                            )}
                          </div>
                          <p className="mb-0 text-muted" style={{ fontSize: '10px' }}>{chat.lastMessage}</p>
                        </div>
                        <span 
                          onClick={(e) => handleDeleteChat(chat.id, e)} 
                          style={{ cursor: 'pointer', color: 'var(--primary-text-color)' }}
                        >
                          <FaTrash />
                        </span>
                      </CListGroupItem>
                    );
                  })
                ) : (
                  <p>No chats available.</p>
                )}
              </CListGroup>
              {recentChats.length === limit && (
                <div className="text-center mt-3">
                  <CButton color="primary" onClick={() => setLimit(limit + 10)}>
                    Load More
                  </CButton>
                </div>
              )}
            </CCardBody>
          </CCard>
        </CCol>

        <CCol md={9}>
          <CCard
            className="chat-panel-card"
            style={{
              height: '70vh',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              maxWidth: '700px',
              margin: '0 auto',
              border: '1px solid var(--table-border-color)',
              boxShadow: '0 2px 10px var(--shadow-color)',
              borderRadius: '20px',
              backgroundColor: 'var(--container-bg)',
            }}
          >
            <CCardHeader 
              style={{ 
                backgroundColor: 'var(--table-header-bg)', 
                fontWeight: 'bold', 
                borderBottom: '1px solid var(--table-border-color)' 
              }}
            >
              {selectedChat ? `Chat with ${selectedChat.name} (${selectedChat.type})` : 'Chat Panel'}
            </CCardHeader>
            <CCardBody style={{ flex: 1, overflowY: 'auto', padding: '20px', paddingBottom: '70px', backgroundColor: 'var(--container-bg)', color: 'var(--primary-text-color)' }}>
              {messages.length === 0 ? (
                <p className="text-center">No messages yet.</p>
              ) : (
                messages.map((msg, index) => (
                  <div
                    key={index}
                    style={{
                      textAlign: msg.senderId === adminId ? 'right' : 'left',
                      marginBottom: '10px',
                    }}
                  >
                    <span style={{
                      display: 'inline-block',
                      maxWidth: '70%',
                      backgroundColor: msg.senderId === adminId ? 'var(--btn-primary-bg)' : 'var(--table-header-bg)',
                      color: msg.senderId === adminId ? '#fff' : 'var(--primary-text-color)',
                      padding: '10px 15px',
                      borderRadius: '20px',
                      wordBreak: 'break-word',
                    }}>
                      {msg.msg}
                    </span>
                  </div>
                ))
              )}
            </CCardBody>
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '10px 20px',
                background: 'var(--container-bg)',
                borderTop: '1px solid var(--table-border-color)',
              }}
            >
              <CRow className="align-items-center">
                <CCol md={10}>
                  <CFormInput
                    type="text"
                    placeholder="Type your message..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    style={{
                      borderRadius: '25px',
                      padding: '10px 15px',
                      border: '1px solid var(--table-border-color)',
                      boxShadow: 'none',
                      backgroundColor: 'var(--background-color)',
                      color: 'var(--primary-text-color)',
                    }}
                  />
                </CCol>
                <CCol md={2}>
                  <CButton 
                    color="primary" 
                    onClick={handleSend} 
                    style={{ borderRadius: '25px', padding: '10px 15px' }}
                  >
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
