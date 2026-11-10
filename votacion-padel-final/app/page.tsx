import { notWithContent } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth'

export default function HomePage() {
  const { usuario, cargando } = useAuth()

  // Verificar si ya hay sesión
  useEffect(() => {
    if (usuario) {
      // Ya está autenticado, redirigir al dashboard
      // window.location.href = '/dashboard'
    }
  }, [usuario])

  if (cargando) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full border-4 border-padel-blue border-t-transparent h-8 w-8 mx-auto mb-4"></div>
          <p className="text-panel-gray">Cargando sesión...</p>
        </div>
      </div>
    )
  }

  if (usuario) {
    // Ya está logueado, redirigir al dashboard
    // En un entorno real, usaríamos next/navigation
    // return <Redirect to="/dashboard" />
    return null
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto p-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-panel-dark">
            Votación Pádel
          </h1>
          <p className="text-panel-gray text-2xl mt-2">
            Votaciones anónimas para profesores de pádel
          </p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl">
          {/* Sección: Para Profesores */}
          <div className="bg-panel-gray/10 rounded-2xl p-6 border border-panel-gray/50 hover:border-panel-blue transition-colors">
            <div className="flex items-start gap-4">
              <div className="bg-panel-blue rounded-xl p-3 flex-shrink-0">
                <svg
                  className="h-6 w-6 text-panel-blue"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLineCap="round"
                    strokeLineJoin="round"
                    strokeWidth={2}
                    d="M12 6v6l4 4m4-4v6l4-4M6 12v6l-4 4M6 8v6l4 4M16 12a4 4 0 11-8 0 4 4 0 018 0m0-10a4 4 0 018 0 4 4 0 01-8 0zm10.477 5.227l-.778 2.135a2.5 2.5 0 01-1.781 1.042l-2.307.707a2.5 2.5 0 11-1.293-2.082l2.23-1.865.778-2.135a2.5 2.5 0 012.236 0zM21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="flex-1 pt-2">
                <h3 className="text-xl font-bold text-panel-dark">Profesores</h3>
                <p className="text-panel-gray">
                  Creá y gestioná tus votaciones de pádel. Iniciá sesión para acceder al panel privado.
                </p>
                <div className="mt-4">
                  <a
                    href="/auth/login"
                    className="bg-panel-blue text-white rounded px-4 py-2 hover:bg-panel-electric transition-colors"
                  >
                    Iniciar sesión
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Sección: Para Alumnos */}
          <div className="bg-panel-gray/10 rounded-2xl p-6 border border-panel-gray/50 hover:border-panel-blue transition-colors">
            <div className="flex items-start gap-4">
              <div className="bg-panel-green rounded-xl p-3 flex-shrink-0">
                <svg
                  className="h-6 w-6 text-panel-green"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLineCap="round"
                    strokeLineJoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                  <path
                    strokeLineCap="round"
                    strokeLineJoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v4M7 7h6v6M7 3h6v6M3 12h18M5 10h14l1.293-1.293c-.53-.53-1.287-.883-2.082-1.093m2.866 2.866a7.965 7.965 0 012.178-1.373c3.641-3.641 3.641-9.528 0-13.169a7.973 7.973 0 00-2.178-.825 7.966 7.966 0 00-5.59 2.057c-.589.589-1.253.94-2.082 1.093l-1.293.293a16.035 16.035 0 00.729 5.375 8.042 8.042 0 01.395 3.028c0 4.467 3.532 8.098 8.098 8.098z"
                  />
                </svg>
              </div>
              <div className="flex-1 pt-2">
                <h3 className="text-xl font-bold text-panel-dark">Alumnos</h3>
                <p className="text-panel-gray">
                  Participá en votaciones de tus profesores de pádel. Solo necesitás el enlace.
                </p>
                <div className="mt-4">
                  <p className="text-sm text-panel-gray mb-2">
                    Ingresá el enlace que te compartió tu profesor:
                  </p>
                  <div className="border border-panel-gray/50 rounded p-3 bg-white/5">
                    <input
                      type="text"
                      readOnly
                      className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white placeholder-white/40 focus:outline-none focus:border-panel-blue"
                      value="Ej: votacion-padel.vercel.app/v/123abc"
                      placeholder="Enlace de votación"
                    />
                    <button
                      className="mt-2 text-xs text-panel-blue hover:text-panel-electric underline cursor-pointer"
                    >
                      Compartir enlace
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Características clave */}
          <div className="lg:col-span-2 bg-panel-gray/10 rounded-2xl p-6 border border-panel-gray/50">
            <h3 className="text-xl font-bold text-panel-dark mb-4">
              Características
            </h3>
            <ul className="space-y-3 text-panel-gray">
              <li className="flex items-start gap-3">
                <svg
                  className="h-5 w-5 text-panel-green flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLineCap="round"
                    strokeLineJoin="round"
                    strokeWidth={2}
                    d="M5 13l13-6-13-6M5 7l13 6-13 6"
                  />
                </svg>
                <strong>Anonimato garantizado</strong>
                <p className="text-sm ml-3">
                  Tus respuestas nunca están vinculadas a tu identidad.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <svg
                  className="h-5 w-5 text-panel-green flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLineCap="round"
                    strokeLineJoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                  <path
                    strokeLineCap="round"
                    strokeLineJoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v4M7 7h6v6M7 3h6v6M3 12h18M5 10h14l1.293-1.293c-.53-.53-1.287-.883-2.082-1.093m2.866 2.866a7.965 7.965 0 012.178-1.373c3.641-3.641 3.641-9.528 0-13.169a7.973 7.973 0 00-2.178-.825 7.966 7.966 0 00-5.59 2.057c-.589.589-1.253.94-2.082 1.093l-1.293.293a16.035 16.035 0 00.729 5.375 8.042 8.042 0 01.395 3.028c0 4.467 3.532 8.098 8.098 8.098z"
                  />
                </svg>
                <strong>Fácil desde el celular</strong>
                <p className="text-sm ml-3">
                  Diseño responsive que funciona en cualquier dispositivo.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <svg
                  className="h-5 w-5 text-panel-green flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLineCap="round"
                    strokeLineJoin="round"
                    strokeWidth={2}
                    d="M12 6v6l4 4m4-4v6l4-4M6 12v6l-4 4M6 8v6l4 4M16 12a4 4 0 11-8 0 4 4 0 018 0m0-10a4 4 0 018 0 4 4 0 01-8 0zm10.477 5.227l-.778 2.135a2.5 2.5 0 01-1.781 1.042l-2.307.707a2.5 2.5 0 11-1.293-2.082l2.23-1.865.778-2.135a2.5 2.5 0 012.236 0z"
                  />
                </svg>
                <strong>Compartir por WhatsApp</strong>
                <p className="text-sm ml-3">
                  Generá un enlace y compartilo directamente con tus alumnos.
                </p>
              </li>
            </ul>
          </div>
        </main>

        <footer className="mt-8 pt-8 border-t panel-gray/50 text-center text-sm">
          <p className="text-panel-gray">
            Aplicación Votación Pádel · Versión 1.0
          </p>
        </footer>
      </div>
    </div>
  )
}