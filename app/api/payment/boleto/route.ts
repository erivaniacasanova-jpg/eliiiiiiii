import { type NextRequest, NextResponse } from "next/server"

async function getCSRFToken(): Promise<string | null> {
  try {
    const response = await fetch("https://federalassociados.com.br/status")
    const html = await response.text()

    const metaMatch = html.match(/<meta name="csrf-token" content="([^"]+)"/)
    if (metaMatch && metaMatch[1]) {
      return metaMatch[1]
    }

    const inputMatch = html.match(/<input[^>]*name="_token"[^>]*value="([^"]+)"/)
    if (inputMatch && inputMatch[1]) {
      return inputMatch[1]
    }

    return null
  } catch (error) {
    console.error("Erro ao buscar CSRF token:", error)
    return null
  }
}

export async function POST(request: NextRequest) {
  try {
    const { billing_id } = await request.json()

    const csrfToken = await getCSRFToken()

    if (!csrfToken) {
      return NextResponse.json(
        { message: "Não foi possível obter o token de segurança. Tente novamente." },
        { status: 500 }
      )
    }

    const formData = new URLSearchParams()
    formData.append("_token", csrfToken)
    formData.append("billing_id", billing_id)

    const response = await fetch("https://federalassociados.com.br/registerBilletCaixa/externo", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json({ message: data.message || "Erro ao gerar boleto" }, { status: response.status })
    }

    return NextResponse.json({
      success: true,
      boleto_link: data.billing?.boleto_link || data.url,
    })
  } catch (error) {
    console.error("[v0] Erro ao gerar boleto:", error)
    return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 })
  }
}
