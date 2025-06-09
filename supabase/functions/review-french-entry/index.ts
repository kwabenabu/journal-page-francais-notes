
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
      console.error('Missing entryId or content:', { entryId, content })
      return new Response(
        JSON.stringify({ error: 'Missing entryId or content' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const openaiApiKey = Deno.env.get('OPENAI_KEY')
    if (!openaiApiKey) {
      console.error('OpenAI API key not configured')
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Calling OpenAI API for entry:', entryId)
    
    // Call OpenAI API to review the French text
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `Tu es un professeur de français expérimenté. Analyse le texte suivant écrit par un apprenant et évalue:
            1. La précision grammaticale
            2. La richesse du vocabulaire
            3. La structure des phrases
            4. L'orthographe
            
            Fournis une note globale sur 100 et des suggestions d'amélioration concrètes et encourageantes.
            
            Tu DOIS répondre UNIQUEMENT avec un objet JSON valide, sans aucun texte avant ou après. Format exact:
            {"score": 85, "feedback": "Vos suggestions détaillées ici..."}`
          },
          {
            role: 'user',
            content: content
          }
        ],
        temperature: 0.1,
        max_tokens: 300,
        response_format: { type: "json_object" }
      })
    })

    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text()
      console.error('OpenAI API error:', errorText)
      return new Response(
        JSON.stringify({ error: 'Failed to get review from OpenAI' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const openaiResult = await openaiResponse.json()
    console.log('OpenAI response:', openaiResult)
    
    let reviewData

    try {
      let content = openaiResult.choices[0].message.content
      console.log('Raw OpenAI content:', content)
      
      // Clean the content - remove any text before the first { and after the last }
      const firstBrace = content.indexOf('{')
      const lastBrace = content.lastIndexOf('}')
      
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        content = content.substring(firstBrace, lastBrace + 1)
        console.log('Cleaned content:', content)
      }
      
      // Try to parse the cleaned JSON
      reviewData = JSON.parse(content)
      
      // Validate the required fields
      if (typeof reviewData.score !== 'number' || typeof reviewData.feedback !== 'string') {
        throw new Error('Invalid response format from OpenAI')
      }
      
      // Ensure score is within valid range
      reviewData.score = Math.max(0, Math.min(100, Math.round(reviewData.score)))
      
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', parseError)
      console.error('Raw OpenAI content that failed:', openaiResult.choices[0].message.content)
      
      // Try to extract score and feedback using regex as a fallback
      const rawContent = openaiResult.choices[0].message.content
      const scoreMatch = rawContent.match(/"?score"?\s*:\s*(\d+)/i)
      const feedbackMatch = rawContent.match(/"?feedback"?\s*:\s*"([^"]+)"/i)
      
      if (scoreMatch && feedbackMatch) {
        reviewData = {
          score: Math.max(0, Math.min(100, parseInt(scoreMatch[1]))),
          feedback: feedbackMatch[1]
        }
        console.log('Extracted data using regex:', reviewData)
      } else {
        // Final fallback: provide a default response
        reviewData = {
          score: 75,
          feedback: "Je n'ai pas pu analyser votre texte en détail, mais continuez à pratiquer votre français ! Votre effort d'écriture est apprécié."
        }
        console.log('Using fallback response')
      }
    }

    console.log('Final review data:', reviewData)

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

    console.log('Successfully updated entry:', data[0])

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
