import { createClient } from '@supabase/supabase-js'
import { useEffect, useState, useCallback } from 'react'

// Crear cliente de Supabase - se inicializará cuando esté disponible
let supabase: ReturnType<typeof createClient> | null = null

// Función para inicializar el cliente (se llama desde el provider)
export const initSupabase = (url: string, key: string) => {
  supabase = createClient(url, key)
}

export const useAuth = () => {
  const [usuario, setUsuario] = useState<{ id: string; email: string; nombre: string } | null>(null)
  const [sesion, setSesion] = useState<{ access_token: string; refresh_token: string; expires_at: number } | null>(null)
  const [cargando, setCargando] = useState(true)

  // Cargar sesión inicial
  useEffect(() => {
    if (!supabase) return

    // Obtener sesión actual
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSesion(session)
      if (session) {
        setUsuario({
          id: session.user.id,
          email: session.user.email!,
          nombre: session.user.user_metadata?.nombre || session.user.email!.split('@')[0],
        })
      }
      setCargando(false)
    })
  }, [supabase])

  // Escuchar cambios de sesión
  useEffect(() => {
    if (!supabase) return

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSesion(session)
      if (session) {
        setUsuario({
          id: session.user.id,
          email: session.user.email!,
          nombre: session.user.user_metadata?.nombre || session.user.email!.split('@')[0],
        })
      } else {
        setUsuario(null)
      }
      setCargando(false)
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [supabase])

  const iniciarSesion = useCallback(async (email: string, password: string) => {
    if (!supabase) throw new Error('Supabase no inicializado')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }, [supabase])

  const cerrarSesion = useCallback(async () => {
    if (!supabase) return
    await supabase.auth.signOut()
    setUsuario(null)
    setSesion(null)
  }, [supabase])

  const actualizarPerfil = useCallback(async (nombre: string) => {
    if (!supabase) return
    const { error } = await supabase
      .from('profesores')
      .update({ nombre })
      .eq('id', usuario?.id)
    if (error) throw error
  }, [supabase, usuario?.id])

  return {
    usuario,
    sesion,
    cargando,
    iniciarSesion,
    cerrarSesion,
    actualizarPerfil,
  }
}