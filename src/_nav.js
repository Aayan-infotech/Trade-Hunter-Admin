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
  cilBarChart,
  cilBullhorn,
  cilAlarm,
  cilCart,
  cilTag
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
    icon: <CIcon icon={cilCart} customClassName="nav-icon" style={{ color: 'blue' }} />,  // Added cilUser here
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
  {
    component: CNavItem,
    name: 'Platform Analytics',
    to: '/analytics',
    icon: <CIcon icon={cilBarChart } customClassName="nav-icon" style={{ color: 'blue' }} />,
  },
  {
    component: CNavItem,
    name: 'Content & Communication',
    to: '/contentManagement',
    icon: <CIcon icon={cilBullhorn } customClassName="nav-icon" style={{ color: 'blue' }} />,
  },
  {
    component: CNavItem,
    name: "Follow-Up",
    to: '/followUp',
    icon: <CIcon icon={cilAlarm } customClassName="nav-icon" style={{ color: 'blue' }} />,
  },
  {
    component: CNavItem,
    name: "Promotional Vouchers",
    to: '/promotions',
    icon: <CIcon icon={cilTag} customClassName="nav-icon" style={{ color: 'blue' }} />,
  },
  



]



export default _nav