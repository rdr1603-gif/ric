/**
 * Botón de compartir en WhatsApp
 * Al presionar, abre WhatsApp con un mensaje pre-escrito que incluye el enlace
 */
export interface WhatsAppShareButtonProps {
  /** Enlace de la votación */
  url: string
  /** Título de la votación */
  titulo: string
  /** Pregunta de la votación */
  pregunta: string
  /** Texto adicional opcional */
  textoAdicional?: string
}

/**
 * Componente que genera el enlace de WhatsApp y lo muestra como un botón
 */
export function WhatsAppShareButton({
  url,
  titulo,
  pregunta,
  textoAdicional,
}: WhatsAppShareButtonProps) {
  // Construir el mensaje para WhatsApp
  const partes: string[] = []
  
  if (titulo) {
    partes.push(titulo)
  }
  
  if (pregunta) {
    partes.push(pregunta)
  }
  
  partes.push(url)
  
  if (textoAdicional) {
    partes.push(textoAdicional)
  }
  
  const mensaje = partes.join('%0A')
  const whatsappUrl = `https://wa.me/?text=${mensaje}`

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 bg-panel-blue text-white rounded-full px-4 py-2 hover:bg-panel-electric transition-colors font-medium"
    >
      <svg
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLineCap="round"
          strokeLineJoin="round"
          strokeWidth={2}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
        <path
          strokeLineCap="round"
          strokeLineJoin="round"
          strokeWidth={2}
          d="M9 10h.5m0 4h.5m7-4h.5M7 20h5a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
      Compartir en WhatsApp
    </a>
  )
}

/**
 * Genera un mensaje de WhatsApp y ofrece opciones de copia
 */
export function useWhatsAppShare(url: string, titulo: string, pregunta: string) {
  const [copiado, setCopiado] = useState(false)

  const mensaje = `
${titulo}: ${pregunta}
${url}
  `

  const compartir = () => {
    navigator.share
      ? navigator.share({
          title: titulo,
          text: mensaje,
          url,
        })
      : window.open(`https://wa.me/?text=${encodeURIComponent(mensaje)}`, '_blank')
  }

  const copiarAlPortapapeles = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2000)
    } catch (err) {
      // Fallback para navegadores antiguos
      const textarea = document.createElement('textarea')
      textarea.value = url
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2000)
    }
  }

  return { compartir, copiarAlPortapapeles, mensaje, copiado }
}