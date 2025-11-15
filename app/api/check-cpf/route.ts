import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const cpf = searchParams.get('cpf')

    if (!cpf) {
      return NextResponse.json(
        { status: 'error', message: 'CPF não fornecido' },
        { status: 400 }
      )
    }

    // Fazer requisição para o sistema da Federal Associados
    const response = await fetch(
      `https://federalassociados.com.br/checkCpfExists/${cpf}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    const data = await response.json()

    if (data.exists === true || data.status === 'error') {
      return NextResponse.json({
        status: 'error',
        message: 'CPF já cadastrado. Não é possível realizar o cadastro.',
        exists: true
      })
    }

    return NextResponse.json({
      status: 'success',
      exists: false
    })
  } catch (error) {
    console.error('Erro ao verificar CPF:', error)
    return NextResponse.json(
      { status: 'error', message: 'Erro ao verificar CPF', exists: false },
      { status: 500 }
    )
  }
}
