import { ReactNode } from 'react'

/**
 * Componente QR Code
 * Genera un código QR simple usando Google Charts API
 * El estudiante escanea el código y es redirigido al enlace de votación
 */
export interface QRCodeProps {
  /** Enlace de la votación */
  url: string
  /** Tamaño del código QR (por defecto 200) */
  size?: number
  /** Clase CSS personalizada */
  className?: string
}

/**
 * Genera un código QR usando la API de Google Charts
 * Nota: En producción, considera usar una biblioteca QR más robusta
 */
export function QRCode({ url, size = 200, className }: QRCodeProps) {
  // Codificar la URL para el código QR
  const encodedUrl = encodeURIComponent(url)
  
  // URL de la API de Google Charts para QR codes
  const qrApiUrl = `https://chart.googleapis.com/chart?chs=${size}x${size}&cht=qr&tld=com&chl=${encodedUrl}&choe=UTF-8`
  
  return (
    <div className={className || 'relative inline-block'>
      <img
        src={qrApiUrl}
        alt="Código QR de votación"
        width={size}
        height={size}
        className="border rounded-lg border-panel-gray"
      />
      <p className="text-xs text-panel-gray mt-2 text-center">
        Escaneá para votar
      </p>
    </div>
  )
}

/**
 * Botón de compartir en WhatsApp
 */
export function WhatsAppShareButton({
  url,
  titulo,
  pregunta,
}: {
  url: string
  titulo: string
  pregunta: string
}) {
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
    `${titulo}: ${pregunta}\n${url}`
  )}`

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 bg-panel-blue text-white rounded-full px-4 py-2 hover:bg-panel-electric transition-colors"
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
      Compartir por WhatsApp
    </a>
  )
}