import React from 'react'

// const Usermanagement = React.lazy(() => import('./views/Users/Usermanagement.js'))
const hunterUsers = React.lazy(() => import('./views/Users/hunterUsers.js'))
const providerUsers = React.lazy(() => import('./views/Users/providerUsers.js'))
const JobsManagemen = React.lazy(() => import('./views/Users/JobsManagemen.js'))

// const JobsManagement = React.lazy(() => import('./views/JobsManagemen/JobsManagemen.js'))



const routes = [
  // { path: '/Usermanagement', name: 'Usermanagement', element: Usermanagement },
  { path: '/hunterUsers', name: 'hunterUsers', element: hunterUsers },
  { path: '/providerUsers', name: 'providerUsers', element: providerUsers },
  { path: '/JobsManagemen', name: 'JobsManagemen', element: JobsManagemen },


  // { path: '/JobsManagement', name: 'JobsManagement', element: JobsManagement },

]

export default routes
