import { notFound, useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Profesor, Votacion } from '@/lib/types'

export default function DashboardPage() {
  const { data: { user } } = supabase.auth.getUser()
  if (!user) {
    // Redirigir al login si no hay sesión
    // window.location.href = '/auth/login'
    return null
  }

  const [votaciones, setVotaciones] = useState<Votacion[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Cargar votaciones del profesor
  useEffect(() => {
    fetchVotaciones()
  }, [])

  const fetchVotaciones = async () => {
    try {
      const { data, error } = await supabase
        .from('votaciones')
        .select(`
          *,
          opciones:opciones_votacion(*)`,
        )
        .eq('profesor_id', user.id)
        .order('creado_en', { ascending: false })

      if (error) throw error
      setVotaciones(data || [])
    } catch (e: any) {
      setError(e.message)
    } finally {
      setCargando(false)
    }
  }

  const crearVotacion = async (datos: {
    titulo: string
    pregunta: string
    descripcion: string
    tipo: 'unica' | 'multiple'
    opciones: string[]
    fecha_inicio: Date
    fecha_cierre: Date
    mostrar_otro: boolean
  }) => {
    try {
      const { error } = await supabase
        .from('votaciones')
        .insert({
          profesor_id: user.id,
          titulo: datos.titulo,
          pregunta: datos.pregunta,
          descripcion: datos.descripcion,
          tipo: datos.tipo,
          fecha_inicio: datos.fecha_inicio.toISOString(),
          fecha_cierre: datos.fecha_cierre.toISOString(),
          activa: true,
          mostrar_otro: datos.mostrar_otro,
        })

      if (error) throw error
      await fetchVotaciones()
      return true
    } catch (e: any) {
      throw e
    }
  }

  const eliminarVotacion = async (id: string) => {
    try {
      // Primero eliminar opciones y votos asociados
      await supabase.from('opciones_votacion').delete().eq('votacion_id', id)
      await supabase.from('votos').delete().eq('votacion_id', id)
      
      // Luego eliminar la votación
      const { error } = await supabase.from('votaciones').delete().eq('id', id)
      if (error) throw error
      await fetchVotaciones()
    } catch (e: any) {
      throw e
    }
  }

  const cerrarVotacion = async (id: string) => {
    try {
      const { error } = await supabase
        .from('votaciones')
        .update({ activa: false })
        .eq('id', id)
      if (error) throw error
      await fetchVotaciones()
    } catch (e: any) {
      throw e
    }
  }

  if (cargando) {
    return (
      <div className="min-h-screen bg-white p-8">
        <div className="animate-spin rounded-full border-4 border-padel-blue border-t-transparent h-8 w-8"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white p-8">
        <p className="text-red-600">Error: {error}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-padel-dark">
            Panel de Control
          </h1>
          <p className="text-padel-gray mt-1">
            Gestiona tus votaciones de pádel
          </p>
        </header>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-padel-blue/10 border-l-4 border-panel-blue p-6 rounded-xl">
            <div className="text-3xl font-bold text-panel-blue">{votaciones.length}</div>
            <div className="text-sm text-panel-gray">Votaciones creadas</div>
          </div>
          <div className="bg-panel-green/10 border-l-4 border-panel-green p-6 rounded-xl">
            <div className="text-3xl font-bold text-panel-green">{votaciones.filter(v => v.activa).length}</div>
            <div className="text-sm text-panel-gray">Activas</div>
          </div>
          <div className="bg-panel-gray/10 border-l-4 border-panel-gray p-6 rounded-xl">
            <div className="text-3xl font-bold text-panel-gray">{votaciones.filter(v => !v.activa).length}</div>
            <div className="text-sm text-panel-gray">Finalizadas</div>
          </div>
        </div>

        {/* Lista de votaciones */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {votaciones.map((votacion) => (
            <div
              key={votacion.id}
              className="bg-panel-gray/10 border-l-4 border-panel-blue rounded-xl p-6 hover:border-panel-blue transition-colors"
            >
              <h3 className="text-xl font-medium text-panel-dark mb-2">
                {votacion.titulo}
              </h3>
              <p className="text-sm text-panel-gray mb-3">
                {votacion.pregunta}
              </p>
              <div className="flex flex-wrap gap-2">
                {votacion.opciones.map((op) => (
                  <span
                    key={op.id}
                    className="bg-panel-blue/20 text-sm rounded px-2 py-1"
                  >
                    {op.texto}
                  </span>
                ))}
              </div>
              <p className="text-xs text-panel-gray">
                {new Date(votacion.fecha_inicio).toLocaleDateString()} -
                {votacion.fecha_cierre ? new Date(votacion.fecha_cierre).toLocaleDateString() : 'Sin fecha'}
              </p>
              <div className="mt-4 flex gap-2">
                <button
                  className="flex-1 bg-panel-blue text-white text-sm py-2 rounded hover:bg-panel-electric transition-colors"
                  onClick={() => window.location.href = `/votacion/${votacion.id}`}
                >
                  Ver resultados
                </button>
                {votacion.activa && (
                  <button
                    className="flex-1 bg-red-500 text-white text-sm py-2 rounded hover:bg-red-600 transition-colors"
                    onClick={() => cerrarVotacion(votacion.id)}
                  >
                    Cerrar
                  </button>
                )}
              </div>
            </div>
          ))}
          {votaciones.length === 0 && (
            <div className="col-span-full text-center py-12">
              <p className="text-panel-gray">No tienes votaciones aún</p>
              <p className="text-sm mt-2">
                Crea tu primera votación usando el formulario de abajo
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}