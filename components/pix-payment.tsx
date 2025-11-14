"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Copy, CheckCircle2, ArrowLeft } from "lucide-react"
import Image from "next/image"

interface PixPaymentProps {
  billingId: string
  amount: number
  onSuccess: () => void
  onBack: () => void
}

export default function PixPayment({ billingId, amount, onSuccess, onBack }: PixPaymentProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [pixData, setPixData] = useState<{
    qrCode: string
    qrCodeBase64: string
    paymentId: string
  } | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    generatePix()
  }, [])

  useEffect(() => {
    if (!pixData) return

    // Verificar pagamento a cada 8 segundos
    const interval = setInterval(() => {
      checkPayment()
    }, 8000)

    return () => clearInterval(interval)
  }, [pixData])

  const generatePix = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/payment/pix", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          billing_id: billingId,
          amount: amount,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setPixData({
          qrCode: data.qr_code,
          qrCodeBase64: data.qr_code_base64,
          paymentId: data.payment_id,
        })
      } else {
        toast({
          title: "Erro ao gerar PIX",
          description: data.message || "Tente novamente.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível gerar o código PIX.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const checkPayment = async () => {
    if (!pixData) return

    try {
      const response = await fetch(`/api/payment/check/${billingId}/${pixData.paymentId}`)
      const data = await response.json()

      if (data.status === "approved") {
        onSuccess()
      }
    } catch (error) {
      console.error("Erro ao verificar pagamento:", error)
    }
  }

  const copyToClipboard = () => {
    if (!pixData) return

    navigator.clipboard.writeText(pixData.qrCode)
    setCopied(true)
    toast({
      title: "Código copiado!",
      description: "Cole no seu app de pagamentos.",
    })

    setTimeout(() => setCopied(false), 3000)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-gray-600">Gerando código PIX...</p>
        </div>
      </div>
    )
  }

  if (!pixData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">Erro ao gerar código PIX</p>
        <Button onClick={generatePix}>Tentar novamente</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button type="button" variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="text-lg font-semibold">Total: R$ {amount.toFixed(2)}</div>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
          <div className="text-sm text-green-800">
            <p className="font-semibold mb-1">PIX gerado com sucesso!</p>
            <p>Escaneie o QR Code ou copie o código para pagar. O pagamento é confirmado automaticamente.</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center space-y-4">
        <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
          <Image
            src={`data:image/png;base64,${pixData.qrCodeBase64}`}
            alt="QR Code PIX"
            width={200}
            height={200}
            className="w-48 h-48"
          />
        </div>

        <div className="w-full space-y-2">
          <p className="text-sm text-gray-600 text-center">Código PIX Copia e Cola:</p>
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
            <p className="text-xs font-mono break-all text-gray-700">{pixData.qrCode}</p>
          </div>
        </div>

        <Button onClick={copyToClipboard} className="w-full" variant={copied ? "outline" : "default"}>
          {copied ? (
            <>
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Código Copiado!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 mr-2" />
              Copiar Código PIX
            </>
          )}
        </Button>
      </div>

      <div className="text-center text-sm text-gray-500">
        <p>Aguardando confirmação do pagamento...</p>
        <div className="flex items-center justify-center gap-1 mt-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: "0.4s" }}></div>
        </div>
      </div>
    </div>
  )
}
