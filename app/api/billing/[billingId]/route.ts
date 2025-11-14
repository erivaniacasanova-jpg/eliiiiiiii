import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { billingId: string } }) {
  try {
    const { billingId } = params

    // Buscar informações da cobrança na API da Federal Associados
    const response = await fetch(`https://federalassociados.com.br/billingShow/externo/${billingId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    const data = await response.json()

    return NextResponse.json(data)
  } catch (error) {
    console.error("Erro ao buscar billing:", error)
    return NextResponse.json({ message: "Erro ao buscar informações" }, { status: 500 })
  }
}
