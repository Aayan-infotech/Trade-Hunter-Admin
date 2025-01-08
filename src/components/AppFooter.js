import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter className="px-4">
      <div>
        <a href="https://aayaninfotech.com/" target="_blank" rel="noopener noreferrer">
        Aayan Infotech
        </a>
        <span className="ms-1">&copy; 2024 AayanInfotech.</span>
      </div>
      {/* <div className="ms-auto">
        <span className="me-1">Powered by</span>
        <a href="https://coreui.io/react" target="_blank" rel="noopener noreferrer">
          CoreUI React Admin &amp; Dashboard Template
        </a>
      </div> */}
    </CFooter>
  )
}

export default React.memo(AppFooter)
