import { createClient } from 'npm:@supabase/supabase-js@2.81.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface RegistrationData {
  nome: string;
  cpf: string;
  email: string;
  celular: string;
  representanteId: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const registrationData: RegistrationData = await req.json();

    const cpfLimpo = registrationData.cpf.replace(/\D/g, '');

    const { data: existing } = await supabase
      .from('registrations')
      .select('*')
      .eq('cpf', cpfLimpo)
      .eq('status', 'success')
      .maybeSingle();

    if (existing) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'CPF já cadastrado anteriormente',
          alreadyRegistered: true,
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const { data: registration, error: dbError } = await supabase
      .from('registrations')
      .insert({
        cpf: cpfLimpo,
        name: registrationData.nome,
        email: registrationData.email,
        phone: registrationData.celular,
        representante_id: registrationData.representanteId,
        status: 'pending',
      })
      .select()
      .single();

    if (dbError) {
      throw new Error('Erro ao salvar no banco: ' + dbError.message);
    }

    const formData = new URLSearchParams();
    formData.append('nome', registrationData.nome);
    formData.append('cpf', registrationData.cpf);
    formData.append('email', registrationData.email);
    formData.append('celular', registrationData.celular);
    formData.append('representanteId', registrationData.representanteId);

    const federalResponse = await fetch(
      'https://federalassociados.com.br/registroSave',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      }
    );

    const responseText = await federalResponse.text();
    let responseData;
    
    try {
      responseData = JSON.parse(responseText);
    } catch {
      responseData = { raw: responseText };
    }

    const isSuccess = federalResponse.ok && 
      (responseText.includes('sucesso') || 
       responseText.includes('success') ||
       !responseText.includes('erro') && !responseText.includes('error'));

    await supabase
      .from('registrations')
      .update({
        status: isSuccess ? 'success' : 'error',
        federal_response: responseData,
        error_message: isSuccess ? null : responseText,
        updated_at: new Date().toISOString(),
      })
      .eq('id', registration.id);

    if (!isSuccess) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Erro ao processar cadastro na Federal Associados',
          details: responseText,
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Cadastro realizado com sucesso!',
        data: responseData,
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error in federal-proxy:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Erro interno do servidor',
        details: error instanceof Error ? error.message : 'Erro desconhecido',
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});