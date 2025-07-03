import React from 'react'
import { TeacherContent, TeacherSidebar, AppFooter, AppHeader } from '../../../components/index'


const DashboardTeacher = () => {
  return (
    <div>
      <TeacherSidebar />
      <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeader userRole="teacher" />
        <div className="body flex-grow-1">
          <TeacherContent />
        </div>
        <AppFooter />
      </div>
    </div>
  )
}

export default DashboardTeacher