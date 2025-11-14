import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { billingId: string; paymentId: string } }) {
  try {
    const { billingId, paymentId } = params

    const response = await fetch(
      `https://federalassociados.com.br/mercadopago/consultaPagamento/${billingId}/${paymentId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    )

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json({ status: "error" }, { status: response.status })
    }

    return NextResponse.json({
      status: data.status || "pending",
      payment: data.payment || "pending",
    })
  } catch (error) {
    console.error("[v0] Erro ao verificar pagamento:", error)
    return NextResponse.json({ status: "error" }, { status: 500 })
  }
}
