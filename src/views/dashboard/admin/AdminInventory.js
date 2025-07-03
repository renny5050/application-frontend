import React, { useState, useEffect } from 'react'
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CCard,
  CCardHeader,
  CCardBody,
  CBadge,
  CAlert,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormInput,
  CButton
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPencil, cilTrash, cilWarning, cilPlus } from '@coreui/icons'

const AdminInventory = () => {
  const [inventoryData, setInventoryData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [currentItem, setCurrentItem] = useState({
    id: null,
    item: '',
    stock: 0,
    minStock: 10,
    status: 'In Stock'
  })

  // Estados para mensajes
  const [submitting, setSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  // Obtener token desde localStorage
  const getToken = () => localStorage.getItem('authToken') || ''

  // Encabezados con token
  const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getToken()}`
  })

  // Fetch inventory desde API
  useEffect(() => {
    fetchInventory()
  }, [])

  const fetchInventory = async () => {
    try {
      setLoading(true)
      const response = await fetch('http://localhost:3002/api/item', {
        headers: getAuthHeaders()
      })

      if (!response.ok) {
        throw new Error('Error al cargar el inventario')
      }

      const data = await response.json()
      
      // Mapear datos del backend al formato del frontend
      setInventoryData(data.map(item => ({
        ...item,
        stock: item.quantity || item.stock,
        minStock: item.minQuantity || item.minStock || 10,
        status: calculateStatus(item.quantity, item.minQuantity || 10)
      })))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Funciones auxiliares
  const getStatusColor = (status) => {
    switch(status) {
      case 'In Stock': return 'success'
      case 'Low Stock': return 'warning'
      case 'Critical': return 'danger'
      case 'Out of Stock': return 'secondary'
      default: return 'secondary'
    }
  }

  const calculateStatus = (stock, minStock) => {
    if (stock === 0) return 'Out of Stock'
    if (stock < minStock * 0.25) return 'Critical'
    if (stock < minStock) return 'Low Stock'
    return 'In Stock'
  }

  // Operaciones CRUD
  const handleCreateItem = async (itemData) => {
    try {
      const response = await fetch('http://localhost:3002/api/item', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          name: itemData.item,
          quantity: parseInt(itemData.stock),
          minQuantity: parseInt(itemData.minStock)
        })
      })

      if (!response.ok) {
        if (response.status === 400) {
          const data = await response.json()
          throw new Error(data.errors?.[0]?.message || 'Datos inválidos')
        }
        throw new Error('Error al crear el ítem')
      }

      setSuccessMessage('Ítem creado exitosamente')
      fetchInventory()
    } catch (error) {
      setError(error.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleUpdateItem = async (itemData) => {
    try {
      const response = await fetch(`http://localhost:3002/api/item/${itemData.id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          name: itemData.item,
          quantity: parseInt(itemData.stock),
          minQuantity: parseInt(itemData.minStock)
        })
      })

      if (!response.ok) {
        if (response.status === 400) {
          const data = await response.json()
          throw new Error(data.errors?.[0]?.message || 'Datos inválidos')
        }
        throw new Error('Error al actualizar el ítem')
      }

      setSuccessMessage('Ítem actualizado exitosamente')
      fetchInventory()
    } catch (error) {
      setError(error.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteItem = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este ítem?')) return

    try {
      const response = await fetch(`http://localhost:3002/api/item/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      })

      if (!response.ok) throw new Error('Error al eliminar el ítem')
      
      setSuccessMessage('Ítem eliminado exitosamente')
      fetchInventory()
    } catch (error) {
      setError(error.message)
    }
  }

  const handleSave = () => {
    if (!currentItem.item.trim()) {
      setError('El nombre del ítem es requerido')
      return
    }

    setSubmitting(true)
    setSuccessMessage('')
    setError('')

    const updatedItem = {
      ...currentItem,
      stock: parseInt(currentItem.stock),
      minStock: parseInt(currentItem.minStock),
      status: calculateStatus(currentItem.stock, currentItem.minStock)
    }

    if (updatedItem.id) {
      handleUpdateItem(updatedItem)
    } else {
      handleCreateItem(updatedItem)
    }
    
    setShowModal(false)
  }

  // Renderizado
  if (loading) {
    return <CAlert color="info">Cargando inventario...</CAlert>
  }

  if (error) {
    return <CAlert color="danger">{error}</CAlert>
  }

  return (
    <CCard className="mb-4">
      <CCardHeader className="d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Gestión de Inventario</h5>
        <CButton 
          color="primary" 
          size="sm"
          onClick={() => {
            setCurrentItem({
              id: null,
              item: '',
              stock: 0,
              minStock: 10,
              status: 'In Stock'
            })
            setError('')
            setSuccessMessage('')
            setShowModal(true)
          }}
        >
          <CIcon icon={cilPlus} className="me-2" />
          Nuevo Ítem
        </CButton>
      </CCardHeader>
      
      <CCardBody>
        <CTable hover responsive>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>ID</CTableHeaderCell>
              <CTableHeaderCell>Ítem</CTableHeaderCell>
              <CTableHeaderCell>Stock</CTableHeaderCell>
              <CTableHeaderCell>Estado</CTableHeaderCell>
              <CTableHeaderCell>Acciones</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {inventoryData.map((item) => (
              <CTableRow key={item.id}>
                <CTableDataCell>{item.id}</CTableDataCell>
                <CTableDataCell>{item.name || item.item}</CTableDataCell>
                <CTableDataCell>{item.stock}</CTableDataCell>
                <CTableDataCell>
                  <CBadge color={getStatusColor(item.status)}>
                    {item.status}
                  </CBadge>
                </CTableDataCell>
                <CTableDataCell>
                  <CButton 
                    color="primary" 
                    size="sm" 
                    className="me-2"
                    onClick={() => {
                      setCurrentItem({
                        id: item.id,
                        item: item.name || item.item,
                        stock: item.stock,
                        minStock: item.minStock || 10,
                        status: item.status
                      })
                      setError('')
                      setSuccessMessage('')
                      setShowModal(true)
                    }}
                  >
                    <CIcon icon={cilPencil} />
                  </CButton>
                  <CButton 
                    color="danger" 
                    size="sm"
                    onClick={() => handleDeleteItem(item.id)}
                  >
                    <CIcon icon={cilTrash} />
                  </CButton>
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>

        {/* Modal de edición */}
        <CModal visible={showModal} onClose={() => setShowModal(false)}>
          <CModalHeader>
            <CModalTitle>
              {currentItem.id ? 'Editar Ítem' : 'Nuevo Ítem'}
            </CModalTitle>
          </CModalHeader>
          <CModalBody>
            {error && <CAlert color="danger">{error}</CAlert>}
            {successMessage && <CAlert color="success">{successMessage}</CAlert>}
            
            <div className="mb-3">
              <CFormInput
                label="Nombre del ítem"
                value={currentItem.item}
                onChange={(e) => setCurrentItem(prev => ({
                  ...prev,
                  item: e.target.value
                }))}
              />
            </div>
            
            <div className="row g-3">
              <div className="col-6">
                <CFormInput
                  type="number"
                  label="Stock actual"
                  value={currentItem.stock}
                  min="0"
                  onChange={(e) => setCurrentItem(prev => ({
                    ...prev,
                    stock: e.target.value
                  }))}
                />
              </div>
              <div className="col-6">
                <CFormInput
                  type="number"
                  label="Stock mínimo"
                  value={currentItem.minStock}
                  min="0"
                  onChange={(e) => setCurrentItem(prev => ({
                    ...prev,
                    minStock: e.target.value
                  }))}
                />
              </div>
            </div>
          </CModalBody>
          <CModalFooter>
            <CButton 
              color="secondary" 
              onClick={() => setShowModal(false)}
              disabled={submitting}
            >
              Cancelar
            </CButton>
            <CButton 
              color="primary" 
              onClick={handleSave}
              disabled={submitting}
            >
              {submitting ? 'Guardando...' : currentItem.id ? 'Guardar Cambios' : 'Crear Ítem'}
            </CButton>
          </CModalFooter>
        </CModal>

        <CAlert color="warning" className="mt-3">
          <CIcon icon={cilWarning} className="me-2" />
          {inventoryData.filter(i => i.status === 'Critical').length} ítems en estado crítico
        </CAlert>
      </CCardBody>
    </CCard>
  )
}

export default AdminInventory