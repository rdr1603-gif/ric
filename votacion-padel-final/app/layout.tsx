import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Votación Pádel",
  description: "Votaciones anónimas para profesores y alumnos de pádel",
};

// Importar useAuth después de definir metadata
import { useAuth } from '@/lib/auth';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const { usuario, cargando, cerrarSesion } = useAuth();

  // Mientras se carga la sesión, mostramemos un loader
  if (cargando) {
    return (
      <html
        lang="en"
        className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      >
        <body className="min-h-full flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full border-4 border-padel-blue border-t-transparent h-8 w-8 mx-auto mb-4"></div>
          <p className="text-panel-gray">Cargando sesión...</p>
        </body>
      </html>
    );
  }

  // Si el usuario ya está autenticado, renderizar la aplicación principal
  if (usuario) {
    return (
      <html
        lang="en"
        className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      >
        <body className="min-h-full flex flex-col bg-white">
          {/* Header de navegación */}
          <header className="bg-padel-blue text-white border-b border-panel-gray/50">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <a
                  href="/"
                  className="font-bold text-lg hover:text-panel-gray transition-colors"
                >
                  <svg
                    className="h-6 w-6"
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
                  </path>
                  </svg>
                  Votación Pádel
                </a>
              </div>
              
              <div className="flex items-center gap-4">
                <span className="text-white/90 text-sm">
                  {usuario.email?.split('@')[0] || 'Profesor'}
                </span>
                <a
                  href="/account"
                  className="text-white/90 hover:text-white transition-colors text-sm"
                >
                  Mi cuenta
                </a>
                <button
                  onClick={cerrarSesion}
                  className="bg-panel-green text-white rounded px-4 py-2 text-sm hover:bg-green-400 transition-colors"
                >
                  Cerrar sesión
                </button>
              </div>
            </div>
          </header>

          {/* Contenido principal */}
          <main className="max-w-7xl mx-auto p-6">
            {children}
          </main>

          {/* Footer */}
          <footer className="mt-auto border-t panel-gray/50 py-6 text-center text-sm">
            <p className="text-panel-gray/60">
              Votación Pádel · Aplicación de votaciones anónimas para profesores de pádel
            </p>
          </footer>
        </body>
      </html>
    )
  }

  // Usuario no autenticado - renderizar login
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex items-center justify-center bg-padel-dark text-white min-h-screen">
        <div className="bg-panel-blue/20 rounded-2xl p-8 max-w-md w-full border border-panel-blue/30">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Votación Pádel
          </h2>
          <p className="text-panel-gray text-center mb-8">
            Iniciá sesión para acceder al panel de profesor
          </p>
          
          <div className="space-y-4">
            <form onSubmit={(e: React.FormEvent) => {
              e.preventDefault()
              const form = e.target as HTMLFormElement
              const email = form.elements.namedItem('email') as HTMLInputElement
              const password = form.elements.namedItem('password') as HTMLInputElement
              // Aquí iría el login logic
              window.location.href = '/'
            }}>
              <div>
                <label className="block text-sm font-medium mb-2">Correo electrónico</label>
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-panel-blue"
                  placeholder="tu@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Contraseña</label>
                <input
                  type="password"
                  name="password"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-panel-blue"
                  placeholder="Tu contraseña"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-panel-blue text-white font-medium py-3 rounded hover:bg-panel-electric transition-colors"
              >
                Entrar
              </button>
            </form>
            
            <p className="text-center text-sm text-panel-gray/60">
              No tenés cuenta? <a href="#" className="underline text-panel-blue/30 cursor-pointer">Regístrate</a>
            </p>
          </div>
        </div>
      </body>
    </html>
  )
}