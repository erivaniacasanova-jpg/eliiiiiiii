"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X, FileText, CreditCard, QrCode } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import CreditCardForm from "@/components/credit-card-form"
import PixPayment from "@/components/pix-payment"

interface PaymentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  billingId: string
  amount: number
}

export default function PaymentModal({ open, onOpenChange, billingId, amount }: PaymentModalProps) {
  const { toast } = useToast()
  const [selectedMethod, setSelectedMethod] = useState<"boleto" | "card" | "pix" | null>(null)
  const [boletoUrl, setBoletoUrl] = useState<string>("")
  const [loadingBoleto, setLoadingBoleto] = useState(false)

  const handleGenerateBoleto = async () => {
    setLoadingBoleto(true)
    try {
      const response = await fetch("/api/payment/boleto", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ billing_id: billingId }),
      })

      const data = await response.json()

      if (response.ok) {
        setBoletoUrl(data.boleto_link)
        window.open(data.boleto_link, "_blank")
        toast({
          title: "Boleto gerado!",
          description: "O boleto foi aberto em uma nova aba.",
        })
      } else {
        toast({
          title: "Erro ao gerar boleto",
          description: data.message || "Tente novamente.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível gerar o boleto.",
        variant: "destructive",
      })
    } finally {
      setLoadingBoleto(false)
    }
  }

  if (selectedMethod === "card") {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Pagamento com Cartão de Crédito</DialogTitle>
          </DialogHeader>
          <CreditCardForm
            billingId={billingId}
            amount={amount}
            onSuccess={() => {
              toast({
                title: "Pagamento aprovado!",
                description: "Seu cadastro foi concluído com sucesso.",
              })
              setTimeout(() => {
                window.location.reload()
              }, 2000)
            }}
            onBack={() => setSelectedMethod(null)}
          />
        </DialogContent>
      </Dialog>
    )
  }

  if (selectedMethod === "pix") {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Pagamento via PIX</DialogTitle>
          </DialogHeader>
          <PixPayment
            billingId={billingId}
            amount={amount}
            onSuccess={() => {
              toast({
                title: "Pagamento confirmado!",
                description: "Seu cadastro foi concluído com sucesso.",
              })
              setTimeout(() => {
                window.location.reload()
              }, 2000)
            }}
            onBack={() => setSelectedMethod(null)}
          />
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl p-0">
        {/* Header */}
        <div className="border-b px-6 py-4 flex items-center justify-between">
          <DialogTitle className="text-2xl font-semibold text-gray-900">Pagar Fatura</DialogTitle>
          <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} className="h-8 w-8">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Payment Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-12">
          {/* Boleto */}
          <button
            onClick={handleGenerateBoleto}
            disabled={loadingBoleto}
            className="flex flex-col items-center p-8 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors space-y-4 disabled:opacity-50"
          >
            <h3 className="text-3xl font-bold text-gray-900">Boleto</h3>
            <div className="flex justify-center">
              <FileText className="w-16 h-16 text-green-600" />
            </div>
            <p className="text-sm text-gray-500 text-center">Sistema de Boleto online (Federal Associados)</p>
          </button>

          {/* Cartão */}
          <button
            onClick={() => setSelectedMethod("card")}
            className="flex flex-col items-center p-8 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors space-y-4"
          >
            <h3 className="text-3xl font-bold text-gray-900">Cartão</h3>
            <div className="flex justify-center">
              <CreditCard className="w-16 h-16 text-green-600" />
            </div>
            <p className="text-sm text-gray-500 text-center">Para pagamento em cartão use está opção!.</p>
          </button>

          {/* PIX */}
          <button
            onClick={() => setSelectedMethod("pix")}
            className="flex flex-col items-center p-8 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors space-y-4"
          >
            <h3 className="text-3xl font-bold text-gray-900">Pix</h3>
            <div className="flex justify-center">
              <QrCode className="w-16 h-16 text-green-600" />
            </div>
            <p className="text-sm text-gray-500 text-center">Sistema de Pix on-line (Federal Associados)</p>
          </button>
        </div>

        {/* Footer */}
        <div className="border-t px-6 py-4 flex justify-end">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
