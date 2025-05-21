import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter className="px-4">
      <div>
        <a href="http://18.209.91.97:2366/" target="_blank" rel="noopener noreferrer">
        Trade Hunter's
        </a>
        <span className="ms-1">&copy; Trade Hunter's</span>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
