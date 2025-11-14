import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { billing_id } = await request.json()

    const response = await fetch(`https://federalassociados.com.br/mercadopago/orderPix/${billing_id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    const data = await response.json()

    if (!response.ok || data.status === "error") {
      return NextResponse.json({ message: "Erro ao gerar PIX" }, { status: response.status || 500 })
    }

    return NextResponse.json({
      success: true,
      qr_code: data.data.point_of_interaction.transaction_data.qr_code,
      qr_code_base64: data.data.point_of_interaction.transaction_data.qr_code_base64,
      payment_id: data.data.id,
    })
  } catch (error) {
    console.error("[v0] Erro ao gerar PIX:", error)
    return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 })
  }
}
