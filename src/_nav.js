import React from 'react';
import CIcon from '@coreui/icons-react';
import {
  cilPuzzle,
  cilUser,
  cilBriefcase,
  cilBarChart,
  cilBullhorn,
  cilAlarm,
  cilCart,
  cilTag,
  cilPen
} from '@coreui/icons';
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react';
import NavContacts from './navContacts'; 

const _nav = [
  {
    component: CNavGroup,
    name: 'User management',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" style={{ color: 'blue' }} />,
    items: [
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
    icon: <CIcon icon={cilCart} customClassName="nav-icon" style={{ color: 'blue' }} />,
    items: [
      {
        component: CNavItem,
        name: "Subscription plans",
        to: '/subscriptions',
      },
      {
        component: CNavItem,
        name: "Subscribed Users",
        to: '/subscribedUsers',
      },
      {
        component: CNavItem,
        name: "Voucher Users",
        to: '/voucherUsers',
      },
      {
        component: CNavItem,
        name: "Revenue Insights",
        to: '/payments',
      },
    ],
  },
  {
    component: NavContacts,  
  },
  {
    component: CNavItem,
    name: 'Platform Analytics',
    to: '/analytics',
    icon: <CIcon icon={cilBarChart} customClassName="nav-icon" style={{ color: 'blue' }} />,
  },
  {
    component: CNavItem,
    name: 'Content & Communication',
    to: '/contentManagement',
    icon: <CIcon icon={cilBullhorn} customClassName="nav-icon" style={{ color: 'blue' }} />,
  },
  {
    component: CNavItem,
    name: "Follow-Up",
    to: '/followUp',
    icon: <CIcon icon={cilAlarm} customClassName="nav-icon" style={{ color: 'blue' }} />,
  },
  {
    component: CNavItem,
    name: "Promotional Vouchers",
    to: '/promotions',
    icon: <CIcon icon={cilTag} customClassName="nav-icon" style={{ color: 'blue' }} />,
  },
  {
    component: CNavItem,
    name: "Blogs Management",
    to: '/blogsManagement',
    icon: <CIcon icon={cilPen} customClassName="nav-icon" style={{ color: 'blue' }} />,
  },
  {
    component: CNavItem,
    name: "Ratings And Feedbacks",
    to: '/ratingsManagement',
    icon: <CIcon icon={cilPen} customClassName="nav-icon" style={{ color: 'blue' }} />,
  },
];

export default _nav;
