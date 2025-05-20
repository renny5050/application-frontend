import React from 'react'

const Dashboard = React.lazy(() => import('./Dashboard'))
const DashboardAdmin = React.lazy(() => import('./admin/DashboardAdmin'))
const DashboardStudent = React.lazy(() => import('./student/DashboardStudent'))
const DashboardTeacher = React.lazy(() => import('./teacher/DashboardTeacher'))

const routes = [
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/dashboard/admin', name: 'Dashboard Admin', element: DashboardAdmin },
  { path: '/dashboard/teacher', name: 'Dashboard Teacher', element: DashboardTeacher },
  { path: '/dashboard/student', name: 'Dashboard Student', element: DashboardStudent }
]

export default routes