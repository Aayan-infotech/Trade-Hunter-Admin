import React, { useEffect, useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import 'react-toastify/dist/ReactToastify.css'
import {
  CContainer,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CHeader,
  CHeaderNav,
  CHeaderToggler,
  CNavLink,
  CNavItem,
  useColorModes,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { ToastContainer, toast } from 'react-toastify'

import {
  cilBell,
  cilContrast,
  cilEnvelopeOpen,
  cilList,
  cilMenu,
  cilMoon,
  cilSun,
} from '@coreui/icons'
import io from 'socket.io-client'

import { AppBreadcrumb } from './index'
import { AppHeaderDropdown } from './header/index'

const socket = io('http://18.209.91.97:7787')

const AppHeader = () => {
  const headerRef = useRef()
  const { colorMode, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
  const dispatch = useDispatch()
  const sidebarShow = useSelector((state) => state.sidebarShow)
  const [contacts, setContacts] = useState([])

  useEffect(() => {
    document.addEventListener('scroll', () => {
      if (headerRef.current) {
        headerRef.current.classList.toggle('shadow-sm', document.documentElement.scrollTop > 0)
      }
    })
  }, [])

  useEffect(() => {
    if (colorMode === 'dark') {
      document.documentElement.classList.add('dark-mode')
    } else {
      document.documentElement.classList.remove('dark-mode')
    }
  }, [colorMode])

  const fetchContacts = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await axios.get('http://18.209.91.97:7787/api/contact/getAll', commonConfig)
      const fetchedContacts = response.data.contacts || []
      const sortedContacts = fetchedContacts.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      )
      setContacts(sortedContacts)
    } catch (err) {
      console.error('Error fetching contacts:', err)
      setError('Failed to load contacts. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchContacts()

    socket.on('newContact', (newContact) => {
      toast.success(`New Follow Up Msg From ${newContact.name}`, {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })
      setContacts((prev) => [newContact, ...prev])
    })

    return () => {
      socket.off('newContact')
    }
  }, [])

  return (
    <>
      <CHeader position="sticky" className="mb-4 p-0" ref={headerRef}>
        <CContainer className="border-bottom px-4" fluid>
          <CHeaderToggler
            onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
            style={{ marginInlineStart: '-14px' }}
          >
            <CIcon icon={cilMenu} size="lg" />
          </CHeaderToggler>
          <CHeaderNav className="d-none d-md-flex">
            <CNavItem>
              <CNavLink to="/dashboard" as={NavLink}>
                Trade Hunters
              </CNavLink>
            </CNavItem>
          </CHeaderNav>

          <CHeaderNav>
            <CDropdown variant="nav-item" placement="bottom-end">
              <CDropdownToggle caret={false}>
                {colorMode === 'dark' ? (
                  <CIcon icon={cilMoon} size="lg" />
                ) : colorMode === 'auto' ? (
                  <CIcon icon={cilContrast} size="lg" />
                ) : (
                  <CIcon icon={cilSun} size="lg" />
                )}
              </CDropdownToggle>
              <CDropdownMenu>
                <CDropdownItem
                  active={colorMode === 'light'}
                  className="d-flex align-items-center"
                  as="button"
                  type="button"
                  onClick={() => setColorMode('light')}
                >
                  <CIcon className="me-2" icon={cilSun} size="lg" /> Light
                </CDropdownItem>
                <CDropdownItem
                  active={colorMode === 'dark'}
                  className="d-flex align-items-center"
                  as="button"
                  type="button"
                  onClick={() => setColorMode('dark')}
                >
                  <CIcon className="me-2" icon={cilMoon} size="lg" /> Dark
                </CDropdownItem>
                <CDropdownItem
                  active={colorMode === 'auto'}
                  className="d-flex align-items-center"
                  as="button"
                  type="button"
                  onClick={() => setColorMode('auto')}
                >
                  <CIcon className="me-2" icon={cilContrast} size="lg" /> Auto
                </CDropdownItem>
              </CDropdownMenu>
            </CDropdown>
            <li className="nav-item py-1">
              <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
            </li>
            <AppHeaderDropdown />
          </CHeaderNav>
        </CContainer>
        <CContainer className="px-4" fluid>
          <AppBreadcrumb />
        </CContainer>
      </CHeader>

      <ToastContainer />
    </>
  )
}

export default AppHeader
