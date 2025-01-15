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
  {
    component: CNavGroup,
    name: 'User management',
    // to: '/Usermanagement',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" style={{ color: 'blue' }} />,  // Added cilUser here
    items: [
      // {
      //   component: CNavItem,
      //   name: 'All Users ',
      //   to: '/Usermanagement',
      // },
      {
        component: CNavItem,
        name: 'Hunter',
        to: '/hunterUsers',
      },
      {
        component: CNavItem,
        name: 'Provider',
        to: '/providerUsers',
      },      
      
    ],
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
