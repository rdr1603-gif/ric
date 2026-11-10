import { useEffect } from 'react'

export default function HelpPage() {
  useEffect(() => {
    // Desactivar el scroll del body cuando el help está abierto
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto p-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-panel-dark mb-4">
            Ayuda y Tutorial
          </h1>
          <p className="text-panel-gray">
            Instrucciones para usar la aplicación Votación Pádel
          </h9>
        </header>

        <div className="space-y-8">
          
          {/* Sección: Para Profesores */}
          <section>
            <h2 className="text-2xl font-bold text-panel-dark mb-6">Para Profesores</h2>
            
            <div className="bg-panel-gray/10 rounded-2xl p-6 mb-6">
              <h3 className="text-xl font-medium text-panel-dark mb-4">1. Iniciar sesión</h3>
              <ol className="list-decimal list-inside text-panel-gray space-y-2">
                <li>Accedé a la aplicación e iniciá sesión con tu correo y contraseña</li>
                <li>Si es tu primera vez, deberás registrarte con tu correo institucional</li>
                <li>Una vez logueado, accederás al panel de control</li>
              </ol>
            </div>

            <div className="bg-panel-gray/10 rounded-2xl p-6 mb-6">
              <h3 className="text-xl font-medium text-panel-dark mb-4">2. Crear una votación</h3>
              <ol className="list-decimal list-inside text-panel-gray space-y-2">
                <li>En el panel principal, hacé clic en "Crear nueva votación"</li>
                <li>Completá el formulario:</li>
                <ul className="list-disc list-inside ml-6 space-y-1 text-sm">
                  <li>Título: Nombre de la votación (ej. "Organización de clases")</li>
                  <li>Pregunta: La pregunta principal que los alumnos responderán</li>
                  <li>Descripción: Opcional - detalles adicionales</li>
                  <li>Tipo: "Respuesta única" o "Respuesta múltiple"</li>
                  <li>Opciones: Agregá las respuestas posibles (mínimo 2)</li>
                  <li>Fecha de inicio: cuándo empiezan a poder votar</li>
                  <li>Fecha de cierre: cuándo termina la votación</li>
                  <li>Mostrar "Otro": Activá si querés permitir respuestas personalizadas</li>
                </ul>
                <li>Hacé clic en "Crear votacion"</li>
                <li>El sistema generará un enlace único para compartir</li>
              </ol>
            </div>

            <div className="bg-panel-gray/10 rounded-2xl p-6 mb-6">
              <h3 className="text-xl font-medium text-panel-dark mb-4">3. Compartir la votación</h3>
              <ol className="list-decimal list-inside text-panel-gray space-y-2">
                <li>
                  <strong>Compartir por WhatsApp:</strong> Hacé clic en el botón "Compartir por WhatsApp" que aparecerá al crear la votación. Se abrirá WhatsApp con un mensaje pre-escrito que incluye el enlace.
                </li>
                <li>
                  <strong>Copiar enlace:</strong> Copiá el enlace y compartilo manualmente por WhatsApp, email o cualquier otra plataforma.
                </li>
                <li>
                  <strong>Código QR:</strong> Un código QR estará disponible para escanear con el celular y acceder directamente a la votación.
                </li>
              </ol>
            </div>

            <div className="bg-panel-gray/10 rounded-2xl p-6 mb-6">
              <h3 className="text-xl font-medium text-panel-dark mb-4">4. Gestionar votaciones</h3>
              <ol className="list-decimal list-inside text-panel-gray space-y-2">
                <li>
                  <strong>Ver votaciones activas:</strong> En el panel principal verás tus votaciones con estado "Activa"
                </li>
                <li>
                  <strong>Cerrar una votación:</strong> Podés cerrar manualmente una votación antes de la fecha programada, lo que impedirá nuevos votos
                </li>
                <li>
                  <strong>Duplicar una votación:</strong> Podés crear una nueva votación basada en una existente
                </li>
                <li>
                  <strong>Eliminar una votación:</strong> Eliminá permanentemente una votación y todos sus datos
                </li>
                <li>
                  <strong>Exportar resultados:</strong> Descargar los resultados en PDF o Excel después de cerrar la votación
                </li>
              </ol>
            </div>

            <div className="bg-panel-gray/10 rounded-2xl p-6">
              <h3 className="text-xl font-medium text-panel-dark mb-4">5. Consultar resultados</h3>
              <ol className="list-decimal list-inside text-panel-gray space-y-2">
                <li>
                  Una vez que la votación está cerrada, automáticamente podrás ver los resultados
                </li>
                <li>
                  Se mostrarán: total de votos, porcentajes por opción, gráficos de barras y circular
                </li>
                <li>
                  <strong>Importante:</strong> Los resultados muestran solo estadísticas, nunca identidades individuales
                </li>
                <li>
                  Podés exportar los resultados a PDF o Excel para compartir con el equipo
                </li>
              </ol>
            </div>
          </section>

          {/* Sección: Para Alumnos */}
          <section>
            <h2 className="text-2xl font-bold text-panel-dark mb-6">Para Alumnos</h2>
            
            <div className="bg-panel-gray/10 rounded-2xl p-6 mb-6">
              <h3 className="text-xl font-medium text-panel-dark mb-4">1. Recibir el enlace</h3>
              <p className="text-panel-gray mb-4">
                Tu profesor te enviará el enlace de la votación por WhatsApp, email o cualquier otra plataforma.
              </p>
              <ul className="list-disc list-inside text-panel-gray space-y-1">
                <li>Hacé clic en el enlace recibido</li>
                <li>Se abrirá la votación en tu navegador (funciona en celular, tablet o computadora)</li>
              </ul>
            </div>

            <div className="bg-panel-gray/10 rounded-2xl p-6 mb-6">
              <h3 className="text-xl font-medium text-panel-dark mb-4">2. Responder la votación</h3>
              <ol className="list-decimal list-inside text-panel-gray space-y-2">
                <li>Leé atentamente la pregunta</li>
                <li>Seleccioná tu opción preferida (o opciones, si es múltiple)</li>
                <li>Si el profesor habilitó la opción "Otro", podés escribir tu propia respuesta</li>
                <li>Hacé clic en "ENVIAR MI VOTO"</li>
              </ol>
            </div>

            <div className="bg-panel-gray/10 rounded-2xl p-6 mb-6">
              <h3 className="text-xl font-medium text-panel-dark mb-4">3. Confirmación</h3>
              <p className="text-panel-gray mb-4">
                Después de enviar tu voto, verás un mensaje de agradecimiento:
              </p>
              <blockquote className="bg-white/5 rounded-xl p-4 mb-4 italic text-panel-gray">
                "¡Gracias por participar! Tu voto fue registrado correctamente"
              </blockquote>
              <p className="text-panel-gray">
                <strong>Importante:</strong> No se mostrarán los resultados a los alumnos para garantizar el anonimato de todas las votaciones.
              </p>
            </div>

            <div className="bg-panel-gray/10 rounded-2xl p-6">
              <h3 className="text-xl font-medium text-panel-dark mb-4">4. No necesitas registrarte</h3>
              <p className="text-panel-gray mb-4">
                Los alumnos pueden participar sin crear una cuenta ni proporcionar ningún dato personal.
              </p>
              <ul className="list-disc list-inside text-panel-gray space-y-1">
                <li>No es necesario registrarse</li>
                <li>No se guardan nombres ni correos electrónicos</li>
                <li>El voto es completamente anónimo</li>
              </ul>
            </div>
          </section>

          {/* Sección: Privacidad y Seguridad */}
          <section>
            <h2 className="text-2xl font-bold text-panel-dark mb-6">Privacidad y Seguridad</h2>
            
            <div className="bg-panel-gray/10 rounded-2xl p-6 mb-6">
              <h3 className="text-xl font-medium text-panel-dark mb-4">Compromiso con el anonimato</h3>
              <ul className="list-disc list-inside text-panel-gray space-y-2">
                <li>
                  <strong>No se guardan nombres:</strong> Las respuestas están completamente desacopladas de la identidad del votante
                </li>
                <li>
                  <strong>No se guardan correos/teléfonos:</strong> No recopilamos información personal de los votantes
                </li>
                <li>
                  <strong>El profesor nunca verá quién votó qué:</strong> Los resultados muestran solo estadísticas agregadas
                </li>
                <li>
                  <strong>No se usan IP para identificar:</strong> Las direcciones IP no se utilizan como identificación permanente
                </li>
                <li>
                  <strong>Base de datos protegida:</strong> Los datos están en Supabase con Row Level Security (RLS)
                </li>
              </ul>
            </div>

            <div className="bg-panel-gray/10 rounded-2xl p-6">
              <h3 className="text-xl font-medium text-panel-dark mb-4">Modalidades de votación</h3>
              <ul className="list-disc list-inside text-panel-gray space-y-2">
                <li>
                  <strong>Modalidad A ( Enlace único):</strong> Todos los alumnos usan el mismo enlace. Se puede limitar la cantidad de votos, pero esto no garantiza un voto por persona por sí solo.
                </li>
                <li>
                  <strong>Modalidad B (Códigos individuales):</strong> El profesor genera códigos únicos para cada alumno. Cada código permite un voto, pero el sistema almacena por separado los códigos utilizados y las respuestas. La base de datos no permite relacionar el código utilizado con la respuesta emitida.
                </li>
              </ul>
            </div>
          </section>

        </div>

        <footer className="mt-8 pt-8 border-t panel-gray/50 text-center text-sm">
          <p className="text-panel-gray">
            Votación Pádel · Ayuda · Versión 1.0
          </p>
        </footer>
      </div>
    </div>
  )
}