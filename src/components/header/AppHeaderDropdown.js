import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import {
  CAvatar,
  CDropdown,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react';
import {
  cilUser,
} from '@coreui/icons';
import CIcon from '@coreui/icons-react';

import avatar8 from './../../assets/brand/login_admin.jpg';

const AppHeaderDropdown = () => {
  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleLogout = async () => {
    try {
      localStorage.removeItem('token'); // Remove token from localStorage
      navigate('/login'); // Navigate to the login page
    } catch (error) {
      console.error('Logout Error:', error); // Handle any logout errors
    }
  };

  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false}>
        <CAvatar src={avatar8} size="md" />
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownHeader className="bg-body-secondary fw-semibold mb-2">Account</CDropdownHeader>
        <CDropdownItem onClick={handleLogout}>
          <CIcon icon={cilUser} className="me-2" />
          Log Out
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  );
};

export default AppHeaderDropdown;
