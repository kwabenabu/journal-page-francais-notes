
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface LibreTranslateRequest {
  q: string;
  source: string;
  target: string;
  format?: string;
}

interface LibreTranslateResponse {
  translatedText: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, sourceLanguage, targetLanguage } = await req.json();
    
    console.log('LibreTranslate request:', { text, sourceLanguage, targetLanguage });
    
    if (!text || !sourceLanguage || !targetLanguage) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters: text, sourceLanguage, targetLanguage' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // You can configure this URL to point to your LibreTranslate instance
    // For development, you can use the public demo instance (with limitations)
    // For production, set up your own LibreTranslate server
    const libreTranslateUrl = Deno.env.get('LIBRE_TRANSLATE_URL') || 'https://libretranslate.de';
    
    const requestBody: LibreTranslateRequest = {
      q: text,
      source: sourceLanguage,
      target: targetLanguage,
      format: 'text'
    };

    console.log('Calling LibreTranslate API:', libreTranslateUrl);
    
    const response = await fetch(`${libreTranslateUrl}/translate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('LibreTranslate API error:', response.status, errorText);
      throw new Error(`LibreTranslate API error: ${response.status} - ${errorText}`);
    }

    const data: LibreTranslateResponse = await response.json();
    console.log('LibreTranslate response:', data);

    return new Response(
      JSON.stringify({ 
        translatedText: data.translatedText,
        sourceLanguage,
        targetLanguage 
      }), 
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in libre-translate function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
