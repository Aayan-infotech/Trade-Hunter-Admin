import React, { useEffect, useState } from 'react'
import CIcon from '@coreui/icons-react'
import { cilAlarm } from '@coreui/icons'
import axios from 'axios'
import { NavLink } from 'react-router-dom'

const FollowUpNavItem = () => {
  const [count, setCount] = useState(0)

  const fetchUnreadCount = async () => {
    try {
      const res = await axios.get('https://api.tradehunters.com.au/api/contact/isReadCount')
      setCount(res.data.isReadCount || 0)
    } catch (err) {
      console.error('Failed to fetch unread count', err)
    }
  }

  useEffect(() => {
    fetchUnreadCount()
    const interval = setInterval(fetchUnreadCount, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <li className="nav-item">
      <NavLink to="/followUp" className="nav-link">
        <CIcon icon={cilAlarm} className="nav-icon" style={{ color: 'blue' }} />
        <span>
          Follow-Up {count > 0 && <span style={{ color: 'red' }}>({count})</span>}
        </span>
      </NavLink>
    </li>
  )
}

export default FollowUpNavItem