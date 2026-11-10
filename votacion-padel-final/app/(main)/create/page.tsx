import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth'

export default function CreateVotacionPage() {
  const { usuario } = useAuth()
  if (!usuario) {
    // window.location.href = '/auth/login'
    return null
  }

  const [
    form, setForm
  ] = useState({
    titulo: '',
    pregunta: '',
    descripcion: '',
    tipo: 'unica' as 'unica' | 'multiple',
    opciones: ['', ''],
    fecha_inicio: new Date(),
    fecha_cierre: new Date(),
    mostrar_otro: false,
  })

  const [error, setError] = useState<string | null>(null)
  const [exito, setExito] = useState<string | null>(null)

  // Validar formulario
  const validarFormulario = (): boolean => {
    if (!form.titulo.trim()) {
      setError('El título es requerido')
      return false
    }
    if (!form.pregunta.trim()) {
      setError('La pregunta es requerida')
      return false
    }
    if (form.opciones.filter((o) => o.trim()).length < 2) {
      setError('Debe haber al menos 2 opciones')
      return false
    }
    if (!form.fecha_cierre || new Date(form.fecha_cierre) <= new Date(form.fecha_inicio)) {
      setError('La fecha de cierre debe ser después de la fecha de inicio')
      return false
    }
    return true
  }

  const manejarSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    if (!validarFormulario()) return

    try {
      await supabase.from('votaciones').insert({
        profesor_id: usuario.id,
        titulo: form.titulo,
        pregunta: form.pregunta,
        descripcion: form.descripcion,
        tipo: form.tipo,
        fecha_inicio: form.fecha_inicio.toISOString(),
        fecha_cierre: form.fecha_cierre.toISOString(),
        activa: true,
        mostrar_otro: form.mostrar_otro,
      })

      setExito('Votación creada exitosamente')
      setTimeout(() => {
        setExito(null)
      }, 3000)
    } catch (e: any) {
      setError(e.message || 'Error al crear la votación')
    }
  }

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-panel-dark mb-6">
          Crear Nueva Votación
        </h1>

        {error && (
          <div className="bg-red-100/30 border-l-4 border-red-500 text-red-400 p-4 rounded mb-6">
            {error}
          </div>
        )}

        {exito && (
          <div className="bg-panel-green/10 border-l-4 border-panel-green p-4 rounded mb-6">
            {exito}
          </div>
        )}

        <form onSubmit={manejarSubmit} className="bg-panel-gray/10 rounded-xl p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-panel-dark mb-2">
                Título
              </label>
              <input
                value={form.titulo}
                onChange={(e) =>
                  setForm({ ...form, titulo: e.target.value })
                }
                required
                className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-panel-blue"
                placeholder="Ej: Organización de clases"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-panel-dark mb-2">
                Tipo
              </label>
              <select
                value={form.tipo}
                onChange={(e) =>
                  setForm({ ...form, tipo: e.target.value as 'unica' | 'multiple' })
                }
                className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-panel-blue"
              >
                <option value="unica">Respuesta única (un alumno = un voto)</option>
                <option value="multiple">Respuesta múltiple (varios alumnos por voto)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-panel-dark mb-2">
                Pregunta
              </label>
              <textarea
                value={form.pregunta}
                onChange={(e) =>
                  setForm({ ...form, pregunta: e.target.value })
                }
                required
                className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-panel-blue h-20 resize-none"
                placeholder="Ej: ¿Qué día prefieren realizar la próxima clase grupal?"
              /></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-panel-dark mb-2">
                Descripción (opcional)
              </label>
              <textarea
                value={form.descripcion}
                onChange={(e) =>
                  setForm({ ...form, descripcion: e.target.value })
                }
                className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-panel-blue h-20 resize-none"
                placeholder="Descripción opcional de la votación..."
              /></textarea>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-panel-dark mb-2">
              Opciones de respuesta
            </label>
            <div className="space-y-3">
              {form.opciones.map((op, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <input
                    type="text"
                    value={op || ''}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        opciones:
                          idx === form.opciones.length - 1
                            ? [...form.opciones.slice(0, -1), e.target.value]
                            : form.opciones.map((o, i) =>
                                i === idx ? e.target.value : o,
                              ),
                    }
                    }
                    className="flex-1 bg-white/5 border border-white/10 rounded px-3 py-2 text-white placeholder-white/40 focus:outline-none focus:border-panel-blue"
                    placeholder="Opción"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setForm({
                        ...form,
                        opciones: form.opciones.filter((_, i) => i !== idx),
                      })
                    }
                    className="text-red-400 hover:text-red-300"
                  >
                    ✕
                  </button>
                </div>
              ))}
              {form.opciones.length < 5 && (
                <button
                  type="button"
                  onClick={() =>
                    setForm({
                      ...form,
                      opciones: [...form.opciones, ''],
                    })
                  }
                  className="flex items-center justify-center w-full py-2 border dashed border-panel-blue/30 rounded hover:border-panel-blue text-sm text-panel-blue"
                >
                  + Agregar otra opción
                </button>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-panel-dark mb-2">
              Fecha y hora de inicio
            </label>
            <input
              type="datetime-local"
              value={form.fecha_inicio.toISOString().slice(0, 16)}
              onChange={(e) =>
                setForm({
                  ...form,
                  fecha_inicio: new Date(e.target.value),
                })
              }
              className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-panel-blue"
            />
            <p className="text-xs text-panel-gray mt-1">
              Los alumnos podrán votar a partir de esta fecha/hora