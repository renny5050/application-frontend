import React from 'react'
import { AdminContent, AdminSidebar, AppFooter, AppHeader } from '../../../components/index'

const DashboardAdmin = () => {
  return (
    <div>
      <AdminSidebar />
      <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeader userRole="admin"/>
        <div className="body flex-grow-1">
          <AdminContent />
        </div>
        <AppFooter />
      </div>
    </div>
  )
}

export default DashboardAdmin
