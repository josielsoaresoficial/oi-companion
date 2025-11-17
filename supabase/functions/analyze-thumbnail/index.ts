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
    const { imageData, question } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY não configurado");
    }

    console.log("Analisando thumbnail com IA...");

    // Primeira análise: detectar elementos da imagem
    const detectionPrompt = `Analise esta thumbnail e identifique:
1. Há TEXTO visível na imagem? (Sim/Não)
2. Há NÚMEROS visíveis? (Sim/Não)
3. Há ÍCONES ou SÍMBOLOS? (Sim/Não)
4. Há EMOJIS? (Sim/Não)
5. Qual é o elemento visual principal?
6. Quais são as cores dominantes?
7. Qual é o estilo geral (profissional, casual, dramático, etc)?

Responda em formato JSON com as chaves: hasText, hasNumbers, hasIcons, hasEmojis, mainElement, dominantColors, style`;

    const detectionResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: detectionPrompt
              },
              {
                type: "image_url",
                image_url: {
                  url: imageData
                }
              }
            ]
          }
        ]
      }),
    });

    if (!detectionResponse.ok) {
      console.error("Erro na detecção:", await detectionResponse.text());
      throw new Error("Erro ao analisar imagem");
    }

    const detectionData = await detectionResponse.json();
    const detectionText = detectionData.choices?.[0]?.message?.content || "";
    console.log("Detecção:", detectionText);

    // Extrair informações da detecção
    let analysis: any = {};
    try {
      // Tentar parsear JSON da resposta
      const jsonMatch = detectionText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      console.log("Parsing manual da resposta:", e);
      // Fallback para parsing manual
      analysis = {
        hasText: detectionText.toLowerCase().includes("sim") && detectionText.toLowerCase().includes("texto"),
        hasNumbers: detectionText.toLowerCase().includes("números"),
        hasIcons: detectionText.toLowerCase().includes("ícones") || detectionText.toLowerCase().includes("símbolos"),
        hasEmojis: detectionText.toLowerCase().includes("emojis"),
        mainElement: "Elemento visual",
        dominantColors: [],
        style: "visual"
      };
    }

    // Segunda análise: gerar recomendações baseadas no contexto
    let recommendationPrompt = `Com base na análise desta thumbnail, ${question ? `e considerando a pergunta do usuário: "${question}", ` : ''}forneça 5 recomendações práticas e específicas para otimização.

Contexto da imagem:
- Texto presente: ${analysis.hasText ? 'Sim' : 'Não'}
- Números presentes: ${analysis.hasNumbers ? 'Sim' : 'Não'}
- Ícones presentes: ${analysis.hasIcons ? 'Sim' : 'Não'}
- Emojis presentes: ${analysis.hasEmojis ? 'Sim' : 'Não'}

IMPORTANTE: 
- Se NÃO há texto, NÃO recomende mudanças em texto
- Se NÃO há números, NÃO recomende mudanças em números
- Foque em melhorias relevantes ao conteúdo REAL da imagem
- Seja específico sobre cores, composição, contraste
- Considere visualização em diferentes tamanhos (mobile/desktop)

Retorne APENAS um array JSON com 5 recomendações em português, formato: ["recomendação 1", "recomendação 2", ...]`;

    const recommendationResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: recommendationPrompt
              },
              {
                type: "image_url",
                image_url: {
                  url: imageData
                }
              }
            ]
          }
        ]
      }),
    });

    if (!recommendationResponse.ok) {
      console.error("Erro nas recomendações:", await recommendationResponse.text());
      throw new Error("Erro ao gerar recomendações");
    }

    const recommendationData = await recommendationResponse.json();
    const recommendationText = recommendationData.choices?.[0]?.message?.content || "";
    console.log("Recomendações:", recommendationText);

    // Extrair array de recomendações
    let recommendations: string[] = [];
    try {
      const arrayMatch = recommendationText.match(/\[[\s\S]*\]/);
      if (arrayMatch) {
        recommendations = JSON.parse(arrayMatch[0]);
      }
    } catch (e) {
      console.log("Parsing manual das recomendações");
      // Fallback: dividir por linhas
      recommendations = recommendationText
        .split('\n')
        .filter((line: string) => line.trim().length > 20)
        .slice(0, 5);
    }

    // Gerar score baseado na análise
    let score = 70;
    if (analysis.hasText) score += 5;
    if (!analysis.hasText && !analysis.hasNumbers) score -= 10; // Thumbnails geralmente precisam de texto
    score = Math.min(100, Math.max(50, score));

    return new Response(
      JSON.stringify({
        score,
        analysis,
        recommendations: recommendations.length > 0 ? recommendations : [
          "Considere adicionar texto para melhor comunicação",
          "Aumente o contraste entre os elementos principais",
          "Otimize as cores para visualização mobile",
          "Verifique a composição visual dos elementos",
          "Teste a thumbnail em diferentes tamanhos"
        ]
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Erro na análise:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Erro desconhecido',
        score: 75,
        recommendations: [
          "Erro ao processar análise. Tente novamente.",
          "Verifique se a imagem está no formato correto",
          "Considere otimizar o tamanho da imagem"
        ]
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
