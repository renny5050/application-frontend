import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  CCloseButton,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { AppSidebarNav } from './AppSidebarNav'
import { logo } from 'src/assets/brand/logo'
import { sygnet } from 'src/assets/brand/sygnet'
import {
  cilPeople,
  cilInbox,
  cilEducation,
  cilSpeedometer,
  cilLockLocked
} from '@coreui/icons'

const adminNavigation = [
  {
    component: 'CSidebarNavItem',
    name: 'Dashboard',
    to: '/dashboard/admin',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: 'CSidebarNavTitle',
    name: 'Gestión Principal'
  },
  {
    component: 'CSidebarNavItem',
    name: 'Usuarios',
    to: '/dashboard/admin/users',
    icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
    badge: {
      color: 'success',
      text: 'NUEVO',
    }
  },
  {
    component: 'CSidebarNavItem',
    name: 'Inventario',
    to: '/dashboard/admin/inventory',
    icon: <CIcon icon={cilInbox} customClassName="nav-icon" />,
  },
  {
    component: 'CSidebarNavItem',
    name: 'Especialidades',
    to: '/dashboard/admin/specialties',
    icon: <CIcon icon={cilLockLocked} customClassName="nav-icon" />,
  },
  {
    component: 'CSidebarNavDropdown',
    name: 'Clases',
    route: '/dashboard/admin/classes',
    icon: <CIcon icon={cilEducation} customClassName="nav-icon" />,
    items: [
      {
        component: 'CSidebarNavItem',
        name: 'Todas las clases',
        to: '/dashboard/admin/classes',
      },
      {
        component: 'CSidebarNavItem',
        name: 'Crear Nueva Clase',
        to: '/dashboard/admin/create',
      },
    ],
  }
]

const AppSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)

  return (
    <CSidebar
      className="border-end"
      colorScheme="dark"
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
    >
      <CSidebarHeader className="border-bottom">
        <CSidebarBrand to="/admin">
          <CIcon 
            customClassName="sidebar-brand-full" 
            icon={logo} 
            height={40} 
            style={{ filter: 'brightness(0) invert(1)' }} 
          />
          <CIcon 
            customClassName="sidebar-brand-narrow" 
            icon={sygnet} 
            height={40} 
            style={{ filter: 'brightness(0) invert(1)' }} 
          />
        </CSidebarBrand>
        <CCloseButton
          className="d-lg-none"
          dark
          onClick={() => dispatch({ type: 'set', sidebarShow: false })}
        />
      </CSidebarHeader>
      
      <AppSidebarNav items={adminNavigation} />
      
      <CSidebarFooter className="border-top d-none d-lg-flex">
        <CSidebarToggler
          onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
        />
      </CSidebarFooter>
    </CSidebar>
  )
}

export default React.memo(AppSidebar)