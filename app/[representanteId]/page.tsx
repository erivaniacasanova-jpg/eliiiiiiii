import RegistrationForm from "@/components/registration-form"

export default async function RepresentantePage({ params }: { params: Promise<{ representanteId: string }> }) {
  const { representanteId } = await params

  const representantes = {
    "134684": {
      id: "134684",
      nome: "William Dos Santos Pessoa",
      whatsapp: "5521969400194",
    },
    "135302": {
      id: "135302",
      nome: "Antonia Erivania Delmiro Jacinto",
      whatsapp: "558498410187",
    },
    "153542": {
      id: "153542",
      nome: "Aline Aparecida Melo",
      whatsapp: "553193371195",
    },
    "88389": {
      id: "88389",
      nome: "Wagner Cruz Vieira",
      whatsapp: "5521996098857",
    },
    "131966": {
      id: "131966",
      nome: "Viviane Costa Martins",
      whatsapp: "5584986843611",
    },
    "108054": {
      id: "108054",
      nome: " Layanna Kristina Chagas Araujo Faustino",
      whatsapp: "5584986843611",
    },
    "158283": {
      id: "158283",
      nome: "Rodrigo Gomes De Assuncao",
      whatsapp: "553592140254",
    },
    "110403": {
      id: "110403",
      nome: "Geovani Gomes Da Silva",
      whatsapp: "556299198806",
    },
    "159726": {
      id: "159726",
      nome: " Jose Cardoso Dos Santos",
      whatsapp: "556993397859",
    },
    "131966": {
      id: "131966",
      nome: "  Viviane Costa Martins",
      whatsapp: "558496285022",
    },
  }

  const representante = representantes[representanteId as keyof typeof representantes]

  if (!representante) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-6 md:py-12 px-2 md:px-4">
        <div className="container mx-auto max-w-4xl w-full px-3 sm:px-6 md:px-8">
          <div className="bg-white rounded-lg shadow-xl p-4 sm:p-6 md:p-8">
            <p className="text-center text-red-600 text-xl">Representante não encontrado.</p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-6 md:py-12 px-2 md:px-4">
      <div className="container mx-auto max-w-4xl w-full px-3 sm:px-6 md:px-8">
        <div className="bg-white rounded-lg shadow-xl p-4 sm:p-6 md:p-8">
          <div className="text-center mb-6 md:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Seja bem-vindo ao Registro de Associados</h1>
            <p className="text-sm sm:text-base text-gray-700 mt-2 font-medium">Patrocinador: {representante.nome}</p>
            <p className="text-sm sm:text-base text-gray-600 mt-1">Realize seu cadastro sem consulta ao SPC/SERASA e sem fidelidade.</p>
          </div>
          <RegistrationForm representante={representante} />
        </div>
        <footer className="text-center mt-6 md:mt-8 text-xs sm:text-sm text-gray-600 px-2">
          <p>2025 © Federal Associados (CNPJ 29.383-343-0001/64) - Todos os direitos reservados |</p>
        </footer>
      </div>
    </main>
  )
}
