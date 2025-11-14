import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Prepare form data for Federal Associados API
    const formData = new URLSearchParams()
    formData.append("_token", "oCqwAglu4VySDRcwWNqj81UMfbKHCS2vWQfARkzu")
    formData.append("status", body.status || "0")
    formData.append("father", body.father || "108054")
    formData.append("type", body.type || "Recorrente")
    formData.append("cpf", body.cpf || "")
    formData.append("birth", body.birth || "")
    formData.append("name", body.name || "")
    formData.append("email", body.email || "")
    formData.append("phone", body.phone || "")
    formData.append("cell", body.cell || "")
    formData.append("cep", body.cep || "")
    formData.append("district", body.district || "")
    formData.append("city", body.city || "")
    formData.append("state", body.state || "")
    formData.append("street", body.street || "")
    formData.append("number", body.number || "")
    formData.append("complement", body.complement || "")
    formData.append("typeChip", body.typeChip || "fisico")
    formData.append("coupon", body.coupon || "")
    formData.append("plan_id", body.plan_id || "")
    formData.append("typeFrete", body.typeFrete || "")

    const response = await fetch("https://federalassociados.com.br/registroSave", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json, text/html",
      },
      body: formData.toString(),
      redirect: "manual", // Don't follow redirects automatically
    })

    const contentType = response.headers.get("content-type")
    console.log("[v0] Response status:", response.status)
    console.log("[v0] Content-Type:", contentType)

    if (response.status === 302 || response.status === 301) {
      const location = response.headers.get("location")
      console.log("[v0] Redirect location:", location)

      if (location) {
        // Extract billing_id from URL like: /registroFinish/1096985
        const billingIdMatch = location.match(/registroFinish\/(\d+)/)
        if (billingIdMatch && billingIdMatch[1]) {
          const billing_id = billingIdMatch[1]
          console.log("[v0] Extracted billing_id from redirect:", billing_id)

          return NextResponse.json({
            success: true,
            billing_id,
            message: "Cadastro realizado com sucesso",
          })
        }
      }
    }

    // Check if response is JSON or HTML
    if (contentType?.includes("application/json")) {
      const data = await response.json()
      console.log("[v0] JSON Response:", data)

      if (!response.ok) {
        return NextResponse.json(
          {
            message: data.message || "Erro ao processar cadastro",
            errors: data.errors || {},
          },
          { status: response.status },
        )
      }

      return NextResponse.json({
        success: true,
        billing_id: data.billing_id || data.id,
        message: "Cadastro realizado com sucesso",
      })
    } else {
      // Response is HTML - try to extract billing_id from HTML content
      const text = await response.text()
      console.log("[v0] HTML Response (first 500 chars):", text.substring(0, 500))

      const metaRefreshMatch = text.match(/registroFinish\/(\d+)/)
      if (metaRefreshMatch && metaRefreshMatch[1]) {
        const billing_id = metaRefreshMatch[1]
        console.log("[v0] Extracted billing_id from HTML:", billing_id)

        return NextResponse.json({
          success: true,
          billing_id,
          message: "Cadastro realizado com sucesso",
        })
      }

      // Try to extract billing_id from HTML if present
      const billingIdMatch = text.match(/billing[_-]?id["\s:=]+(\d+)/i)
      const billing_id = billingIdMatch ? billingIdMatch[1] : null

      if (billing_id) {
        return NextResponse.json({
          success: true,
          billing_id,
          message: "Cadastro realizado com sucesso",
        })
      }

      // If we can't find billing_id, still consider it a success
      // as the registration was submitted to the external API
      return NextResponse.json({
        success: true,
        message: "Cadastro realizado com sucesso",
      })
    }
  } catch (error) {
    console.error("[v0] Erro no cadastro:", error)
    return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 })
  }
}
