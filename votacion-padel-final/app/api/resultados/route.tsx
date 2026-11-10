import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { ResultadoOpcion, ResumenResultados } from '@/lib/types'

// GET - Obtener resultados de una votación
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const votacion_id = searchParams.get('votacion_id')

    if (!votacion_id) {
      return NextResponse.json(
        { error: 'ID de votación requerido' },
        { status: 400 }
      )
    }

    // Obtener la votación
    const { data: votacion, error: votacionError } = await supabase
      .from('votaciones')
      .select(`
        *,
        opciones:opciones_votacion(*)
      `)
      .eq('id', votacion_id)
      .single()

    if (votacionError) {
      return NextResponse.json(
        { error: votacionError.message },
        { status: 500 }
      )
    }

    // Obtener todos los votos para esta votación
    const { data: votos, error: votosError } = await supabase
      .from('votos')
      .select('opcion_id')
      .eq('votacion_id', votacion_id)

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
    const opciones: ResultadoOpcion[] = (votacion?.opciones || []).map((op) => {
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

    const resultados: ResumenResultados = {
      total_votos: totalVotos,
      opciones,
      opcion_mas_elegida,
      porcentaje_total: totalVotos > 0 ? 100 : 0,
    }

    return NextResponse.json(resultados)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}