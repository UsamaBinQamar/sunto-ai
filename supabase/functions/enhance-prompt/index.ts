
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userDescription } = await req.json();

    if (!userDescription) {
      throw new Error('User description is required');
    }

    console.log('Enhancing prompt for description:', userDescription);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: `Sei un esperto di prompt engineering per intelligenza artificiale. Il tuo compito è trasformare descrizioni semplici degli utenti in prompt professionali e ottimizzati per ottenere risultati precisi e coerenti dall'IA.

Regole per la creazione del prompt:
1. Inizia sempre con "Sei un assistente IA specializzato"
2. Includi il contesto e l'obiettivo specifico
3. Fornisci istruzioni chiare e strutturate
4. Specifica il formato della risposta desiderato
5. Aggiungi linee guida per mantenere qualità e coerenza
6. Mantieni un tono professionale e informativo
7. Il prompt deve essere in italiano

Esempio di trasformazione:
Input: "Voglio che riassuma il testo"
Output: "Sei un assistente IA specializzato nella sintesi di contenuti. Analizza il testo fornito e crea un riassunto conciso che catturi i punti chiave e le informazioni più importanti. Struttura il riassunto in modo logico e mantieni un tono professionale. Assicurati che il riassunto sia completo ma non superi il 30% della lunghezza originale del testo."

Crea un prompt ottimizzato basato sulla descrizione dell'utente.`
          },
          { 
            role: 'user', 
            content: userDescription 
          }
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const enhancedPrompt = data.choices[0].message.content;

    console.log('Enhanced prompt generated successfully');

    return new Response(JSON.stringify({ enhancedPrompt }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in enhance-prompt function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
