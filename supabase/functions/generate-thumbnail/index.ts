import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, count = 1, creativity = 50, referenceImage } = await req.json();

    if (!prompt) {
      return new Response(
        JSON.stringify({ error: 'Prompt is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Generating thumbnails:', { count, creativity, hasReference: !!referenceImage });

    const variations = [];

    // Gerar múltiplas thumbnails
    for (let i = 0; i < count; i++) {
      console.log(`Generating thumbnail ${i + 1}/${count}`);
      
      const messageContent: any[] = [
        {
          type: 'text',
          text: `${prompt} Create a high-quality, eye-catching thumbnail image. Make it visually appealing and professional. Variation ${i + 1}.`
        }
      ];

      // Adicionar imagem de referência se fornecida
      if (referenceImage) {
        messageContent.push({
          type: 'image_url',
          image_url: {
            url: referenceImage.startsWith('data:') ? referenceImage : `data:image/png;base64,${referenceImage}`
          }
        });
      }

      const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${LOVABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash-image',
          messages: [
            {
              role: 'user',
              content: messageContent
            }
          ],
          modalities: ['image', 'text']
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('AI Gateway error:', response.status, errorText);
        
        if (response.status === 429) {
          return new Response(
            JSON.stringify({ error: 'Limite de requisições excedido. Aguarde alguns instantes.' }),
            { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        
        if (response.status === 402) {
          return new Response(
            JSON.stringify({ error: 'Créditos insuficientes. Adicione créditos em Settings → Workspace → Usage.' }),
            { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        
        if (response.status === 503) {
          return new Response(
            JSON.stringify({ error: 'Serviço de IA temporariamente indisponível. Tente novamente em alguns instantes.' }),
            { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        
        throw new Error(`AI Gateway error: ${response.status}`);
      }

      const data = await response.json();
      console.log('Response received for thumbnail', i + 1);

      // Extrair a imagem gerada
      const generatedImage = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
      
      if (generatedImage) {
        variations.push({
          id: i + 1,
          image: generatedImage
        });
      } else {
        console.error('No image in response:', data);
      }
    }

    console.log(`Successfully generated ${variations.length} thumbnails`);

    return new Response(
      JSON.stringify({ variations }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error generating thumbnails:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
