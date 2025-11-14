import RegistrationForm from "@/components/registration-form"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-6 md:py-12 px-2 md:px-4">
      <div className="container mx-auto max-w-4xl w-full px-3 sm:px-6 md:px-8">
        <div className="bg-white rounded-lg shadow-xl p-4 sm:p-6 md:p-8">
          <div className="text-center mb-6 md:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Seja bem-vindo ao Registro de Associados</h1>
            <p className="text-sm sm:text-base text-gray-700 mt-2 font-medium">Patrocinador: Francisco Eliedisom Dos Santos</p>
            <p className="text-sm sm:text-base text-gray-600 mt-1">Realize seu cadastro sem consulta ao SPC/SERASA e sem fidelidade.</p>
          </div>
          <RegistrationForm />
        </div>
        <footer className="text-center mt-6 md:mt-8 text-xs sm:text-sm text-gray-600 px-2">
          <p>2025 © Federal Associados (CNPJ 29.383-343-0001/64) - Todos os direitos reservados |</p>
        </footer>
      </div>
    </main>
  )
}
