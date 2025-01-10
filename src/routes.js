import React from 'react'

const Usermanagement = React.lazy(() => import('./views/dashboard/Usermanagement'))
const JobsManagement = React.lazy(() => import('./views/JobsManagemen/JobsManagemen.js'))


const routes = [
  { path: '/Usermanagement', name: 'Usermanagement', element: Usermanagement },
  { path: '/JobsManagement', name: 'JobsManagement', element: JobsManagement },

]

export default routes
