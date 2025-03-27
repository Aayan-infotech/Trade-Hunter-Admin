import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CNavItem } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPhone } from '@coreui/icons';
import { ref, onValue, query, orderByChild } from "firebase/database";
import { realtimeDb } from "./views/chat/firestore"; // Adjust the path if needed
import './views/Users/Usermanagement.css'; // Import the custom CSS file

const NavContacts = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const adminId = localStorage.getItem("adminId") || "aayaninfotech@gmail.com";
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/contacts");
  };

  useEffect(() => {
    const chatsRef = ref(realtimeDb, "chatsAdmin");
    const chatsQuery = query(chatsRef, orderByChild("lastMessageTime"));
    const unsubscribe = onValue(chatsQuery, (snapshot) => {
      let total = 0;
      const data = snapshot.val();
      if (data) {
        Object.entries(data).forEach(([channelId, channelData]) => {
          if (channelId.includes(adminId)) {
            const messagesObj = channelData.messages || {};
            const messagesArray = Object.values(messagesObj);
            messagesArray.forEach(msg => {
              // Count as unread if sender is not admin and read is false or missing.
              if (msg.senderId !== adminId && (msg.read === false || msg.read === undefined)) {
                total++;
              }
            });
          }
        });
      }
      setUnreadCount(total);
    });
    return () => unsubscribe();
  }, [adminId]);

  return (
    <CNavItem onClick={handleClick} style={{ cursor: "pointer" }} to="/contacts">
      <CIcon icon={cilPhone} customClassName="nav-icon" style={{ color: 'blue' }} />
      <span>Contacts  </span>
      {unreadCount > 0 && (
        <span className="unreadBadge">{unreadCount}</span>
      )}
    </CNavItem>
  );
};

export default NavContacts;
