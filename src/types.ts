export interface Organizacion {
  id: string
  nombre: string
  email: string
  descripcion?: string
  plan: "gratuito" | "profesional" | "empresarial"
  estado: "activa" | "inactiva" | "suspendida"
  fecha_creacion: string
  owner_id: string
}

export interface Usuario {
  id: string
  email: string
  nombre: string
  rol: "admin" | "manager" | "usuario" | "auditor"
  organizacion_id: string
  estado: "activo" | "inactivo"
  fecha_creacion: string
}
