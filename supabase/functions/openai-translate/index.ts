
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface OpenAITranslateRequest {
  text: string;
  sourceLanguage: string;
  targetLanguage: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, sourceLanguage, targetLanguage }: OpenAITranslateRequest = await req.json();
    
    console.log('OpenAI translate request:', { text, sourceLanguage, targetLanguage });
    
    if (!text || !sourceLanguage || !targetLanguage) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters: text, sourceLanguage, targetLanguage' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      console.error('OPENAI_API_KEY not found in environment');
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const sourceLangName = sourceLanguage === 'en' ? 'English' : 'French';
    const targetLangName = targetLanguage === 'en' ? 'English' : 'French';

    const prompt = `Translate the following text from ${sourceLangName} to ${targetLangName}. 
    
    Text to translate: "${text}"
    
    Instructions:
    - Only return the translation, no explanations
    - Maintain the same tone and style
    - If it's a single word, provide just the word translation
    - If it's a phrase, translate the entire phrase naturally
    
    Translation:`;

    console.log('Calling OpenAI API...');
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 100,
        temperature: 0.3
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('OpenAI response:', data);

    if (data.choices && data.choices[0] && data.choices[0].message) {
      const translatedText = data.choices[0].message.content.trim();
      console.log('OpenAI translation success:', translatedText);
      
      return new Response(
        JSON.stringify({ 
          translatedText,
          sourceLanguage,
          targetLanguage 
        }), 
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    } else {
      throw new Error('Invalid response format from OpenAI');
    }

  } catch (error) {
    console.error('Error in openai-translate function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
