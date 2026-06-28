import { useState } from "react"
import type { Organizacion } from "../types"
import "./ListaEmpresas.css"

interface ListaEmpresasProps {
  empresas: Organizacion[]
  onRefresh: () => void
}

export default function ListaEmpresas({ empresas, onRefresh }: ListaEmpresasProps) {
  const [selectedEmpresa, setSelectedEmpresa] = useState<Organizacion | null>(null)

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (empresas.length === 0) {
    return (
      <div className="no-empresas">
        <p>📭 No tienes empresas creadas aún</p>
        <p>Crea tu primera empresa para comenzar</p>
      </div>
    )
  }

  return (
    <div className="lista-empresas">
      <div className="empresas-table">
        <div className="table-header">
          <div className="col-nombre">Empresa</div>
          <div className="col-plan">Plan</div>
          <div className="col-estado">Estado</div>
          <div className="col-fecha">Fecha</div>
          <div className="col-acciones">Acciones</div>
        </div>

        {empresas.map((empresa) => (
          <div key={empresa.id} className="table-row">
            <div className="col-nombre">
              <div className="empresa-info">
                <h4>{empresa.nombre}</h4>
                <p>{empresa.email}</p>
              </div>
            </div>
            <div className="col-plan">
              <span className="badge badge-{empresa.plan}">
                {empresa.plan}
              </span>
            </div>
            <div className="col-estado">
              <span className="badge badge-{empresa.estado}">
                {empresa.estado}
              </span>
            </div>
            <div className="col-fecha">
              {formatDate(empresa.fecha_creacion)}
            </div>
            <div className="col-acciones">
              <button
                onClick={() => setSelectedEmpresa(empresa)}
                className="btn-detalles"
              >
                Detalles
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedEmpresa && (
        <div className="modal-overlay" onClick={() => setSelectedEmpresa(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedEmpresa.nombre}</h2>
              <button
                onClick={() => setSelectedEmpresa(null)}
                className="close-btn"
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div className="detail-group">
                <label>Email</label>
                <p>{selectedEmpresa.email}</p>
              </div>
              <div className="detail-group">
                <label>Plan</label>
                <p>{selectedEmpresa.plan}</p>
              </div>
              <div className="detail-group">
                <label>Estado</label>
                <p>{selectedEmpresa.estado}</p>
              </div>
              <div className="detail-group">
                <label>Descripción</label>
                <p>{selectedEmpresa.descripcion || "Sin descripción"}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
