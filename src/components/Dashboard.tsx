import { useState, useEffect } from "react"
import type { User } from "@supabase/supabase-js"
import { organizacionesService } from "../services/supabase"
import CrearEmpresa from "./CrearEmpresa"
import ListaEmpresas from "./ListaEmpresas"
import type { Organizacion } from "../types"
import "./Dashboard.css"

interface DashboardProps {
  user: User
  onLogout: () => void
}

export default function Dashboard({ user, onLogout }: DashboardProps) {
  const [empresas, setEmpresas] = useState<Organizacion[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"dashboard" | "empresas" | "crear">("dashboard")

  useEffect(() => {
    cargarEmpresas()
  }, [])

  const cargarEmpresas = async () => {
    try {
      const { data, error } = await organizacionesService.getAll(user.id)
      if (error) throw error
      setEmpresas(data || [])
    } catch (error) {
      console.error("Error al cargar empresas:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleEmpresaCreada = () => {
    cargarEmpresas()
    setActiveTab("empresas")
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-left">
          <h1>🏢 SOGEI.IA</h1>
          <p>Bienvenido, {user.email}</p>
        </div>
        <button onClick={onLogout} className="logout-btn">
          Cerrar Sesión
        </button>
      </header>

      <nav className="dashboard-nav">
        <button
          className={activeTab === "dashboard" ? "active" : ""}
          onClick={() => setActiveTab("dashboard")}
        >
          📊 Dashboard
        </button>
        <button
          className={activeTab === "empresas" ? "active" : ""}
          onClick={() => setActiveTab("empresas")}
        >
          🏢 Mis Empresas ({empresas.length})
        </button>
        <button
          className={activeTab === "crear" ? "active" : ""}
          onClick={() => setActiveTab("crear")}
        >
          ➕ Crear Empresa
        </button>
      </nav>

      <main className="dashboard-content">
        {activeTab === "dashboard" && (
          <section className="section-dashboard">
            <h2>Panel de Control</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-value">{empresas.length}</div>
                <div className="stat-label">Empresas</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{empresas.filter(e => e.estado === "activa").length}</div>
                <div className="stat-label">Activas</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">3</div>
                <div className="stat-label">Usuarios</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">100%</div>
                <div className="stat-label">Disponibilidad</div>
              </div>
            </div>
          </section>
        )}

        {activeTab === "empresas" && (
          <section className="section-empresas">
            <h2>Mis Empresas</h2>
            {loading ? (
              <div className="loading">Cargando empresas...</div>
            ) : (
              <ListaEmpresas empresas={empresas} onRefresh={cargarEmpresas} />
            )}
          </section>
        )}

        {activeTab === "crear" && (
          <section className="section-crear">
            <h2>Crear Nueva Empresa</h2>
            <CrearEmpresa userId={user.id} onSuccess={handleEmpresaCreada} />
          </section>
        )}
      </main>
    </div>
  )
}
