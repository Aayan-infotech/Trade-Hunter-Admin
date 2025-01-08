import React from 'react'

const Usermanagement = React.lazy(() => import('./views/dashboard/Usermanagement'))



const routes = [
  { path: '/Usermanagement', name: 'Usermanagement', element: Usermanagement },


]

export default routes
