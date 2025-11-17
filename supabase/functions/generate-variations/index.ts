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
    const { image, referenceImage, variationType, options, count, customText, textStyle, imageStyle, styleIntensity } = await req.json();

    if (!image) {
      return new Response(
        JSON.stringify({ error: 'Image is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Generating variations:', { variationType, count, options, customText, textStyle, imageStyle, styleIntensity, hasReference: !!referenceImage });

    // Criar prompt baseado no tipo de variação e opções
    let prompt = '';
    
    // Adicionar estilo de imagem se especificado
    const styleMap: { [key: string]: string } = {
      'cartoon': 'Apply a cartoon/comic book art style with bold outlines, vibrant colors, and simplified shapes. ',
      '3d-realistic': 'Transform into a photorealistic 3D render with realistic lighting, materials, and depth. ',
      'pixel-art': 'Convert to pixel art style with retro gaming aesthetics, limited color palette, and visible pixels. ',
      'watercolor': 'Apply watercolor painting style with soft edges, transparent washes, and artistic brush strokes. ',
      'flat-design': 'Use flat design style with solid colors, minimal shadows, and clean geometric shapes. ',
      'cyberpunk': 'Apply cyberpunk/neon style with bright neon colors, dark backgrounds, and futuristic elements. ',
      'low-poly': 'Transform into low-poly 3D art style with geometric shapes and faceted surfaces. ',
      'anime': 'Apply anime/manga art style with large expressive eyes, dynamic lines, and Japanese animation aesthetics. ',
      'sketch': 'Convert to pencil sketch style with hand-drawn lines, shading, and artistic imperfections. ',
      'oil-painting': 'Apply oil painting style with rich textures, visible brush strokes, and classical painting techniques. '
    };
    
    const intensityMap: { [key: string]: string } = {
      'sutil': 'Apply the style subtly and discretely, maintaining most of the original image characteristics while adding just a hint of the chosen style. ',
      'moderado': 'Apply the style in a balanced way, making it clearly visible but still preserving the essence of the original image. ',
      'forte': 'Apply the style strongly and prominently, fully transforming the image into the chosen artistic style with bold and striking characteristics. '
    };
    
    if (imageStyle && imageStyle !== 'none' && styleMap[imageStyle]) {
      prompt += styleMap[imageStyle];
      if (styleIntensity && intensityMap[styleIntensity]) {
        prompt += intensityMap[styleIntensity];
      }
    }
    
    if (referenceImage) {
      prompt += 'Use the second image as a style reference for the variations. Match its visual style, color scheme, composition, and overall aesthetic. ';
    }
    
    if (variationType === 'light') {
      prompt += 'Create a variation of this thumbnail with subtle changes. ';
      if (options?.colors) prompt += 'Adjust the color palette slightly. ';
      if (options?.brightness) prompt += 'Modify brightness and contrast. ';
      if (options?.text) prompt += 'Keep text style but slightly adjust it. ';
      if (options?.background) prompt += 'Subtly change the background. ';
      
      // Adicionar instruções para implementar texto customizado com estilo futurista e elegante
      if (options?.implementText && customText) {
        const sizeMap: { [key: string]: string } = {
          'small': '20-30px',
          'medium': '35-45px',
          'large': '50-65px',
          'xlarge': '70-90px'
        };
        
        const positionMap: { [key: string]: string } = {
          'top': 'at the top center',
          'center': 'at the center',
          'bottom': 'at the bottom center',
          'top-left': 'at the top left corner',
          'top-right': 'at the top right corner',
          'bottom-left': 'at the bottom left corner',
          'bottom-right': 'at the bottom right corner'
        };
        
        prompt += `\n\n🚨🚨🚨 CRITICAL TEXT PRESERVATION - READ CAREFULLY 🚨🚨🚨`;
        prompt += `\n\n📝 EXACT TEXT TO RENDER (EVERY CHARACTER MUST BE IDENTICAL):`;
        prompt += `\n"${customText}"`;
        prompt += `\n\n⛔ ABSOLUTE RULES - ZERO TOLERANCE:`;
        prompt += `\n❌ DO NOT change, modify, or alter ANY letters`;
        prompt += `\n❌ DO NOT add extra letters or characters`;
        prompt += `\n❌ DO NOT remove or skip any letters`;
        prompt += `\n❌ DO NOT duplicate any letters or words`;
        prompt += `\n❌ DO NOT replace letters with symbols`;
        prompt += `\n❌ DO NOT fix spelling, grammar, or punctuation`;
        prompt += `\n❌ DO NOT translate to any language`;
        prompt += `\n❌ DO NOT rearrange words or text order`;
        prompt += `\n\n✅ YOUR ONLY JOB: Copy the text EXACTLY character-by-character and apply ONLY visual styling (colors, shadows, glows, effects)`;
        prompt += `\n\n🔍 VERIFY: Before generating, confirm every letter matches the original text perfectly`;
        prompt += `\n\n🎨 TYPOGRAPHY STYLING (choose one unique futuristic/elegant approach):`;
        prompt += `\n- Futuristic: Sleek sans-serif with neon glow, holographic gradients (cyan/magenta/yellow), metallic sheens`;
        prompt += `\n- Elegant Minimalist: Ultra-clean, refined with golden/platinum accents, marble textures`;
        prompt += `\n- Tech Premium: Bold with circuit patterns, hexagonal grids, deep blues/electric purples`;
        prompt += `\n- Luxe Futurism: Glass/metal/crystal materials with transparency, volumetric lighting, particles`;
        prompt += `\n\nTECHNICAL SPECS:`;
        prompt += `\n- Font: ${textStyle?.font || 'Modern geometric sans-serif'}`;
        prompt += `\n- Size: ${textStyle?.fontSize ? (sizeMap[textStyle.fontSize] || '35-45px') : '35-45px'}`;
        prompt += `\n- Base Color: ${textStyle?.color || '#FFFFFF'} with premium styling`;
        prompt += `\n- Position: ${textStyle?.position ? (positionMap[textStyle.position] || 'at the center') : 'at the center'}`;
        prompt += `\n\nVISUAL EFFECTS ONLY:`;
        prompt += `\n- Shadows, glows, 3D depth`;
        prompt += `\n- Gradients, metallic reflections, glass effects`;
        prompt += `\n- Ensure perfect readability with intelligent contrast (light text needs dark backing, dark text needs light backing)`;
        prompt += `\n- Add subtle animation suggestion: pulsing glow, shimmer effect, or data stream particles`;
      }
      
      // Adicionar elementos visuais futuristas e elegantes relacionados ao texto
      if (options?.addVisuals && customText) {
        prompt += `\n\n🎯 BACKGROUND & ICON IMPLEMENTATION - FUTURISTIC ELEGANCE:`;
        prompt += `\n\n⚠️ REMEMBER: Text "${customText}" must remain EXACTLY as written - no modifications!`;
        prompt += `\n\nCREATE VISUAL ELEMENTS to complement (not modify) the text:`;
        prompt += `\n\nBACKGROUND TREATMENTS:`;
        prompt += `\n- Cyber Depth: Deep space gradients with constellation patterns, nebula, aurora borealis, subtle grids`;
        prompt += `\n- Tech Luxury: Premium dark (navy/obsidian/midnight) with hexagonal patterns, circuit traces`;
        prompt += `\n- Holographic Dream: Iridescent color-shifting gradients, transparent geometric shapes`;
        prompt += `\n- Minimal Premium: Ultra-clean with brushed metal, frosted glass, carbon fiber textures`;
        prompt += `\n\nICONS & GRAPHICS (2-4 elements):`;
        prompt += `\n- Conceptually relate to the text theme`;
        prompt += `\n- Futuristic line art, geometric abstractions, sleek 3D`;
        prompt += `\n- Neon outlines, glowing edges, metallic/holographic effects`;
        prompt += `\n- Frame and enhance text, 15-25% text size`;
        prompt += `\n\nATMOSPHERIC EFFECTS:`;
        prompt += `\n- Particles (floating dust, digital rain, energy streams, light rays)`;
        prompt += `\n- Ambient lighting (rim light, backlight, volumetric fog)`;
        prompt += `\n- Premium colors: cyan/magenta tech, gold/platinum luxury, electric blue/purple`;
        prompt += `\n\n⚡ MAINTAIN: Text as primary focus, visual breathing room, professional cohesion`;
      }
      
      prompt += '\n\nMaintain the overall composition and style. Keep it professional and similar to the original.';
    } else {
      prompt = 'Create a creative variation of this thumbnail. ';
      if (options?.redesign) prompt += 'Redesign while keeping the core concept. ';
      if (options?.composition) prompt += 'Change the composition significantly. ';
      if (options?.style) prompt += 'Apply a different artistic style. ';
      if (options?.platforms) prompt += 'Optimize for different social media platforms. ';
      prompt += 'Be creative but maintain professional quality. Make bold changes while keeping the theme recognizable.';
    }

    const variations = [];

    // Gerar múltiplas variações
    for (let i = 0; i < count; i++) {
      console.log(`Generating variation ${i + 1}/${count}`);
      
      const messageContent: any[] = [
        {
          type: 'text',
          text: prompt + ` (Variation ${i + 1})`
        },
        {
          type: 'image_url',
          image_url: {
            url: image.startsWith('data:') ? image : `data:image/png;base64,${image}`
          }
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
      console.log('Response received for variation', i + 1);

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

    console.log(`Successfully generated ${variations.length} variations`);

    return new Response(
      JSON.stringify({ variations }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error generating variations:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
