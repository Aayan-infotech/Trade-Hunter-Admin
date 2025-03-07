import { element } from 'prop-types'
import React from 'react'

const Usermanagement = React.lazy(() => import('./views/Users/Usermanagement.js'))
const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard.js'))
const hunterUsers = React.lazy(() => import('./views/Users/hunterUsers.js'))
const providerUsers = React.lazy(() => import('./views/Users/providerUsers.js'))
const JobsManagement = React.lazy(() => import('./views/JobsManagement/JobsManagement.js'))
const ServiceManagement = React.lazy(() => import('./views/services/ServiceManagement'));
const SubscriptionManagement =React.lazy(() => import('./views/subscriptions/SubscriptionManagement.js'));
 const paymentManagement = React.lazy(() => import('./views/payments/paymentManagement.js')); 
 const contacts  = React.lazy(() => import('./views/contacts/Contacts.js'))
 const analytics = React.lazy(() => import('./views/platformAnalytics/platformAnalytics.js'))
const contentManagement = React.lazy(() => import('./views/contentAndCommunication/contentManagement.js'))
const JobsHunter = React.lazy(() => import('./views/Users/JobsHunter.js'))
const GuestUsers = React.lazy(() => import('./views/Users/guestUsers.js'))
const followUp = React.lazy(() => import('./views/followUp/followUp.js'))
const providerAssignedJobs = React.lazy(() => import('./views/Users/providerJobs.js'))



const routes = [
  { path: '/Usermanagement', name: 'Usermanagement', element: Usermanagement },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/hunterUsers', name: 'hunterUsers', element: hunterUsers },
  { path: '/providerUsers', name: 'providerUsers', element: providerUsers },
  { path: '/JobsManagement', name: 'JobsManagement', element: JobsManagement },
  { path: '/serviceManagement', name: 'Service Management', element: ServiceManagement },
  {path: '/subscriptions', name: 'Subscription Management', element: SubscriptionManagement},
  { path: '/JobsHunter', name: 'HunterJobs', element: JobsHunter },
  {path: '/payments', name: "Payment Management", element: paymentManagement},
  {path: '/guestUsers', name:"Guest Management", element: GuestUsers},
  {path: '/contacts', name:"Contact", element:contacts},
  {path: '/analytics', name:"Platform Analytics", element:analytics},
  {path: '/contentManagement', name:"Content and Communication Management", element:contentManagement},
  {path: '/followUp', name:"Follow Up", element:followUp},
  { path: '/providerAssignedJobs', name: 'Provider Assigned Jobs', element: providerAssignedJobs },


  // { path: '/JobsManagement', name: 'JobsManagement', element: JobsManagement },

]

export default routes
