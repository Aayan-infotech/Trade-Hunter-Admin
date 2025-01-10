import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilCalculator,
  cilChartPie,
  cilCursor,
  cilDescription,
  cilDrop,
  cilExternalLink,
  cilNotes,
  cilPencil,
  cilPuzzle,
  cilSpeedometer,
  cilUser,  
  cilStar,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [

  // Dashboard
  {
    component: CNavItem,
    name: 'User management',
    to: '/Usermanagement',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" style={{ color: 'blue' }} />,  // Added cilUser here
    badge: {
      color: 'info',
    },
  },
  {
    component: CNavItem,
    name: 'Jobs Management',
    to: '/JobsManagement',  // Fixed typo in the route name
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" style={{ color: 'blue' }} />,  // Added cilPuzzle or another icon here
    badge: {
      color: 'info',
    },
  },
]

export default _nav
