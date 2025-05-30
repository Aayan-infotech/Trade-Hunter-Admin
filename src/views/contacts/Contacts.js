import { 
  ref, push, set, onValue, query, orderByChild, 
  limitToLast, remove, update 
} from "firebase/database"
import React, { useEffect, useState } from 'react'
import axios from 'axios'
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
} from '@coreui/react'
import { FaTrash } from 'react-icons/fa'
import '../Users/Usermanagement.css'
import { realtimeDb } from "../chat/firestore"

const Contact = () => {
  const [recentChats, setRecentChats] = useState([])
  const [selectedChat, setSelectedChat] = useState(null)
  const [messages, setMessages] = useState([])
  const [text, setText] = useState("")
  const [chatId, setChatId] = useState("")
  const [receiverId, setReceiverId] = useState("")
  const [limit, setLimit] = useState(10)
  const adminId = localStorage.getItem("adminId") || "aayaninfotech@gmail.com"

  // 1) Load recent chats
  useEffect(() => {
    if (!adminId) return
    const chatsRef = ref(realtimeDb, "chatsAdmin")
    const chatsQuery = query(
      chatsRef,
      orderByChild("lastMessageTime"),
      limitToLast(limit),
    )
    const unsubscribe = onValue(chatsQuery, (snapshot) => {
      const data = snapshot.val() || {}
      const chatsArray = Object.entries(data)
        .filter(([channelId]) => channelId.includes(adminId))
        .map(([channelId, channelData]) => {
          const msgs = channelData.messages || {}
          const arr = Object.values(msgs).sort((a, b) => a.timeStamp - b.timeStamp)
          const last = arr[arr.length - 1] || {}
          const first = arr[0] || {}
          const unreadCount = arr.filter(m => m.senderId !== adminId && !m.read).length
          return {
            id: channelId,
            name: first.name || first.receiverName || "Unknown",
            type: first.type || first.userType || "Unknown",
            lastMessage: last.msg || "",
            lastMessageTime: last.timeStamp || 0,
            unreadCount,
          }
        })
      chatsArray.sort((a, b) => b.lastMessageTime - a.lastMessageTime)
      setRecentChats(chatsArray)
    })
    return () => unsubscribe()
  }, [adminId, limit])

  // 2) Load messages when a chat is selected
  useEffect(() => {
    if (!chatId) return
    const msgsRef = ref(realtimeDb, `chatsAdmin/${chatId}/messages`)
    const unsubscribe = onValue(msgsRef, snap => {
      const data = snap.val() || {}
      const arr = Object.values(data).sort((a, b) => a.timeStamp - b.timeStamp)
      setMessages(arr)
    })
    return () => unsubscribe()
  }, [chatId])

  // 3) Open chat & mark unread as read
  const openChatPanel = (chat) => {
    setSelectedChat(chat)
    setChatId(chat.id)
    const [a, b] = chat.id.split('_chat_')
    const other = a === adminId ? b : a
    setReceiverId(other)

    const msgsRef = ref(realtimeDb, `chatsAdmin/${chat.id}/messages`)
    onValue(msgsRef, snap => {
      snap.forEach(child => {
        const m = child.val()
        if (m.senderId !== adminId && !m.read) {
          update(child.ref, { read: true })
        }
      })
    }, { onlyOnce: true })
  }

  // 4) Send message + push-notification
  const handleSend = async () => {
    if (!chatId || !text.trim()) return

    try {
      // a) Write to Firebase
      const msgsRef = ref(realtimeDb, `chatsAdmin/${chatId}/messages`)
      const newRef = push(msgsRef)
      await set(newRef, {
        senderId: adminId,
        receiverId,
        msg: text,
        timeStamp: Date.now(),
        type: "text",
        read: false,
      })

      // b) Send admin notification
      const notifTitle = `New message from Admin`
      const notifBody  = text
      const url = `http://18.209.91.97:7787/api/pushNotification/sendAdminNotification/${receiverId}`
      await axios.post(url, {
        title: notifTitle,
        body:  notifBody,
      })

      setText("")
    } catch (err) {
      console.error("Error sending message or notification:", err)
    }
  }

  // 5) Delete a chat
  const handleDeleteChat = async (id, e) => {
    e.stopPropagation()
    if (!window.confirm("Are you sure you want to delete this chat?")) return
    try {
      await remove(ref(realtimeDb, `chatsAdmin/${id}`))
      if (id === chatId) {
        setSelectedChat(null)
        setChatId("")
        setMessages([])
      }
      window.alert("Chat deleted successfully!")
    } catch (err) {
      console.error("Error deleting chat:", err)
      window.alert("Failed to delete chat.")
    }
  }

  return (
    <CContainer fluid style={{ padding: '20px' }}>
      <CRow>
        {/* Recent Chats List */}
        <CCol md={3} style={{ borderRight: '1px solid var(--table-border-color)', maxHeight: '80vh', overflowY: 'auto' }}>
          <CCard className="recent-chats-card">
            <CCardHeader className="service-card-header">Recent Chats</CCardHeader>
            <CCardBody>
              <CListGroup>
                {recentChats.length ? recentChats.map(chat => (
                  <CListGroupItem
                    key={chat.id}
                    className="d-flex justify-content-between align-items-center"
                    style={{
                      cursor: 'pointer',
                      backgroundColor: chat.unreadCount ? 'var(--unread-bg)' : 'var(--container-bg)'
                    }}
                    onClick={() => openChatPanel(chat)}
                  >
                    <div>
                      <strong>{chat.name}</strong> <small>({chat.type})</small>
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
                      <p className="mb-0 text-muted" style={{ fontSize: '10px' }}>
                        {chat.lastMessage}
                      </p>
                    </div>
                    <FaTrash
                      style={{ cursor: 'pointer', color: 'var(--primary-text-color)' }}
                      onClick={(e) => handleDeleteChat(chat.id, e)}
                    />
                  </CListGroupItem>
                )) : <p>No chats available.</p>}
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

        {/* Chat Panel */}
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
            <CCardHeader style={{ backgroundColor: 'var(--table-header-bg)', fontWeight: 'bold', borderBottom: '1px solid var(--table-border-color)' }}>
              {selectedChat ? `Chat with ${selectedChat.name} (${selectedChat.type})` : 'Chat Panel'}
            </CCardHeader>
            <CCardBody style={{ flex: 1, overflowY: 'auto', padding: '20px', paddingBottom: '70px', backgroundColor: 'var(--container-bg)', color: 'var(--primary-text-color)' }}>
              {messages.length ? (
                messages.map((msg, idx) => (
                  <div
                    key={idx}
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
              ) : (
                <p className="text-center">No messages yet.</p>
              )}
            </CCardBody>
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              padding: '10px 20px',
              background: 'var(--container-bg)',
              borderTop: '1px solid var(--table-border-color)',
            }}>
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

export default Contact
