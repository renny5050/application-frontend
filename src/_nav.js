import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilSpeedometer,
  cilStar,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    badge: {
      color: 'info'
    },
  },
  {
    component: CNavGroup,
    name: 'Pages',
    icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Login',
        to: '/login',
      },
      {
        component: CNavItem,
        name: 'Register',
        to: '/register',
      },
      {
        component: CNavItem,
        name: 'Error 404',
        to: '/404',
      },
      {
        component: CNavItem,
        name: 'Error 500',
        to: '/500',
      },
      {
        component: CNavItem,
        name: 'Forgot Password',
        to: '/forgot',
      },
      {
        component: CNavItem,
        name: 'Users',
        to: '/users',
      },
      {
        component: CNavItem,
        name: 'Student Dashboard',
        to: '/student/1',
      },
      {
        component: CNavItem,
        name: 'Teacher Dashboard',
        to: '/teacher-dashboard',
      },
    ],
  }
]

export default _nav
