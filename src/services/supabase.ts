import { createClient } from "@supabase/supabase-js"

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Variables de entorno de Supabase no configuradas")
}

export@'
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Variables de entorno de Supabase no configuradas")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const auth = {
  signUp: async (email: string, password: string) => {
    return await supabase.auth.signUp({ email, password })
  },
  signIn: async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({ email, password })
  },
  signOut: async () => {
    return await supabase.auth.signOut()
  },
  getSession: async () => {
    return await supabase.auth.getSession()
  }
}

export const organizacionesService = {
  create: async (data: any) => {
    return await supabase.from("organizaciones").insert([data]).select()
  },
  getAll: async (userId: string) => {
    return await supabase.from("organizaciones").select("*").eq("owner_id", userId)
  },
  getById: async (id: string) => {
    return await supabase.from("organizaciones").select("*").eq("id", id).single()
  },
  update: async (id: string, data: any) => {
    return await supabase.from("organizaciones").update(data).eq("id", id).select()
  },
  delete: async (id: string) => {
    return await supabase.from("organizaciones").delete().eq("id", id)
  }
}

export const auditoriaService = {
  log: async (data: any) => {
    return await supabase.from("auditoria").insert([data])
  },
  getByOrganizacion: async (orgId: string) => {
    return await supabase.from("auditoria").select("*").eq("organizacion_id", orgId).order("fecha", { ascending: false })
  }
}
