"use client"

import { Button } from "@/components/ui/button"
import { useEffect, useRef } from "react"

interface WelcomeVideoProps {
  onContinue: () => void
}

export default function WelcomeVideo({ onContinue }: WelcomeVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.setAttribute('controlsList', 'nodownload')
      videoRef.current.setAttribute('disablePictureInPicture', 'true')
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-3 overflow-hidden">
      <div className="w-full max-w-4xl h-screen flex flex-col justify-center py-4">
        <div className="bg-white rounded-lg shadow-xl p-4 flex flex-col h-full max-h-[95vh]">
          <h1 className="text-base sm:text-xl md:text-2xl font-bold text-gray-900 text-center leading-tight mb-3 flex-shrink-0">
            Seja muito bem-vindo(a) à Família Federal Associados. Para finalizar o seu cadastro assista ao vídeo abaixo para realizar a sua adesão
          </h1>

          <div className="flex-1 rounded-lg overflow-hidden shadow-lg bg-black mb-3 min-h-0">
            <video
              ref={videoRef}
              controls
              controlsList="nodownload"
              disablePictureInPicture
              className="w-full h-full object-contain"
              preload="auto"
              playsInline
              onContextMenu={(e) => e.preventDefault()}
            >
              <source
                src="https://myehbxfidszreorsaexi.supabase.co/storage/v1/object/public/adesao/adesao.mp4"
                type="video/mp4"
              />
              Seu navegador não suporta a reprodução de vídeos.
            </video>
          </div>

          <div className="flex justify-center flex-shrink-0">
            <Button
              onClick={onContinue}
              className="bg-blue-600 hover:bg-blue-700 text-white text-base sm:text-lg px-8 sm:px-12 py-4 sm:py-5 h-auto w-full sm:w-auto"
            >
              Continuar
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
