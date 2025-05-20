import React, { useState } from 'react';
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
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPencil, cilTrash, cilWarning, cilPlus } from '@coreui/icons';

const AdminInventory = () => {
  const [inventoryData, setInventoryData] = useState([
    { id: 1, item: 'Laptop HP EliteBook', stock: 15, minStock: 10, status: 'In Stock' },
    { id: 2, item: 'Silla Ergonómica', stock: 8, minStock: 15, status: 'Low Stock' },
    { id: 3, item: 'Proyector Epson', stock: 3, minStock: 5, status: 'Critical' },
    { id: 4, item: 'Kit de Laboratorio', stock: 22, minStock: 10, status: 'In Stock' },
    { id: 5, item: 'Tabletas Gráficas', stock: 0, minStock: 5, status: 'Out of Stock' },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [currentItem, setCurrentItem] = useState({
    id: null,
    item: '',
    stock: 0,
    minStock: 0,
    status: 'In Stock'
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'In Stock': return 'success';
      case 'Low Stock': return 'warning';
      case 'Critical': return 'danger';
      case 'Out of Stock': return 'secondary';
      default: return 'secondary';
    }
  }

  const updateStockStatus = (stock, minStock) => {
    if (stock === 0) return 'Out of Stock';
    if (stock < minStock * 0.25) return 'Critical';
    if (stock < minStock) return 'Low Stock';
    return 'In Stock';
  }

  const handleSave = () => {
    if (!currentItem.item.trim()) {
      alert('El nombre del ítem es requerido');
      return;
    }

    const updatedItem = {
      ...currentItem,
      stock: Number(currentItem.stock),
      minStock: Number(currentItem.minStock),
      status: updateStockStatus(currentItem.stock, currentItem.minStock)
    };

    setInventoryData(prev => {
      if (currentItem.id) {
        return prev.map(item => item.id === currentItem.id ? updatedItem : item);
      }
      return [...prev, { ...updatedItem, id: Math.max(...prev.map(i => i.id)) + 1 }];
    });
    
    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de eliminar este ítem?')) {
      setInventoryData(prev => prev.filter(item => item.id !== id));
    }
  }

  return (
    <CCard className="mb-4">
      <CCardHeader className="d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Gestión de Inventario</h5>
        <CButton color="primary" size="sm" onClick={() => {
          setCurrentItem({
            id: null,
            item: '',
            stock: 0,
            minStock: 0,
            status: 'In Stock'
          });
          setShowModal(true);
        }}>
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
                <CTableDataCell>{item.item}</CTableDataCell>
                <CTableDataCell>
                  {item.stock}
                </CTableDataCell>
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
                      setCurrentItem(item);
                      setShowModal(true);
                    }}
                  >
                    <CIcon icon={cilPencil} />
                  </CButton>
                  <CButton 
                    color="danger" 
                    size="sm"
                    onClick={() => handleDelete(item.id)}
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
            <CButton color="secondary" onClick={() => setShowModal(false)}>
              Cancelar
            </CButton>
            <CButton color="primary" onClick={handleSave}>
              {currentItem.id ? 'Guardar Cambios' : 'Crear Ítem'}
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

export default AdminInventory;