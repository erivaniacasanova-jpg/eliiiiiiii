"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft } from "lucide-react"
import Script from "next/script"

interface CreditCardFormProps {
  billingId: string
  amount: number
  onSuccess: () => void
  onBack: () => void
}

const MERCADOPAGO_PUBLIC_KEY = "APP_USR-637d6b88-2cd7-4f37-a00d-75d97dae8284"

declare global {
  interface Window {
    MercadoPago: any
  }
}

export default function CreditCardForm({ billingId, amount, onSuccess, onBack }: CreditCardFormProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [mpLoaded, setMpLoaded] = useState(false)
  const [cardToken, setCardToken] = useState("")
  const [cardData, setCardData] = useState({
    cardNumber: "",
    cardholderName: "",
    cardholderEmail: "",
    cardExpirationDate: "",
    securityCode: "",
    identificationType: "CPF",
    identificationNumber: "",
    issuer: "",
  })

  useEffect(() => {
    if (mpLoaded && window.MercadoPago) {
      initializeMercadoPago()
    }
  }, [mpLoaded])

  const initializeMercadoPago = () => {
    const mp = new window.MercadoPago(MERCADOPAGO_PUBLIC_KEY)

    mp.cardForm({
      amount: amount.toString(),
      autoMount: true,
      form: {
        id: "credit-card-form",
        cardholderName: {
          id: "cardholderName",
          placeholder: "Titular do cartão",
        },
        cardholderEmail: {
          id: "cardholderEmail",
          placeholder: "E-mail",
        },
        cardNumber: {
          id: "cardNumber",
          placeholder: "Número do cartão",
        },
        cardExpirationDate: {
          id: "cardExpirationDate",
          placeholder: "MM/AA",
        },
        securityCode: {
          id: "securityCode",
          placeholder: "CVV",
        },
        installments: {
          id: "installments",
          placeholder: "Parcelas",
        },
        identificationType: {
          id: "identificationType",
          placeholder: "Tipo de documento",
        },
        identificationNumber: {
          id: "identificationNumber",
          placeholder: "Número do documento",
        },
        issuer: {
          id: "issuer",
          placeholder: "Banco emissor",
        },
      },
      callbacks: {
        onFormMounted: (error: any) => {
          if (error) {
            console.error("[v0] Form Mounted error:", error)
            return
          }
          console.log("[v0] MercadoPago form mounted")
        },
        onSubmit: (event: any) => {
          event.preventDefault()
          const tokenElement = document.querySelector('input[name="MPHiddenInputToken"]') as HTMLInputElement
          if (tokenElement && tokenElement.value) {
            setCardToken(tokenElement.value)
          }
        },
      },
    })
  }

  const formatCardNumber = (value: string) => {
    const numbers = value.replace(/\D/g, "").slice(0, 16)
    return numbers.replace(/(\d{4})/g, "$1 ").trim()
  }

  const formatExpirationDate = (value: string) => {
    const numbers = value.replace(/\D/g, "").slice(0, 4)
    if (numbers.length >= 2) {
      return numbers.slice(0, 2) + "/" + numbers.slice(2)
    }
    return numbers
  }

  const handleInputChange = (field: string, value: string) => {
    let formattedValue = value

    if (field === "cardNumber") {
      formattedValue = formatCardNumber(value)
    } else if (field === "cardExpirationDate") {
      formattedValue = formatExpirationDate(value)
    } else if (field === "securityCode") {
      formattedValue = value.replace(/\D/g, "").slice(0, 4)
    }

    setCardData((prev) => ({ ...prev, [field]: formattedValue }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Get the token from MercadoPago SDK
      const tokenElement = document.querySelector('input[name="MPHiddenInputToken"]') as HTMLInputElement
      const issuerElement = document.querySelector("#issuer") as HTMLSelectElement

      if (!tokenElement || !tokenElement.value) {
        toast({
          title: "Erro",
          description: "Token de pagamento não gerado. Verifique os dados do cartão.",
          variant: "destructive",
        })
        setLoading(false)
        return
      }

      const response = await fetch("/api/payment/card", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...cardData,
          billing_id: billingId,
          amount: amount,
          token: tokenElement.value,
          issuer: issuerElement?.value || "",
        }),
      })

      const data = await response.json()

      if (response.ok && data.status === "success") {
        onSuccess()
      } else {
        toast({
          title: "Pagamento recusado",
          description: data.message || "Verifique os dados do cartão.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Erro no pagamento",
        description: "Não foi possível processar o pagamento.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Script
        src="https://sdk.mercadopago.com/js/v2"
        onLoad={() => setMpLoaded(true)}
        onError={() => {
          toast({
            title: "Erro",
            description: "Não foi possível carregar o sistema de pagamento.",
            variant: "destructive",
          })
        }}
      />

      <form id="credit-card-form" onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Button type="button" variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="text-lg font-semibold">Total: R$ {amount.toFixed(2)}</div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="cardNumber">Número do cartão</Label>
          <Input
            id="cardNumber"
            name="cardNumber"
            value={cardData.cardNumber}
            onChange={(e) => handleInputChange("cardNumber", e.target.value)}
            placeholder="0000 0000 0000 0000"
            maxLength={19}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cardholderName">Titular do cartão</Label>
          <Input
            id="cardholderName"
            name="cardholderName"
            value={cardData.cardholderName}
            onChange={(e) => handleInputChange("cardholderName", e.target.value)}
            placeholder="Nome como está no cartão"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cardholderEmail">E-mail</Label>
          <Input
            id="cardholderEmail"
            name="cardholderEmail"
            type="email"
            value={cardData.cardholderEmail}
            onChange={(e) => handleInputChange("cardholderEmail", e.target.value)}
            placeholder="seu@email.com"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="issuer">Banco emissor</Label>
          <select
            id="issuer"
            name="issuer"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
          >
            <option value="">Selecione</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="cardExpirationDate">Validade (MM/AA)</Label>
            <Input
              id="cardExpirationDate"
              name="cardExpirationDate"
              value={cardData.cardExpirationDate}
              onChange={(e) => handleInputChange("cardExpirationDate", e.target.value)}
              placeholder="MM/AA"
              maxLength={5}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="securityCode">CVV</Label>
            <Input
              id="securityCode"
              name="securityCode"
              value={cardData.securityCode}
              onChange={(e) => handleInputChange("securityCode", e.target.value)}
              placeholder="123"
              maxLength={4}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="identificationType">Tipo de documento</Label>
            <select
              id="identificationType"
              name="identificationType"
              value={cardData.identificationType}
              onChange={(e) => handleInputChange("identificationType", e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
            >
              <option value="CPF">CPF</option>
              <option value="CNPJ">CNPJ</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="identificationNumber">Número do documento</Label>
            <Input
              id="identificationNumber"
              name="identificationNumber"
              value={cardData.identificationNumber}
              onChange={(e) => handleInputChange("identificationNumber", e.target.value)}
              placeholder="000.000.000-00"
              required
            />
          </div>
        </div>

        <div className="space-y-2" hidden>
          <Label htmlFor="installments">Parcelas</Label>
          <select
            id="installments"
            name="installments"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
          >
            <option value="1">1x</option>
          </select>
        </div>

        <Button type="submit" className="w-full" disabled={loading || !mpLoaded}>
          {loading ? "Processando..." : `Pagar R$ ${amount.toFixed(2)}`}
        </Button>
      </form>
    </>
  )
}
