import React from 'react'

const AdminMain = React.lazy(() => import('./AdminMain.js'))
const AdminInventory = React.lazy(() => import('./AdminInventory.js'))
const AdminUsers = React.lazy(() => import('./AdminUsers.js'))
const AdminClasses = React.lazy(() => import('./AdminClasses.js'))
const AdminCreateClass = React.lazy(() => import('./AdminCreateClass.js'))
const Profile = React.lazy(() => import('../Profile.js'))

const AdminSpecialties = React.lazy(() => import('./AdminSpecialties.js'))

const routes = [
  { path: 'main', name: 'Dashboard Admin', element: AdminMain},
  { path: 'inventory', name: 'Inventory Admin', element: AdminInventory},
  { path: 'users', name: 'Users', element: AdminUsers},
  { path: 'classes', name: 'Admin Classes', element: AdminClasses},
  { path: 'create', name: 'Admin Create Classes', element: AdminCreateClass},
  { path: 'profile', name: 'Admin Profile', element: Profile},
  { path: 'specialties', name: 'Admin Specialties', element: AdminSpecialties}
]

export default routes