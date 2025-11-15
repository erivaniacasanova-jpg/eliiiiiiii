"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import ErrorModal from "@/components/error-modal"

const DEFAULT_REFERRAL_ID = "110956" // Francisco Eliedisom Dos Santos

const BRAZILIAN_STATES = [
  { value: "AC", label: "Acre" },
  { value: "AL", label: "Alagoas" },
  { value: "AP", label: "Amapá" },
  { value: "AM", label: "Amazonas" },
  { value: "BA", label: "Bahia" },
  { value: "CE", label: "Ceará" },
  { value: "DF", label: "Distrito Federal" },
  { value: "ES", label: "Espírito Santo" },
  { value: "GO", label: "Goiás" },
  { value: "MA", label: "Maranhão" },
  { value: "MT", label: "Mato Grosso" },
  { value: "MS", label: "Mato Grosso do Sul" },
  { value: "MG", label: "Minas Gerais" },
  { value: "PA", label: "Pará" },
  { value: "PB", label: "Paraíba" },
  { value: "PR", label: "Paraná" },
  { value: "PE", label: "Pernambuco" },
  { value: "PI", label: "Piauí" },
  { value: "RJ", label: "Rio de Janeiro" },
  { value: "RN", label: "Rio Grande do Norte" },
  { value: "RS", label: "Rio Grande do Sul" },
  { value: "RO", label: "Rondônia" },
  { value: "RR", label: "Roraima" },
  { value: "SC", label: "Santa Catarina" },
  { value: "SP", label: "São Paulo" },
  { value: "SE", label: "Sergipe" },
  { value: "TO", label: "Tocantins" },
]

const PLANS = {
  VIVO: [
    { id: "178", name: "40GB COM LIGACAO", price: 49.9, esim: true },
    { id: "69", name: "80GB COM LIGACAO", price: 69.9, esim: true },
    { id: "61", name: "150GB COM LIGACAO", price: 99.9, esim: true },
  ],
  TIM: [
    { id: "56", name: "100GB COM LIGACAO", price: 69.9, esim: true },
    { id: "154", name: "200GB SEM LIGAÇÃO", price: 159.9, esim: true },
    { id: "155", name: "300GB SEM LIGAÇÃO", price: 199.9, esim: true },
  ],
  CLARO: [
    { id: "57", name: "80GB COM LIGACAO", price: 69.9, esim: true },
    { id: "183", name: "150GB COM LIGACAO", price: 99.9, esim: true },
  ],
}

interface Representante {
  id: string
  nome: string
  whatsapp: string
}

interface RegistrationFormProps {
  representante?: Representante
}

export default function RegistrationForm({ representante }: RegistrationFormProps) {
  const REFERRAL_ID = representante?.id || DEFAULT_REFERRAL_ID

  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [billingId, setBillingId] = useState<string>("")
  const [orderAmount, setOrderAmount] = useState<number>(0)
  const [cpfValidated, setCpfValidated] = useState(false)
  const [emailValidated, setEmailValidated] = useState(false)
  const [showWelcomeVideo, setShowWelcomeVideo] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [cepValid, setCepValid] = useState<boolean | null>(null)

  const [formData, setFormData] = useState({
    cpf: "",
    birth: "",
    name: "",
    email: "",
    cell: "",
    cep: "",
    district: "",
    city: "",
    state: "",
    street: "",
    number: "",
    complement: "",
    typeChip: "fisico",
    coupon: "",
    plan_id: "",
    typeFrete: "",
  })

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    return numbers
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
  }

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3")
    }
    return numbers.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3")
  }

  const formatCEP = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    return numbers.replace(/(\d{5})(\d{0,3})/, "$1-$2")
  }

  const formatDateInput = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    if (numbers.length <= 2) {
      return numbers
    }
    if (numbers.length <= 4) {
      return numbers.replace(/(\d{2})(\d{0,2})/, "$1/$2")
    }
    return numbers.replace(/(\d{2})(\d{2})(\d{0,4})/, "$1/$2/$3")
  }

  const convertDateToISO = (dateStr: string): string => {
    const numbers = dateStr.replace(/\D/g, "")
    if (numbers.length !== 8) return ""

    const day = numbers.substring(0, 2)
    const month = numbers.substring(2, 4)
    const year = numbers.substring(4, 8)

    return `${year}-${month}-${day}`
  }

  const convertDateFromISO = (isoDate: string): string => {
    if (!isoDate) return ""
    const [year, month, day] = isoDate.split("-")
    return `${day}/${month}/${year}`
  }

  const handleInputChange = (field: string, value: string) => {
    let formattedValue = value

    if (field === "cpf") {
      formattedValue = formatCPF(value)
    } else if (field === "cell") {
      formattedValue = formatPhone(value)
    } else if (field === "cep") {
      formattedValue = formatCEP(value)
    } else if (field === "birth") {
      formattedValue = formatDateInput(value)
    }

    setFormData((prev) => ({ ...prev, [field]: formattedValue }))
  }

  const fetchAddressByCEP = async (cep: string) => {
    const cleanCEP = cep.replace(/\D/g, "")
    if (cleanCEP.length !== 8) {
      setCepValid(null)
      return
    }

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCEP}/json/`)
      const data = await response.json()

      if (!data.erro) {
        setCepValid(true)
        setFormData((prev) => ({
          ...prev,
          street: data.logradouro || "",
          district: data.bairro || "",
          city: data.localidade || "",
          state: data.uf || "",
        }))
      } else {
        setCepValid(false)
      }
    } catch (error) {
      console.error("Erro ao buscar CEP:", error)
      setCepValid(false)
    }
  }

  const validateCPF = (cpf: string): boolean => {
    const cleanCPF = cpf.replace(/\D/g, "")
    if (cleanCPF.length !== 11) return false

    // Validação básica de CPF
    if (/^(\d)\1{10}$/.test(cleanCPF)) return false

    let sum = 0
    let remainder

    for (let i = 1; i <= 9; i++) {
      sum += Number.parseInt(cleanCPF.substring(i - 1, i)) * (11 - i)
    }
    remainder = (sum * 10) % 11
    if (remainder === 10 || remainder === 11) remainder = 0
    if (remainder !== Number.parseInt(cleanCPF.substring(9, 10))) return false

    sum = 0
    for (let i = 1; i <= 10; i++) {
      sum += Number.parseInt(cleanCPF.substring(i - 1, i)) * (12 - i)
    }
    remainder = (sum * 10) % 11
    if (remainder === 10 || remainder === 11) remainder = 0
    if (remainder !== Number.parseInt(cleanCPF.substring(10, 11))) return false

    return true
  }

  const validateCPFWithAPI = async (cpf: string, birthDisplay: string) => {
    const cleanCPF = cpf.replace(/\D/g, "")
    const birthISO = convertDateToISO(birthDisplay)
    if (cleanCPF.length !== 11 || !birthISO) return

    try {
      const [year, month, day] = birthISO.split("-")
      const formattedBirth = `${day}-${month}-${year}`

      const response = await fetch(
        `https://apicpf.whatsgps.com.br/api/cpf/search?numeroDeCpf=${cleanCPF}&dataNascimento=${formattedBirth}&token=2|VL3z6OcyARWRoaEniPyoHJpPtxWcD99NN2oueGGn4acc0395`,
      )
      const data = await response.json()

      if (data.data && data.data.id) {
        // Auto-fill name and mark fields as validated
        setFormData((prev) => ({
          ...prev,
          name: data.data.nome_da_pf || prev.name,
        }))
        setCpfValidated(true)
        toast({
          title: "CPF validado!",
          description: "Dados preenchidos automaticamente.",
        })
      } else {
        toast({
          title: "CPF não encontrado",
          description: "Verifique o CPF e data de nascimento.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Erro ao validar CPF:", error)
    }
  }

  const validateEmail = async (email: string) => {
    if (!email) return

    try {
      const response = await fetch(`https://federalassociados.com.br/getEmail/${email}`)
      const data = await response.json()

      if (data.status === "success") {
        setEmailValidated(true)
        toast({
          title: "Email validado!",
          description: "Email confirmado com sucesso.",
        })
      } else if (data.status === "error") {
        toast({
          title: "Erro",
          description: data.msg || "Email já cadastrado ou inválido.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Erro ao validar email:", error)
    }
  }

  const validateCoupon = async (coupon: string) => {
    if (!coupon) return

    try {
      const response = await fetch(`https://federalassociados.com.br/getValidateCoupon/${coupon}`)
      const data = await response.json()

      if (data.status === "success") {
        toast({
          title: "Cupom válido!",
          description: data.msg || "Cupom aplicado com sucesso.",
        })
      } else if (data.status === "error") {
        toast({
          title: "Cupom inválido",
          description: data.msg || "Verifique o código do cupom.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Erro ao validar cupom:", error)
    }
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Validações
    if (!validateCPF(formData.cpf)) {
      setErrorMessage("CPF inválido! Por favor, verifique o CPF informado.")
      setShowErrorModal(true)
      setLoading(false)
      return
    }

    if (cepValid === false) {
      setErrorMessage("CEP inválido! Por favor, verifique o CEP informado e corrija antes de continuar.")
      setShowErrorModal(true)
      setLoading(false)
      return
    }

    if (!formData.plan_id) {
      setErrorMessage("Por favor, selecione um plano antes de continuar.")
      setShowErrorModal(true)
      setLoading(false)
      return
    }

    if (!formData.typeFrete) {
      setErrorMessage("Por favor, selecione a forma de envio antes de continuar.")
      setShowErrorModal(true)
      setLoading(false)
      return
    }

    try {
      // Criar iframe invisível
      const iframe = document.createElement('iframe')
      iframe.name = 'federal_form_target'
      iframe.style.display = 'none'
      document.body.appendChild(iframe)

      // Criar formulário oculto
      const form = document.createElement('form')
      form.method = 'POST'
      form.action = 'https://federalassociados.com.br/registroSave'
      form.target = 'federal_form_target'
      form.style.display = 'none'

      // Remover máscaras dos campos
      const cleanCPF = formData.cpf.replace(/\D/g, '')
      const cleanCell = formData.cell.replace(/\D/g, '')
      const cleanCEP = formData.cep.replace(/\D/g, '')
      const birthISO = convertDateToISO(formData.birth)

      // Adicionar todos os campos como inputs hidden com dados RAW
      const fields = {
        _token: 'oCqwAglu4VySDRcwWNqj81UMfbKHCS2vWQfARkzu',
        status: '0',
        father: REFERRAL_ID,
        type: 'Recorrente',
        cpf: cleanCPF,
        birth: birthISO,
        name: formData.name,
        email: formData.email,
        phone: "",
        cell: cleanCell,
        cep: cleanCEP,
        district: formData.district,
        city: formData.city,
        state: formData.state,
        street: formData.street,
        number: formData.number,
        complement: formData.complement,
        typeChip: formData.typeChip,
        coupon: formData.coupon,
        plan_id: formData.plan_id,
        typeFrete: formData.typeFrete
      }

      // Criar inputs hidden
      Object.entries(fields).forEach(([key, value]) => {
        const input = document.createElement('input')
        input.type = 'hidden'
        input.name = key
        input.value = value
        form.appendChild(input)
      })

      document.body.appendChild(form)

      // Monitorar o carregamento do iframe para detectar erros
      iframe.onload = () => {
        try {
          // Tentar acessar o conteúdo do iframe
          const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document

          if (iframeDoc) {
            const errorAlert = iframeDoc.querySelector('.alert-danger')
            const errorSpan = iframeDoc.querySelector('.text-danger')

            if (errorAlert && errorAlert.textContent.includes('cpf já está sendo utilizado')) {
              // CPF duplicado detectado!
              setErrorMessage('CPF já cadastrado. Não é possível realizar o cadastro.')
              setShowErrorModal(true)
              setLoading(false)

              // Limpar iframe e form
              if (document.body.contains(form)) {
                document.body.removeChild(form)
              }
              if (document.body.contains(iframe)) {
                document.body.removeChild(iframe)
              }
              return
            }

            if (errorSpan && errorSpan.textContent.includes('cpf já está sendo utilizado')) {
              // CPF duplicado detectado!
              setErrorMessage('CPF já cadastrado. Não é possível realizar o cadastro.')
              setShowErrorModal(true)
              setLoading(false)

              // Limpar iframe e form
              if (document.body.contains(form)) {
                document.body.removeChild(form)
              }
              if (document.body.contains(iframe)) {
                document.body.removeChild(iframe)
              }
              return
            }
          }
        } catch (error) {
          // Erro de CORS - não conseguimos ler o iframe, mas vamos prosseguir normalmente
          console.log('Não foi possível verificar resposta do iframe (CORS)')
        }

        // Se não houver erro, prosseguir normalmente após 3 segundos
        setTimeout(() => {
          // Remover form e iframe do DOM
          if (document.body.contains(form)) {
            document.body.removeChild(form)
          }
          if (document.body.contains(iframe)) {
            document.body.removeChild(iframe)
          }

        // Preparar dados CONVERTIDOS para o webhook
        const selectedPlan = Object.values(PLANS).flat().find(plan => plan.id === formData.plan_id)
        let planName = 'Plano não identificado'

        if (selectedPlan) {
          const operator = Object.keys(PLANS).find(key =>
            PLANS[key as keyof typeof PLANS].some(p => p.id === formData.plan_id)
          )
          planName = `${operator} - ${selectedPlan.name}`
        }

        let formaEnvio = ''
        if (formData.typeFrete === 'Carta') {
          formaEnvio = 'Carta Registrada'
        } else if (formData.typeFrete === 'semFrete') {
          formaEnvio = 'Retirar na Associação'
        } else if (formData.typeFrete === 'eSim') {
          formaEnvio = 'e-SIM'
        }

        const webhookData = {
          nome: formData.name,
          cpf: formData.cpf,
          data_nascimento: formData.birth,
          email: formData.email,
          whatsapp: formData.cell,
          telefone_fixo: "",
          plano: planName,
          tipo_chip: formData.typeChip === 'fisico' ? 'Físico' : 'e-SIM',
          forma_envio: formaEnvio,
          cep: formData.cep,
          endereco: formData.street,
          numero: formData.number,
          complemento: formData.complement,
          bairro: formData.district,
          cidade: formData.city,
          estado: formData.state,
          referral_id: REFERRAL_ID
        }

        // Enviar para o webhook do representante específico
        if (REFERRAL_ID === '110956') {
          // Webhook do representante 110956 (Francisco Eliedisom Dos Santos)
          fetch('https://webhook.fiqon.app/webhook/a0265c1b-d832-483e-af57-8096334a57a8/e167dea4-079e-4af4-9b3f-4acaf711f432', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(webhookData),
          }).catch(error => console.error('Erro ao enviar webhook 110956:', error))
        }

        if (REFERRAL_ID === '110403') {
          // Webhook do representante 110403
          fetch('https://webhook.fiqon.app/webhook/019a82d0-9018-73a8-9702-405595187191/15c6ef7c-a0c0-4b0a-b6cf-f873564be560', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(webhookData),
          }).catch(error => console.error('Erro ao enviar webhook 110403:', error))
        }

        if (REFERRAL_ID === '88389') {
          // Webhook do representante 88389
          fetch('https://webhook.fiqon.app/webhook/a02ccd6f-0d2f-401d-8d9b-c9e161d5330e/0624b4b1-d658-44d1-8291-ed8f0b5b3bf9', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(webhookData),
          }).catch(error => console.error('Erro ao enviar webhook 88389:', error))
        }

        if (REFERRAL_ID === '159726') {
          // Webhook do representante 159726
          fetch('https://webhook.fiqon.app/webhook/019a87ed-830f-7073-af20-cc44131112f4/2dba1f6c-82cc-4625-87a1-a08888dd1d63', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(webhookData),
          }).catch(error => console.error('Erro ao enviar webhook 159726:', error))
        }

        if (REFERRAL_ID === '131966') {
          // Webhook do representante 131966
          fetch('https://webhook.fiqon.app/webhook/a0436edd-0f48-454c-9fc2-f916fee56e34/ffc2252d-f738-4870-8287-81ea51a89542', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(webhookData),
          }).catch(error => console.error('Erro ao enviar webhook 131966:', error))
        }

        setLoading(false)
        setShowSuccessModal(true)
      }, 3000)
      }

      // Enviar formulário
      form.submit()

    } catch (error) {
      console.error('Erro ao processar cadastro:', error)
      setErrorMessage('Não foi possível completar o cadastro. Verifique sua conexão e tente novamente.')
      setShowErrorModal(true)
      setLoading(false)
    }
  }

  const getAvailablePlans = () => {
    if (formData.typeChip === "eSim") {
      return Object.entries(PLANS)
        .flat()
        .filter((plan) => plan.esim)
    }
    return Object.values(PLANS).flat()
  }

  useEffect(() => {
    const video = document.createElement('video')
    video.preload = 'auto'
    video.src = 'https://myehbxfidszreorsaexi.supabase.co/storage/v1/object/public/adesao/adesao.mp4'
    video.load()
  }, [])

  if (showSuccessModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="bg-white rounded-lg p-6 mx-auto max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 text-center">
            Parabéns! Seu cadastro foi realizado com sucesso. 🎉
          </h1>

          <div className="space-y-3 text-gray-700 text-sm md:text-base leading-relaxed">
            <p>
              Para darmos continuidade com à ativação do seu plano, é necessário realizar o pagamento da sua taxa associativa, no valor proporcional ao plano escolhido por você.
            </p>

            <p>
              Essa taxa é solicitada antes da ativação, pois ela confirma oficialmente a sua entrada na Federal Associados.
            </p>

            <p className="font-semibold">
              O valor é usado para cobrir os custos administrativos e operacionais, como:
            </p>

            <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
              <li>Geração do número.</li>
              <li>Configuração da linha.</li>
              <li>Liberação do seu escritório virtual.</li>
              <li>E acesso a todos os benefícios exclusivos da empresa, como o Clube de Descontos, Cinema Grátis, Programa PBI, entre outros.</li>
            </ul>

            <p>
              O pagamento da taxa é o primeiro passo para liberar o seu benefício de internet móvel e garantir sua ativação com total segurança.
            </p>

            <p>
              Logo após efetuar o pagamento, você receberá um e-mail para fazer a biometria digital.
            </p>

            <p className="font-semibold">
              Após isso já partimos para ativação do seu plano.
            </p>

            <p className="text-center font-bold text-base md:text-lg mt-4">
              Clique no botão abaixo para continuar:
            </p>
          </div>

          <div className="flex justify-center mt-6">
            <Button
              onClick={() => window.location.href = "https://federalassociados.com.br/boletos"}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-base md:text-lg font-semibold rounded-lg shadow-lg transition-colors"
            >
              Realizar Adesão
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
        {/* Plano e Chip */}
        <Card>
          <CardContent className="pt-4 md:pt-6 px-4 md:px-6">
            <h2 className="text-lg md:text-xl font-semibold mb-4 md:mb-6">Escolha seu Plano</h2>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Tipo de Chip</Label>
                <RadioGroup
                  value={formData.typeChip}
                  onValueChange={(value) => {
                    handleInputChange("typeChip", value)
                    handleInputChange("plan_id", "")
                  }}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="fisico" id="fisico" />
                    <Label htmlFor="fisico" className="font-normal cursor-pointer">
                      Físico
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="eSim" id="eSim-chip" />
                    <Label htmlFor="eSim-chip" className="font-normal cursor-pointer">
                      e-SIM
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="plan">
                  Plano <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.plan_id}
                  onValueChange={(value) => handleInputChange("plan_id", value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um plano" />
                  </SelectTrigger>
                  <SelectContent>
                    <div className="px-2 py-1.5 text-sm font-semibold pointer-events-none" style={{ color: '#8B5CF6' }}>VIVO</div>
                    {PLANS.VIVO.map((plan) => (
                      <SelectItem key={plan.id} value={plan.id} className="text-gray-900 font-medium">
                        {plan.name} - R$ {plan.price.toFixed(2).replace('.', ',')}
                      </SelectItem>
                    ))}

                    <div className="px-2 py-1.5 text-sm font-semibold mt-2 pointer-events-none" style={{ color: '#1E90FF' }}>TIM</div>
                    {PLANS.TIM.map((plan) => (
                      <SelectItem key={plan.id} value={plan.id} className="text-gray-900 font-medium">
                        {plan.name} - R$ {plan.price.toFixed(2).replace('.', ',')}
                      </SelectItem>
                    ))}

                    <div className="px-2 py-1.5 text-sm font-semibold mt-2 pointer-events-none" style={{ color: '#DC143C' }}>CLARO</div>
                    {PLANS.CLARO.map((plan) => (
                      <SelectItem key={plan.id} value={plan.id} className="text-gray-900 font-medium">
                        {plan.name} - R$ {plan.price.toFixed(2).replace('.', ',')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

            </div>
          </CardContent>
        </Card>

        {/* Dados Pessoais */}
        <Card>
          <CardContent className="pt-4 md:pt-6 px-4 md:px-6">
            <h2 className="text-lg md:text-xl font-semibold mb-4 md:mb-6">Dados Pessoais</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-4">
              <div className="space-y-2">
                <Label htmlFor="cpf">
                  CPF <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="cpf"
                  value={formData.cpf}
                  onChange={(e) => handleInputChange("cpf", e.target.value)}
                  placeholder="000.000.000-00"
                  maxLength={14}
                  required
                  className={cpfValidated ? "border-green-500" : ""}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="birth">
                  Data de Nascimento <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="birth"
                  type="text"
                  value={formData.birth}
                  onChange={(e) => handleInputChange("birth", e.target.value)}
                  onBlur={(e) => validateCPFWithAPI(formData.cpf, e.target.value)}
                  placeholder="DD/MM/AAAA"
                  maxLength={10}
                  required
                />
              </div>

              <div className="space-y-2 md:col-span-2 lg:col-span-1">
                <Label htmlFor="name">
                  Nome Completo <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Seu nome completo"
                  required
                  readOnly={cpfValidated}
                  className={cpfValidated ? "border-green-500" : ""}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contato */}
        <Card>
          <CardContent className="pt-4 md:pt-6 px-4 md:px-6">
            <h2 className="text-lg md:text-xl font-semibold mb-4 md:mb-6">Contato</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="email">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  onBlur={(e) => validateEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                  className={emailValidated ? "border-green-500" : ""}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cell">
                  WhatsApp <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="cell"
                  value={formData.cell}
                  onChange={(e) => handleInputChange("cell", e.target.value)}
                  placeholder="(00) 00000-0000"
                  maxLength={15}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Endereço */}
        <Card>
          <CardContent className="pt-4 md:pt-6 px-4 md:px-6">
            <h2 className="text-lg md:text-xl font-semibold mb-4 md:mb-6">Endereço</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-4">
              <div className="space-y-2">
                <Label htmlFor="cep">
                  CEP <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="cep"
                  value={formData.cep}
                  onChange={(e) => {
                    handleInputChange("cep", e.target.value)
                    setCepValid(null)
                  }}
                  onBlur={(e) => fetchAddressByCEP(e.target.value)}
                  placeholder="00000-000"
                  maxLength={9}
                  required
                  className={cepValid === false ? "border-red-500 border-2" : cepValid === true ? "border-green-500" : ""}
                />
                {cepValid === false && (
                  <p className="text-sm text-red-500 font-medium">CEP inválido! Verifique o número digitado.</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="district">
                  Bairro <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="district"
                  value={formData.district}
                  onChange={(e) => handleInputChange("district", e.target.value)}
                  placeholder="Seu bairro"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">
                  Cidade <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  placeholder="Sua cidade"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">
                  Estado <span className="text-red-500">*</span>
                </Label>
                <Select value={formData.state} onValueChange={(value) => handleInputChange("state", value)} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {BRAZILIAN_STATES.map((state) => (
                      <SelectItem key={state.value} value={state.value}>
                        {state.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2 lg:col-span-3">
                <Label htmlFor="street">
                  Endereço <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="street"
                  value={formData.street}
                  onChange={(e) => handleInputChange("street", e.target.value)}
                  placeholder="Rua, Avenida, etc"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="number">Número</Label>
                <Input
                  id="number"
                  value={formData.number}
                  onChange={(e) => handleInputChange("number", e.target.value)}
                  placeholder="123"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="complement">Complemento</Label>
                <Input
                  id="complement"
                  value={formData.complement}
                  onChange={(e) => handleInputChange("complement", e.target.value)}
                  placeholder="Apto, Bloco, etc"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Forma de Envio */}
        <Card>
          <CardContent className="pt-4 md:pt-6 px-4 md:px-6">
            <h2 className="text-lg md:text-xl font-semibold mb-4 md:mb-6">Forma de Envio</h2>
            <RadioGroup
              value={formData.typeFrete}
              onValueChange={(value) => handleInputChange("typeFrete", value)}
              className="space-y-3"
            >
              {formData.typeChip === "fisico" && (
                <>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Carta" id="carta" />
                      <Label htmlFor="carta" className="font-normal cursor-pointer">
                        Enviar via Carta Registrada
                      </Label>
                    </div>
                    <p className="text-sm text-muted-foreground ml-6">
                      Para quem vai receber o chip pelos Correios
                    </p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="semFrete" id="semFrete" />
                      <Label htmlFor="semFrete" className="font-normal cursor-pointer">
                        Retirar na Associação ou com um Associado
                      </Label>
                    </div>
                    <p className="text-sm text-muted-foreground ml-6">
                      Se você vai retirar o chip pessoalmente com um representante ou no caso dos planos da Vivo, vai comprar um chip para ativar de forma imediata
                    </p>
                  </div>
                </>
              )}
              {formData.typeChip === "eSim" && (
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="eSim" id="eSim" />
                  <Label htmlFor="eSim" className="font-normal cursor-pointer">
                    Sem a necessidade de envio (e-SIM)
                  </Label>
                </div>
              )}
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Botões */}
        <div className="flex gap-4 justify-end">
          <Button type="button" variant="outline" onClick={() => window.history.back()}>
            Voltar
          </Button>
          <Button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700 text-white">
            {loading ? "Processando..." : "Salvar"}
          </Button>
        </div>

        <p className="text-sm text-gray-600 mt-4 text-center">
          Ao clicar em salvar, você será redirecionado para realizar o pagamento da sua taxa associativa, sendo ela o valor proporcional ao plano que você escolheu.
        </p>
      </form>

      <ErrorModal open={showErrorModal} onOpenChange={setShowErrorModal} message={errorMessage} />
    </>
  )
}
