import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth'

export default function AccountPage() {
  const { usuario, iniciarSesion, cerrarSesion, actualizarPerfil } = useAuth()
  const [nombre, setNombre] = useState<string>('')
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Inicializar nombre del usuario
  useEffect(() => {
    if (usuario) {
      setNombre(usuario.nombre || usuario.email!.split('@')[0])
    }
  }, [usuario])

  const manejarCambiarNombre = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setCargando(true)
    try {
      await actualizarPerfil(nombre)
      setError(null)
    } catch (e: any) {
      setError(e.message || 'Error al actualizar el perfil')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-md mx-auto">
        {usuario ? (
          <div>
            <h1 className="text-2xl font-bold text-panel-dark mb-6">
              Configuración deCuenta
            </h1>

            {/* Perfil */}
            <div className="bg-panel-gray/10 rounded-2xl p-6 mb-8">
              <h3 className="text-xl font-medium text-panel-dark mb-4">
                Mi perfil
              </h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-panel-gray mb-1">
                    Nombre
                  </label>
                  <input
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    readOnly
                    className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-panel-blue"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-panel-gray mb-1">
                    Correo
                  </label>
                  <input
                    value={usuario.email || ''}
                    readOnly
                    className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-panel-blue"
                  />
                </div>
              </div>
            </div>

            {/* Cambiar contraseña */}
            <div className="bg-panel-gray/10 rounded-2xl p-6 mb-8">
              <h3 className="text-xl font-medium text-panel-dark mb-4">
                Cambiar contraseña
              </h3>
              <p className="text-panel-gray mb-4">
                Ingresá tu nueva contraseña para actualizar la seguridad de tu cuenta.
              </p>
              
              <form onSubmit={manejarCambiarNombre} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-panel-gray mb-1">
                    Nueva contraseña
                  </label>
                  <input
                    type="password"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-panel-blue"
                    placeholder="Ingresá tu nueva contraseña"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-panel-gray mb-1">
                    Confirmar contraseña
                  </label>
                  <input
                    type="password"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-panel-blue"
                    placeholder="Confirmá tu nueva contraseña"
                  />
                </div>
                <button
                  type="submit"
                  disabled={cargando}
                  className="w-full bg-panel-blue text-white font-medium py-3 rounded hover:bg-panel-electric transition-colors disabled:opacity-50"
                >
                  {cargando ? 'Actualizando...' : 'Guardar cambios'}
                </button>
              </form>
            </div>

            {/* Cerrar sesión */}
            <div className="bg-red-100/30 border-l-4 border-red-500 rounded-xl p-6 text-center">
              <button
                onClick={cerrarSesion}
                className="w-full bg-red-500 text-white font-medium py-3 rounded hover:bg-red-600 transition-colors"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        ) : (
          <p className="text-center text-panel-gray py-12">
            Iniciá sesión para acceder a tu cuenta
          </p>
        )}
      </div>
    </div>
  )
}