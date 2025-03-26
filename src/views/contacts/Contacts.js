import React, { useEffect, useState } from 'react'
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
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
} from '@coreui/react'
import '../Users/Usermanagement.css'
import { ref, push, set, onValue, query, orderByChild, limitToLast } from "firebase/database"
import { realtimeDb } from "../chat/firestore"

const Contact = () => {
  const [recentChats, setRecentChats] = useState([])
  const [selectedChat, setSelectedChat] = useState(null)
  const [messages, setMessages] = useState([])
  const [text, setText] = useState("")
  const [chatId, setChatId] = useState("")
  const [receiverId, setReceiverId] = useState("")
  const [limit, setLimit] = useState(10)
  // Use a fixed admin ID – if localStorage is missing, fall back to a hard-coded email.
  const adminId = localStorage.getItem("adminId") || "aayaninfotech@gmail.com"

  // Fetch recent chats from "chatsAdmin"
  useEffect(() => {
    if (!adminId) return
    const chatsRef = ref(realtimeDb, "chatsAdmin")
    const chatsQuery = query(chatsRef, orderByChild("lastMessageTime"), limitToLast(limit))
    const unsubscribe = onValue(chatsQuery, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        const chatsArray = []
        Object.entries(data).forEach(([channelId, channelData]) => {
          // Check if the channel ID includes the admin's identifier
          if (channelId.includes(adminId)) {
            const messagesObj = channelData.messages || {}
            const messagesArray = Object.values(messagesObj)
            // Sort by timeStamp
            messagesArray.sort((a, b) => a.timeStamp - b.timeStamp)
            const lastMessage = messagesArray.length
              ? messagesArray[messagesArray.length - 1].msg
              : ""
            const lastMessageTime = messagesArray.length
              ? messagesArray[messagesArray.length - 1].timeStamp
              : 0
            const firstMessage = Object.values(messagesObj)[0]
            chatsArray.push({
              id: channelId,
              name: firstMessage ? (firstMessage.name || firstMessage.receiverName) : "Unknown",
              type: firstMessage ? (firstMessage.type || firstMessage.userType) : "Unknown",
              lastMessage,
              lastMessageTime,
            })
          }
        })
        chatsArray.sort((a, b) => b.lastMessageTime - a.lastMessageTime)
        setRecentChats(chatsArray)
      } else {
        setRecentChats([])
      }
    })
    return () => unsubscribe()
  }, [adminId, limit])

  useEffect(() => {
    if (!chatId) return
    const chatMessagesRef = ref(realtimeDb, `chatsAdmin/${chatId}/messages`)
    const unsubscribe = onValue(chatMessagesRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        const messagesArray = Object.values(data).sort((a, b) => a.timeStamp - b.timeStamp)
        setMessages(messagesArray)
      } else {
        setMessages([])
      }
    })
    return () => unsubscribe()
  }, [chatId])

  const generateChatId = (otherUserId) => {
    const chatId = [adminId, otherUserId].sort().join('_chat_')
    console.log("Generated Chat ID:", chatId)
    return chatId
  }

  const openChatPanel = (chat) => {
    setSelectedChat(chat)
    setChatId(chat.id)
    const participants = chat.id.split('_chat_')
    const otherId = participants.find((id) => id !== adminId)
    setReceiverId(otherId)
  }

  const handleSend = async () => {
    if (text.trim() === "" || !chatId) return
    try {
      const chatMessagesRef = ref(realtimeDb, `chatsAdmin/${chatId}/messages`)
      const newMessageRef = push(chatMessagesRef)
      await set(newMessageRef, {
        senderId: adminId,
        receiverId: receiverId,
        msg: text,
        timeStamp: Date.now(),
        type: "text",
      })
      setText("")
    } catch (err) {
      console.log("Error sending message:", err)
    }
  }

  return (
    <CContainer fluid className="contact-module-container" style={{ padding: '20px' }}>
      <CRow>
        <CCol md={3} style={{ borderRight: '1px solid #ddd', maxHeight: '80vh', overflowY: 'auto' }}>
          <CCard className="recent-chats-card">
            <CCardHeader className="service-card-header">Recent Chats</CCardHeader>
            <CCardBody>
              <CListGroup>
                {recentChats.length > 0 ? (
                  recentChats.map(chat => (
                    <CListGroupItem
                      key={chat.id}
                      className="d-flex justify-content-between align-items-center"
                      style={{ cursor: 'pointer' }}
                      onClick={() => openChatPanel(chat)}
                    >
                      <div>
                        <div style={{ fontSize: 'small', width: '100%' }}>
                          <span style={{ fontWeight: 'bold' }}>{chat.name}</span> <code>({chat.type})</code>
                        </div>
                        <p className="mb-0 text-muted" style={{ fontSize: '10px' }}>{chat.lastMessage}</p>
                      </div>
                    </CListGroupItem>
                  ))
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
              border: '1px solid #ccc',
              boxShadow: '0 2px 10px rgba(65, 1, 1, 0.1)',
              borderRadius: '20px',
            }}
          >
            <CCardHeader style={{ backgroundColor: '#f8f9fa', fontWeight: 'bold', borderBottom: '1px solid #ccc' }}>
              {selectedChat ? `Chat with ${selectedChat.name} (${selectedChat.type})` : 'Chat Panel'}
            </CCardHeader>
            <CCardBody style={{ flex: 1, overflowY: 'auto', padding: '20px', paddingBottom: '70px' }}>
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
                      backgroundColor: msg.senderId === adminId ? '#007bff' : '#f1f1f1',
                      color: msg.senderId === adminId ? '#fff' : '#333',
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
                background: '#fff',
                borderTop: '1px solid #ddd',
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
                      border: '1px solid #ced4da',
                      boxShadow: 'none',
                    }}
                  />
                </CCol>
                <CCol md={2}>
                  <CButton color="primary" onClick={handleSend} style={{ borderRadius: '25px', padding: '10px 15px' }}>
                    Send
                  </CButton>
                </CCol>
              </CRow>
            </div>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default Contact;
