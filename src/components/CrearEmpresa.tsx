import { useState } from "react"
import { organizacionesService, auditoriaService } from "../services/supabase"
import "./CrearEmpresa.css"

interface CrearEmpresaProps {
  userId: string
  onSuccess: () => void
}

export default function CrearEmpresa({ userId, onSuccess }: CrearEmpresaProps) {
  const [nombre, setNombre] = useState("")
  const [email, setEmail] = useState("")
  const [descripcion, setDescripcion] = useState("")
  const [plan, setPlan] = useState<"gratuito" | "profesional" | "empresarial">("gratuito")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      if (!nombre.trim()) {
        throw new Error("El nombre de la empresa es requerido")
      }

      if (!email.trim()) {
        throw new Error("El email es requerido")
      }

      const nuevaEmpresa = {
        nombre: nombre.trim(),
        email: email.trim(),
        descripcion: descripcion.trim(),
        plan,
        estado: "activa",
        owner_id: userId,
        fecha_creacion: new Date().toISOString(),
      }

      const { data, error: createError } = await organizacionesService.create(nuevaEmpresa)

      if (createError) throw createError

      if (data && data.length > 0) {
        const empresaId = data[0].id

        await auditoriaService.log({
          usuario_id: userId,
          organizacion_id: empresaId,
          accion: "CREAR_EMPRESA",
          tabla: "organizaciones",
          registro_id: empresaId,
          cambios: nuevaEmpresa,
          fecha: new Date().toISOString(),
        })

        setSuccess(true)
        setNombre("")
        setEmail("")
        setDescripcion("")
        setPlan("gratuito")

        setTimeout(() => {
          onSuccess()
        }, 1500)
      }
    } catch (err: any) {
      setError(err.message || "Error al crear la empresa")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="crear-empresa-container">
      {success && (
        <div className="success-message">
          ✅ ¡Empresa creada exitosamente!
        </div>
      )}

      {error && (
        <div className="error-message">
          ❌ {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="crear-form">
        <div className="form-group">
          <label htmlFor="nombre">Nombre de la Empresa *</label>
          <input
            id="nombre"
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej: Mi Empresa S.A.S"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email de Contacto *</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="empresa@example.com"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="descripcion">Descripción</label>
          <textarea
            id="descripcion"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Breve descripción de tu empresa..."
            rows={4}
          />
        </div>

        <div className="form-group">
          <label htmlFor="plan">Plan de Suscripción</label>
          <select
            id="plan"
            value={plan}
            onChange={(e) => setPlan(e.target.value as any)}
          >
            <option value="gratuito">Gratuito</option>
            <option value="profesional">Profesional</option>
            <option value="empresarial">Empresarial</option>
          </select>
        </div>

        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? "⏳ Creando..." : "✨ Crear Empresa"}
        </button>
      </form>
    </div>
  )
}
