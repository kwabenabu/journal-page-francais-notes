
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { entryId, content } = await req.json()

    if (!entryId || !content) {
      return new Response(
        JSON.stringify({ error: 'Missing entryId or content' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Call OpenAI API to review the French text
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `Tu es un professeur de français expérimenté. Analyse le texte suivant écrit par un apprenant et évalue:
            1. La précision grammaticale (0-100)
            2. La richesse du vocabulaire (0-100)
            3. La structure des phrases (0-100)
            4. L'orthographe (0-100)
            
            Fournis une note globale sur 100 et des suggestions d'amélioration concrètes et encourageantes.
            
            Réponds au format JSON suivant:
            {
              "score": number (0-100),
              "feedback": "Suggestions détaillées pour l'amélioration, incluant des corrections spécifiques et des encouragements"
            }`
          },
          {
            role: 'user',
            content: content
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    })

    if (!openaiResponse.ok) {
      console.error('OpenAI API error:', await openaiResponse.text())
      return new Response(
        JSON.stringify({ error: 'Failed to get review from OpenAI' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const openaiResult = await openaiResponse.json()
    let reviewData

    try {
      reviewData = JSON.parse(openaiResult.choices[0].message.content)
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', parseError)
      return new Response(
        JSON.stringify({ error: 'Failed to parse review data' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Update the journal entry with the review data
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { data, error } = await supabase
      .from('journals')
      .update({
        french_accuracy_score: reviewData.score,
        language_feedback: reviewData.feedback,
        reviewed_at: new Date().toISOString()
      })
      .eq('id', entryId)
      .select()

    if (error) {
      console.error('Supabase update error:', error)
      return new Response(
        JSON.stringify({ error: 'Failed to update journal entry' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        score: reviewData.score,
        feedback: reviewData.feedback,
        data: data[0]
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Function error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
