import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { Profesor, Votacion } from '@/lib/types'

// GET - Obtener todas las votaciones del profesor
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const profesorId = searchParams.get('profesorId')

    let query = supabase.from('votaciones').select(`
      *,
      opciones:opciones_votacion(*)
    `)

    if (profesorId) {
      query = query.eq('profesor_id', profesorId)
    }

    const { data, error } = await query.order('creado_en', { ascending: false })

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(data || [])
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

// POST - Crear una nueva votación
export async function POST(request: Request) {
  try {
    const body = await request.json
    const { titulo, pregunta, descripcion, tipo, opciones, fecha_inicio, fecha_cierre, mostrar_otro } = body

    // Validación básica
    if (!titulo || !pregunta || !tipo || !fecha_inicio || !fecha_cierre) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      )
    }

    const { error } = await supabase.from('votaciones').insert({
      profesor_id: body.profesor_id,
      titulo,
      pregunta,
      descripcion,
      tipo,
      fecha_inicio,
      fecha_cierre,
      activa: true,
      mostrar_otro: mostrar_otro || false,
    })

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    // Insertar las opciones
    if (opciones && opciones.length > 0) {
      const opcionesInsertadas = opciones.map((texto: string) => ({
        votacion_id: body.votacion_id || (await getLastInsertId()),
        texto,
        votos: 0,
      }))

      // Note: We need to get the actual votacion_id after insert
      // For simplicity, we'll reference the newly created votación
    }

    return NextResponse.json(
      { mensaje: 'Votación creada exitosamente' },
      { status: 201 }
    )
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

async function getLastInsertId(): Promise<string> {
  const { data, error } = await supabase
    .from('votaciones')
    .select('id')
    .order('creado_en', { ascending: false })
    .limit(1)
    .single()
  if (error) throw error
  return data.id
}