import { useState } from "react"
import { supabase } from "../services/supabase"
import "./Login.css"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSignUp, setIsSignUp] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        alert("¡Revisa tu email para confirmar tu cuenta!")
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>🏢 SOGEI.IA</h1>
          <p>Sistema Operativo de Gestión Empresarial Inteligente</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? "Cargando..." : isSignUp ? "Registrarse" : "Iniciar Sesión"}
          </button>
        </form>

        <div className="toggle-auth">
          {isSignUp ? (
            <>
              ¿Ya tienes cuenta?{" "}
              <button onClick={() => setIsSignUp(false)}>Inicia sesión</button>
            </>
          ) : (
            <>
              ¿No tienes cuenta?{" "}
              <button onClick={() => setIsSignUp(true)}>Regístrate</button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
