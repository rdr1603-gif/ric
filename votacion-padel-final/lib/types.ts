/**
 * Tipos de datos para la aplicación Votación Pádel
 * Basados en la estructura de la base de datos Supabase
 */

/** Profesor/Usuario de la aplicación */
export interface Profesor {
  id: string
  email: string
  nombre: string
  creado_en: string
}

/** Tipo de votación: única o múltiple */
export type TipoVotacion = 'unica' | 'multiple'

/** Opción de votación */
export interface OpcionVotacion {
  id: string
  votacion_id: string
  texto: string
  votos: number
  creado_en: string
}

/** Votación */
export interface Votacion {
  id: string
  profesor_id: string
  titulo: string
  pregunta: string
  descripcion: string | null
  tipo: TipoVotacion
  opciones: OpcionVotacion[]
  fecha_inicio: string
  fecha_cierre: string | null
  activa: boolean
  creado_en: string
  mostrar_otro: boolean
}

/** Voto emitido (anónimo) */
export interface Voto {
  id: string
  votacion_id: string
  opcion_id: string | null
  codigo_acceso: string | null
  creado_en: string
}

/** Código de acceso individual */
export interfaceCodigoAcceso {
  id: string
  votacion_id: string
  codigo: string
  usado: boolean
  entregado_a: string | null // Puede ser nombre, email, o ID de alumno
  creado_en: string
}

/** Configuración de votación */
export interface VotacionConfig {
  id: string
  votacion_id: string
  nombre: string
  valor: string
  creado_en: string
}

/** Resultado de votación para display */
export interface ResultadoOpcion {
  id: string
  opcion_id: string
  texto: string
  votos: number
  porcentaje: number
}

/** Resumen de resultados */
export interface ResumenResultados {
  votacion: Votacion
  total_votos: number
  opciones: ResultadoOpcion[]
  opcion_mas_elegida: OpcionVotacion | null
  porcentaje_total: number
}

/** Datos del formulario de creación */
export interface FormularioCreacion {
  titulo: string
  pregunta: string
  descripcion: string
  tipo: TipoVotacion
  opciones: string[]
  fecha_inicio: Date
  fecha_cierre: Date
  mostrar_otro: boolean
}

/** Datos del voto del alumno */
export interface DatosVotoAlumno {
  votacion_id: string
  opcion_id: string | null
  codigo_acceso?: string
}