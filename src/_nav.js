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
  cilBriefcase,
  cilMoney,
  cilStar,
  cilPhone,
  cilLibraryAdd,
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
        name: "Hunters",
        to: '/hunterUsers',
      },
      {
        component: CNavItem,
        name: "Providers",
        to: '/providerUsers',
      },
      {
        component: CNavItem,
        name: "Guest Users",
        to:"/guestUsers"
      },

    ],
  },
  {
    component: CNavItem,
    name: 'Jobs Management',
    to: '/JobsManagement',
    icon: <CIcon icon={cilBriefcase} customClassName="nav-icon" style={{ color: 'blue' }} />,
    badge: {
      color: 'info',
    },
  },
  {
    component: CNavItem,
    name: 'Services',
    to: '/serviceManagement',
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" style={{ color: 'blue' }} />,
  },
  {
    component: CNavGroup,
    name: 'Subscription Stats',
    // to: '/Usermanagement',
    icon: <CIcon icon={cilLibraryAdd} customClassName="nav-icon" style={{ color: 'blue' }} />,  // Added cilUser here
    items: [
      // {
      //   component: CNavItem,
      //   name: 'All Users ',
      //   to: '/Usermanagement',
      // },
      {
        component: CNavItem,
        name: "Subscription plans",
        to: '/subscriptions',
      },
      {
        component: CNavItem,
        name: "Revenue Insights",
        to: '/payments',
      },

    ],
  },
  {
    component: CNavItem,
    name: 'Contacts',
    to: '/contacts',
    icon: <CIcon icon={cilPhone } customClassName="nav-icon" style={{ color: 'blue' }} />,
  },


]

export default _nav