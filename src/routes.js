import React from 'react'


const DashboardAdmin = React.lazy(() => import('./views/dashboard/admin/DashboardAdmin'))
const DashboardStudent = React.lazy(() => import('./views/dashboard/student/DashboardStudent'))
const DashboardTeacher = React.lazy(() => import('./views/dashboard/teacher/DashboardTeacher'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard/admin', name: 'Dashboard Admin', element: DashboardAdmin },
  { path: '/dashboard/teacher', name: 'Dashboard Teacher', element: DashboardTeacher },
  { path: '/dashboard/student', name: 'Dashboard Student', element: DashboardStudent }
]

export default routes