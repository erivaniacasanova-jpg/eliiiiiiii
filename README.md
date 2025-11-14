# Federal Associados - Formulário de Cadastro

Sistema de cadastro e pagamento para a Federal Associados com integração de pagamentos via PIX, Cartão e Boleto.

## 🚀 Funcionalidades

- ✅ Formulário completo de cadastro com validação
- ✅ Validação de CPF
- ✅ Busca automática de endereço por CEP (ViaCEP)
- ✅ Seleção de planos (Vivo, TIM, Claro)
- ✅ Suporte para chip físico e e-SIM
- ✅ Múltiplas formas de pagamento:
  - PIX (com QR Code)
  - Cartão de Crédito
  - Boleto Bancário
- ✅ Link de indicação integrado (ID: 15354112082025084547)

## 🔧 Configuração

### 1. Instalar dependências

\`\`\`bash
npm install
\`\`\`

### 2. Configurar variáveis de ambiente

Copie o arquivo \`.env.example\` para \`.env.local\` e preencha com suas credenciais:

\`\`\`bash
cp .env.example .env.local
\`\`\`

### 3. Obter credenciais necessárias

#### MercadoPago (para pagamentos)
1. Acesse [MercadoPago Developers](https://www.mercadopago.com.br/developers)
2. Crie uma aplicação
3. Copie suas credenciais (Public Key e Access Token)
4. Cole no arquivo \`.env.local\`

#### Federal Associados API
1. Entre em contato com o suporte da Federal Associados
2. Solicite acesso à API para integração
3. Obtenha sua chave de API
4. Configure no \`.env.local\`

### 4. Executar o projeto

\`\`\`bash
npm run dev
\`\`\`

Acesse: [http://localhost:3000](http://localhost:3000)

## 📋 Próximos Passos

Para que o sistema funcione completamente e você receba suas comissões:

1. **Integração com Federal Associados**
   - Configure a API key da Federal Associados
   - Teste o endpoint de registro
   - Verifique se o ID de indicação (15354112082025084547) está sendo enviado corretamente

2. **Configuração do MercadoPago**
   - Crie uma conta no MercadoPago
   - Configure as credenciais de produção
   - Teste os pagamentos em ambiente sandbox primeiro

3. **Validações adicionais**
   - Implementar verificação de CPF/email duplicado
   - Adicionar validação de cupons de desconto
   - Configurar webhooks para confirmação de pagamento

4. **Deploy**
   - Faça deploy na Vercel ou outro provedor
   - Configure as variáveis de ambiente no ambiente de produção
   - Teste todo o fluxo em produção

## 🔐 Segurança

- Nunca exponha suas chaves de API no código
- Use variáveis de ambiente para todas as credenciais
- Valide todos os dados no backend
- Implemente rate limiting nas APIs

## 📞 Suporte

Para dúvidas sobre a integração com a Federal Associados:
- Telefone: 0800 6262 345
- Site: https://federalassociados.com.br

## 📄 Licença

Este projeto é privado e destinado ao uso exclusivo do afiliado ID 15354112082025084547.
