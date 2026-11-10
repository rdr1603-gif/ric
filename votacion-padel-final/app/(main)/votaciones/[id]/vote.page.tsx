import { useParams, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Votacion } from '@/lib/types'

export default function VotePage() {
  const { id } = useParams()
  const votacionId = id as string

  if (!votacionId) {
    // window.location.href = '/'
    return null
  }

  const [votacion, setVotacion] = useState<Votacion | null>(null)
  const [mensaje, setMensaje] = useState<string | null>(null)
  const [mostrandoResultado, setMostrandoResultado] = useState(false)

  // Cargar votación
  useEffect(() => {
    cargarVotacion()
  }, [])

  const cargarVotacion = async () => {
    try {
      const { data, error } = await supabase
        .from('votaciones')
        .select('*')
        .eq('id', votacionId)
        .single()

      if (error) throw error
      setVotacion(data)
    } catch (e: any) {
      console.error(e)
    }
  }

  // Verificar si la votación está activa
  useEffect(() => {
    if (!votacion) return

    const verificarEstado = () => {
      const ahora = new Date()
      const inicio = votacion.fecha_inicio ? new Date(votacion.fecha_inicio) : null
      const cierre = votacion.fecha_cierre ? new Date(votacion.fecha_cierre) : null

      // Si tiene fecha de inicio y es futura, no está activa aún
      if (inicio && ahora < inicio) {
        setMensaje('Esta votación aún no ha comenzado')
        return
      }

      // Si tiene fecha de cierre y ya pasó, está cerrada
      if (cierre && ahora >= cierre) {
        setMensaje('La votación ha finalizado')
        return
      }

      setMensaje(null)
    }

    verificarEstado()
    const interval = setInterval(verificarEstado, 30000)
    return () => clearInterval(interval)
  }, [votacion])

  if (!votacion) {
    return (
      <div className="min-h-screen bg-white p-8 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-panel-dark mb-4">
            Votación
          </h2>
          <p className="text-panel-gray">Cargando votación...</p>
        </div>
      </div>
    )
  }

  // Verificar estado actual
  const ahora = new Date()
  const inicio = votacion.fecha_inicio ? new Date(votacion.fecha_inicio) : null
  const cierre = votacion.fecha_cierre ? new Date(votacion.fecha_cierre) : null
  const estaActiva = inicio ? ahora >= inicio : true
  const estaCerrada = cierre ? ahora >= cierre : false

  if (!estaActiva && !mensaje) {
    return (
      <div className="min-h-screen bg-white p-8">
        <div className="bg-red-100/30 border-l-4 border-red-500 p-6 rounded-xl text-center">
          <h3 className="text-red-400 mb-2">
            Votación finalizada
          </h3>
          <p className="text-panel-gray">
            Esta votación ha finalizado y ya no recibe votos.
          </p>
        </div>
      </div>
    )
  }

  // Manejar el voto
  const manejarVoto = async (opcionId: string | null) => {
    try {
      const { error } = await supabase.from('votos').insert({
        votacion_id: votacionId,
        opcion_id: opcionId,
        // codigo_acceso se deja null para votación anónima por enlace único
      })

      if (error) throw error

      setMensaje('¡Gracias por participar! Tu voto fue registrado correctamente')
      setMostrandoResultado(true)

      // Pequeña pausa para ver el mensaje, luego redirigir
      setTimeout(() => {
        // window.location.href = '/'
      }, 3000)
    } catch (e: any) {
      console.error(e)
      setMensaje('Error al registrar tu voto. Inténtalo de nuevo.')
    }
  }

  if (mensaje) {
    return (
      <div className="min-h-screen bg-white p-8 flex flex-col items-center justify-center">
        <div className="bg-panel-green/10 border-l-4 border-panel-green p-8 rounded-xl text-center max-w-md">
          <h2 className="text-3xl font-bold text-panel-green mb-4">
            ¡Gracias por participar!
          </h2>
          <p className="text-panel-gray mb-6">{mensaje}</p>
          <button
            onClick={() => {/* window.location.href = '/' */}}
            className="bg-panel-blue text-white font-medium py-3 rounded hover:bg-panel-electric transition-colors"
          >
            Vol al inicio
          </button>
        </div>
      </div>
    )
  }

  if (!estaActiva) {
    return (
      <div className="min-h-screen bg-white p-8">
        <div className="bg-panel-gray/10 border-l-4 border-panel-gray p-6 rounded-xl text-center">
          <h3 className="text-panel-gray mb-4">
            Esta votación no está activa actualmente
          </h3>
          <p className="text-panel-gray">
            La votación comenzará {inicio ? 'el ' + inicio.toLocaleDateString() : ''}
            {cierre ? ' y terminará ' + cierre.toLocaleDateString() : ''}.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-3xl mx-auto">
        
        {/* Información de la votación */}
        <div className="mb-8 p-6 bg-panel-gray/10 rounded-xl">
          <h2 className="text-2xl font-bold text-panel-dark mb-2">
            {votacion.titulo}
          </h2>
          <p className="text-panel-gray mb-4">
            {votacion.pregunta}
          </p>
          {votacion.descripcion && (
            <p className="text-sm text-panel-gray mb-6">
              {votacion.descripcion}
            </p>
          )}
          
          {/* Mostrar temporizador o estado */}
          {votacion.fecha_inicio && votacion.fecha_cierre ? (
            <div className="grid grid-cols-2 gap-2 text-sm mb-4">
              <div>
                <span className="font-medium text-panel-gray">Inicia:</span>
                {new Date(votacion.fecha_inicio).toLocaleDateString()} {new Date(votacion.fecha_inicio).toLocaleTimeString()}
              </div>
              <div>
                <span className="font-medium text-panel-gray">Cierra:</span>
                {new Date(votacion.fecha_cierre).toLocaleDateString()} {new Date(votacion.fecha_cierre).toLocaleTimeString()}
              </div>
            </div>
          ) : null}
        </div>

        {/* Formulario de voto */}
        {estaActiva ? (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              const seleccion = document.querySelector(
                'input[name="opcion"]:checked'
              ) as HTMLInputElement
              manejarVoto(seleccion ? seleccion.value : null)
            }}
            className="space-y-4"
          >
            <div>
              {/* Pregunta */}
              <p className="text-panel-gray mb-4 flex items-center gap-2">
                <svg 
                  className="h-5 w-5 text-panel-blue" 
                  fill="none" 
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLineCap="round" 
                    strokeLineJoin="round" 
                    strokeWidth={2} 
                    d="M13 10V3L4 21h7v7l6-5z"
                  />
                </svg>
                {votacion.pregunta}
              </p>

              {/* Opciones de respuesta */}
              <div className="grid grid-cols-2 gap-3">
                {votacion.opciones.map((op) => (
                  <div key={op.id} className="flex flex-col items-start rounded border panel-blue/20 p-4 hover:border-panel-blue transition-colors">
                    <input
                      type="radio"
                      name="opcion"
                      value={op.id}
                      className="radio-internal rounded border-panel-blue w-4 h-4 focus:ring-panel-blue cursor-pointer"
                    />
                    <span className="ml-3 text-panel-dark text-base line-clamp-1 w-full">
                      {op.texto}
                    </span>
                  </div>
                ))}
              </div>

              {/* Opcional: "Otro" */}
              {votacion.mostrar_otro && (
                <div className="mt-4 pt-4 border-t panel-gray">
                  <label className="text-sm text-panel-gray">
                    Otra opción:
                    <input
                      type="text"
                      className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white placeholder-white/40 focus:outline-none focus:border-panel-blue mt-1"
                      placeholder="Escribe tu opción..."
                    />
                  </label>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={false}
              className="w-full bg-panel-blue text-white font-medium py-3 rounded hover:bg-panel-electric transition-colors"
            >
              ENVIAR MI VOTO
            </button>
          </form>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-panel-gray mb-4">
              Esta votación no está activa
            </h3>
            <p className="text-panel-gray">
              La votación ha finalizado o aún no ha comenzado.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}