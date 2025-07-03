import React from 'react'

const TeacherMain = React.lazy(() => import('./TeacherMain.js'))
const AttendanceCRUD = React.lazy(() => import('./Attendance.js'))
const ClassMessage = React.lazy(() => import('./ClassMessage.js'))



const routes = [
  { path: 'main', name: 'Dashboard Teacher', element: TeacherMain},
  { path: 'attendance', name: 'Attendance CRUD', element: AttendanceCRUD },
  {path: 'classmessage', name: 'Class Messages', element: ClassMessage},

]

export default routes