import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const formData = new URLSearchParams()
    formData.append("_token", "oCqwAglu4VySDRcwWNqj81UMfbKHCS2vWQfARkzu")
    formData.append("billing_id", body.billing_id)
    formData.append("MPHiddenInputAmount", body.amount.toString())
    formData.append("MPHiddenInputToken", body.token)
    formData.append("cardNumber", body.cardNumber.replace(/\s/g, ""))
    formData.append("cardholderName", body.cardholderName)
    formData.append("cardholderEmail", body.cardholderEmail)
    formData.append("cardExpirationDate", body.cardExpirationDate)
    formData.append("securityCode", body.securityCode)
    formData.append("identificationType", body.identificationType)
    formData.append("identificationNumber", body.identificationNumber)
    formData.append("issuer", body.issuer || "")
    formData.append("installments", "1")

    const response = await fetch("https://federalassociados.com.br/mercadopago/paymentCard", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    })

    const data = await response.json()

    if (!response.ok || data.status === "error") {
      return NextResponse.json(
        { status: "error", message: data.message || "Erro ao processar pagamento" },
        { status: response.status || 500 },
      )
    }

    return NextResponse.json({
      status: "success",
      message: "Pagamento aprovado",
    })
  } catch (error) {
    console.error("[v0] Erro no pagamento:", error)
    return NextResponse.json({ status: "error", message: "Erro ao processar pagamento" }, { status: 500 })
  }
}
