import React from 'react'

// const Usermanagement = React.lazy(() => import('./views/Users/Usermanagement.js'))
const hunterUsers = React.lazy(() => import('./views/Users/hunterUsers.js'))
const providerUsers = React.lazy(() => import('./views/Users/providerUsers.js'))
const JobsManagemen = React.lazy(() => import('./views/Users/JobsManagemen.js'))
const ServiceManagement = React.lazy(() => import('./views/services/ServiceManagement'));
const SubscriptionManagement =React.lazy(() => import('./views/subscriptions/SubscriptionManagement.js'));

// const JobsManagement = React.lazy(() => import('./views/JobsManagemen/JobsManagemen.js'))



const routes = [
  // { path: '/Usermanagement', name: 'Usermanagement', element: Usermanagement },
  { path: '/hunterUsers', name: 'hunterUsers', element: hunterUsers },
  { path: '/providerUsers', name: 'providerUsers', element: providerUsers },
  { path: '/JobsManagemen', name: 'JobsManagemen', element: JobsManagemen },
  { path: '/serviceManagement', name: 'Service Management', element: ServiceManagement },
  {path: '/subscriptions', name: 'Subscription Management', element: SubscriptionManagement},


  // { path: '/JobsManagement', name: 'JobsManagement', element: JobsManagement },

]

export default routes
