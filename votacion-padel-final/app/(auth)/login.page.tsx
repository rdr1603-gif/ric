import { useState } from 'react'
import { useAuth } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [registrarse, setRegistrarse] = useState(false)
  const { iniciarSesion, cerrarSesion, usuario, cargando } = useAuth()

  // Verificar si ya hay sesión
  useEffect(() => {
    if (usuario) {
      // Ya está logueado, ir al dashboard
      // window.location.href = '/dashboard'
    }
  }, [usuario])

  const manejarSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      await iniciarSesion(email, password)
    } catch (e: any) {
      setError(e.message || 'Error al iniciar sesión')
    }
  }

  if (usuario) {
    return null // Ya está autenticado, no mostrar login
  }

  return (
    <div className="min-h-screen bg-padel-dark text-white p-8 flex items-center justify-center">
      <div className="bg-padel-blue/20 rounded-2xl p-8 max-w-md w-full border border-padel-blue/30">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {registrarse ? 'Crear cuenta' : 'Iniciar sesión'}
        </h2>
        
        {error && (
          <div className="bg-red-100/30 border-l-4 border-red-500 text-red-400 p-4 rounded mb-6">
            {error}
          </div>
        )}

        <form onSubmit={manejarSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2" htmlFor="email">
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-padel-electric"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" htmlFor="password">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-padel-electric"
            />
          </div>

          {registrarse ? (
            <div className="text-center text-sm">
              ¿No tienes cuenta? <a href="#" className="underline cursor-pointer" onClick={() => setRegistrarse(false)}>Iniciar sesión</a>
            </div>
          ) : (
            <div className="text-center text-sm">
              No tienes cuenta? <a href="#" className="underline cursor-pointer" onClick={() => setRegistrarse(true)}>Regístrate</a>
            </div>
          )}

          <button
            type="submit"
            disabled={cargando}
            className="w-full bg-padel-blue hover:bg-padel-electric text-white font-medium py-3 rounded transition-colors disabled:opacity-50"
          >
            {cargando ? 'Iniciando sesión...' : (registrarse ? 'Crear cuenta' : 'Entrar')}
          </button>
        </form>
      </div>
    </div>
  )
}