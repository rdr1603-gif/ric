import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// POST - Votar en una votación (anónimo)
export async function POST(request: Request) {
  try {
    const body = await request.json
    const { votacion_id, opcion_id, codigo_acceso } = body

    if (!votacion_id) {
      return NextResponse.json(
        { error: 'ID de votación requerido' },
        { status: 400 }
      )
    }

    // Insertar voto de manera anónima
    const { error } = await supabase.from('votos').insert({
      votacion_id,
      opcion_id,
      codigo_acceso,
    })

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { mensaje: 'Voto registrado correctamente' },
      { status: 200 }
    )
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}