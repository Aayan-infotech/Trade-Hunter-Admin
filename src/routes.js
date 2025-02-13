import React from 'react'

// const Usermanagement = React.lazy(() => import('./views/Users/Usermanagement.js'))
const hunterUsers = React.lazy(() => import('./views/Users/hunterUsers.js'))
const providerUsers = React.lazy(() => import('./views/Users/providerUsers.js'))
const JobsManagement = React.lazy(() => import('./views/JobsManagement/JobsManagement.js'))
const ServiceManagement = React.lazy(() => import('./views/services/ServiceManagement'));
const SubscriptionManagement =React.lazy(() => import('./views/subscriptions/SubscriptionManagement.js'));
// const paymentManagement = React.lazy(() => import('./views/payment/paymentManagement.js'));

// const JobsManagement = React.lazy(() => import('./views/JobsManagemen/JobsManagemen.js'))



const routes = [
  // { path: '/Usermanagement', name: 'Usermanagement', element: Usermanagement },
  { path: '/hunterUsers', name: 'hunterUsers', element: hunterUsers },
  { path: '/providerUsers', name: 'providerUsers', element: providerUsers },
  { path: '/JobsManagement', name: 'JobsManagement', element: JobsManagement },
  { path: '/serviceManagement', name: 'Service Management', element: ServiceManagement },
  {path: '/subscriptions', name: 'Subscription Management', element: SubscriptionManagement},
  // {path: '/payments', name: "Payment Management", element: paymentManagement}


  // { path: '/JobsManagement', name: 'JobsManagement', element: JobsManagement },

]

export default routes
