import { useParams, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Votacion, OpcionVotacion, ResultadoOpcion } from '@/lib/types'

export default function VotacionPage() {
  const { id } = useParams()
  const votacionId = id as string

  if (!votacionId) {
    notFound()
  }

  const [votacion, setVotacion] = useState<Votacion | null>(null)
  const [resultados, setResultados] = useState<{
    total_votos: number
    opciones: ResultadoOpcion[]
    opcion_mas_elegida: OpcionVotacion | null
    porcentaje_total: number
  } | null>(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mostrandoResultados, setMostrandoResultados] = useState(false)

  // Cargar votación
  useEffect(() => {
    cargarVotacion()
  }, [])

  const cargarVotacion = async () => {
    try {
      const { data, error } = await supabase
        .from('votaciones')
        .select(`
          *,
          opciones:opciones_votacion(*)`
        )
        .eq('id', votacionId)
        .single()

      if (error) throw error
      setVotacion(data)

      // Calcular resultados si hay votos
      if (data && data.activa) {
        await calcularResultados()
      } else {
        setResultados(null)
      }
    } catch (e: any) {
      setError(e.message)
      notFound()
    } finally {
      setCargando(false)
    }
  }

  const calcularResultados = async () => {
    try {
      // Obtener todos los votos para esta votación
      const { data: votos, error: votosError } = await supabase
        .from('votos')
        .select('opcion_id')
        .eq('votacion_id', votacionId)

      if (votosError) throw votosError

      const totalVotos = votos?.length || 0
      const mapaOpciones: Record<string, number> = {}

      // Contar votos por opción
      votos?.forEach((voto) => {
        const id = voto.opcion_id
        if (id) {
          mapaOpciones[id] = (mapaOpciones[id] || 0) + 1
        }
      })

      // Construir resultado de opciones
      const opciones: ResultadoOpcion[] = (data?.opciones || []).map((op) => {
        const votosOpcion = mapaOpciones[op.id] || 0
        const porcentaje = totalVotos > 0 ? Math.round((votosOpcion / totalVotos) * 100) : 0
        return {
          id: op.id,
          opcion_id: op.id,
          texto: op.texto,
          votos: votosOpcion,
          porcentaje,
        }
      })

      // Encontrar opción más elegida
      const opcionMasElegida = opciones.length > 0
        ? opciones.reduce((prev, actual) =>
            prev.votos > actual.votos ? prev : actual
          )
        : null

      setResultados({
        total_votos: totalVotos,
        opciones,
        opcion_mas_elegida,
        porcentaje_total: totalVotos > 0 ? 100 : 0,
      })
    } catch (e: any) {
      setError(e.message)
    }
  }

  // Votar (solo si la votación está activa)
  const votar = async (opcionId: string | null, codigoAcceso?: string) => {
    if (!votacion?.activa) return

    try {
      // Insertar voto anónimo
      const { error } = await supabase.from('votos').insert({
        votacion_id: votacionId,
        opcion_id: opcionId,
        codigo_acceso: codigoAcceso,
      })

      if (error) throw error
      
      // Actualizar resultados
      await calcularResultados()
      setMostrandoResultados(true)
    } catch (e: any) {
      throw e
    }
  }

  // Verificar si la votación está activa
  const estaActiva = votacion?.activa && 
    votacion.fecha_inicio 
    ? new Date() >= new Date(votacion.fecha_inicio)
    : false

  const estaCerrada = !estaActiva || (votacion.fecha_cierre && new Date() >= new Date(votacion.fecha_cierre))

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

  if (!votacion) {
    return (
      <div className="min-h-screen bg-white p-8">
        <p className="text-gray-600">Votación no encontrada</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Información de la votación */}
        <div className="mb-8 p-6 bg-panel-gray/10 rounded-xl">
          <h2 className="text-2xl font-bold text-panel-dark mb-2">
            {votacion.titulo}
          </h2>
          <p className="text-panel-gray mb-1">
            {votacion.pregunta}
          </p>
          {votacion.descripcion && (
            <p className="text-sm text-panel-gray mb-4">
              {votacion.descripcion}
            </p>
          )}
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="font-medium">Inicio:</div>
              <div>{votacion.fecha_inicio ? new Date(votacion.fecha_inicio).toLocaleDateString() : 'No definida'}</div>
            </div>
            <div>
              <div className="font-medium">Cierre:</div>
              <div>{votacion.fecha_cierre ? new Date(votacion.fecha_cierre).toLocaleDateString() : 'Sin fecha'}</div>
            </div>
          </div>
        </div>

        {/* Mostrar resultados si la votación está cerrada o tiene votos */}
        {mostrandoResultados || (!estaActiva && votacion.opciones.length > 0) || (resultados && totalVotos > 0 ? true : false)} 
        
        {/* Opciones de voto para alumnos o resultados para profesor */}
        {estaActiva && !mostrandoResultados && votacion.opciones.length > 0 ? (
          <div className="mb-8">
            <h3 className="text-xl font-bold text-panel-dark mb-6">
              Tu voto
            </h3>
            
            {mostrandoResultados ? (
              <div className="bg-panel-gray/10 rounded-xl p-6">
                <h4 className="text-semibold mb-4">Resultados actualizados</h4>
                {resultados?.opciones.map((op) => (
                  <div key={op.id} className="mb-3">
                    <p className="font-medium">{op.texto}</p>
                    <div className="bg-white/20 rounded h-2 w-full mb-1">
                      <div
                        className="bg-panel-green h-2 rounded w-full/{{op.porcentaje}}"
                        style={{ width: `${op.porcentaje}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-panel-gray">
                      {op.votos} votos ({op.porcentaje}%)
                    </p>
                  </div>
                ))}
                <p className="mt-4 text-right">
                  Total: {resultados?.total_votos} votos
                </p>
              </div>
            ) : (
              <form 
                onSubmit={(e) => {
                  e.preventDefault()
                  const opcionSeleccionada = document.querySelector(
                    'input[name="opcion"]:checked'
                  ) as HTMLInputElement
                  const opcionId = opcionSeleccionada?.value
                  votar(opcionId)
                }}
                className="space-y-4"
              >
                <div>
                  <p className="text-panel-gray mb-2">
                    {votacion.pregunta}
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {votacion.opciones.map((op) => (
                      <label key={op.id} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="opcion"
                          value={op.id}
                          className="rounded border-panel-blue hover:border-panel-electric focus:outline-none focus:ring-2 focus:ring-panel-blue"
                        />
                        <span>{op.texto}</span>
                      </label>
                    ))}
                  </div>
                  {votacion.mostrar_otro && (
                    <div className="mt-3">
                      <label className="text-sm text-panel-gray">
                        Otro:
                        <input
                          type="text"
                          className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white placeholder-white/40 focus:outline-none focus:border-panel-blue mt-1"
                        />
                      </label>
                    </div>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={cargando}
                  className="w-full bg-panel-blue text-white font-medium py-3 rounded hover:bg-panel-electric transition-colors disabled:opacity-50"
                >
                  {mostrandoResultados ? 'Voto registrado' : 'ENVIAR MI VOTO'}
                </button>
              </form>
            )}
          </div>
        ) : (
          <>
            {/* Resultados */}
            {resultados && resultados.total_votos > 0 && (
              <div className="mb-8 p-6 bg-panel-gray/10 rounded-xl">
                <h3 className="text-2xl font-bold text-panel-dark mb-6">
                  Resultados
                </h3>
                
                <p className="text-panel-gray mb-4">
                  Total de votos: {resultados.total_votos}
                </p>
                
                {resultados.opciones.map((op) => (
                  <div key={op.id} className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>{op.texto}</span>
                      <span>{op.votos} votos</span>
                    </div>
                    <div className="bg-white/20 rounded h-2 w-full mb-1">
                      <div
                        className="bg-panel-green h-2 rounded w-full/{{op.porcentaje}}"
                        style={{ width: `${op.porcentaje}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-panel-gray">
                      {op.porcentaje}%
                    </p>
                  </div>
                ))}

                {resultados.opcion_mas_elegida && (
                  <div className="mt-4 pt-4 border-t panel-gray text-sm">
                    <p className="font-medium">
                      Opción más elegida: {resultados.opcion_mas_elegida.texto}
                    </p>
                    <p>{resultados.opcion_mas_elegida.votos} votos ({resultados.opcion_mas_elegida.porcentaje}%)</p>
                  </div>
                )}

                <div className="mt-6 pt-6 border-t panel-gray">
                  <p className="text-sm text-panel-gray">
                    Fecha de inicio: {votacion.fecha_inicio ? new Date(votacion.fecha_inicio).toLocaleDateString() : 'No definida'}
                  </p>
                  <p className="text-sm text-panel-gray">
                    Fecha de cierre: {votacion.fecha_cierre ? new Date(votacion.fecha_cierre).toLocaleDateString() : 'Sin fecha'}
                  </p>
                </div>
              </div>
            )}

            {/* Mensaje si votación está activa pero sin opciones */}
            {estaActiva && votacion.opciones.length === 0 && !mostrandoResultados && (
              <p className="text-panel-gray text-center py-12">
                Aún no hay opciones disponibles para votar
              </p>
            )}

            {/* Mensaje si votación no está activa */}
            {!estaActiva && !mostrandoResultados && (
              <div className="p-6 bg-red-100/30 border-l-4 border-red-500 rounded-xl text-center">
                <h3 className="text-red-400 mb-2">
                  Votación finalizada
                </h3>
                <p className="text-panel-gray">
                  Esta votación ha finalizado y ya no recibe votos.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}