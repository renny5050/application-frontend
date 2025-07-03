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
import { sygnet } from 'src/assets/brand/sygnet'
import {
  cilSpeedometer,
  cilClipboard,
  cilCommentSquare
} from '@coreui/icons'

const teacherNavigation = [
  {
    component: 'CSidebarNavItem',
    name: 'Dashboard',
    to: '/dashboard/teacher',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: 'CSidebarNavItem',
    name: 'Subir Asistencias',
    to: '/dashboard/teacher/attendance',
    icon: <CIcon icon={cilClipboard} customClassName="nav-icon" />,
  },
  {
    component: 'CSidebarNavItem',
    name: 'Mensajes de Clase',
    to: '/dashboard/teacher/classmessage',
    icon: <CIcon icon={cilCommentSquare} customClassName="nav-icon" />,
  }
]

const TeacherSidebar = () => {
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
        <CSidebarBrand to="/dashboard/teacher">
          <CIcon 
            customClassName="sidebar-brand-narrow" 
            icon={sygnet} 
            height={40} 
            style={{ filter: 'brightness(0) invert(1)' }} 
          />
          <span className="sidebar-brand-full ms-2">Panel del Profesor</span>
        </CSidebarBrand>
        <CCloseButton
          className="d-lg-none"
          dark
          onClick={() => dispatch({ type: 'set', sidebarShow: false })}
        />
      </CSidebarHeader>
      
      <AppSidebarNav items={teacherNavigation} />
      
      <CSidebarFooter className="border-top d-none d-lg-flex">
        <CSidebarToggler
          onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
        />
      </CSidebarFooter>
    </CSidebar>
  )
}

export default React.memo(TeacherSidebar)