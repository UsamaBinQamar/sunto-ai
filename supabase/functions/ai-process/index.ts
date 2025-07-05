import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const contentType = req.headers.get('content-type') || '';
    
    // Handle transcription requests (multipart/form-data)
    if (contentType.includes('multipart/form-data')) {
      return await handleTranscription(req);
    }
    
    // Handle AI processing requests (application/json)
    const { prompt, content, actionType } = await req.json();
    return await handleAIProcessing(prompt, content, actionType);

  } catch (error) {
    console.error('Error in ai-process function:', error);
    return new Response(
      JSON.stringify({ error: 'Errore interno del server' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function handleTranscription(req: Request) {
  console.log('Processing transcription request with AssemblyAI...');

  const assemblyAIApiKey = Deno.env.get('ASSEMBLYAI_API_KEY');
  if (!assemblyAIApiKey) {
    console.error('AssemblyAI API key not found');
    return new Response(
      JSON.stringify({ error: 'Configurazione API mancante' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const languageCode = formData.get('languageCode') as string || 'it';
    
    if (!file) {
      return new Response(
        JSON.stringify({ error: 'File non trovato' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Transcribing file:', file.name, 'Size:', file.size, 'Language:', languageCode);

    // Check file size (300MB limit for AssemblyAI)
    const maxSize = 300 * 1024 * 1024; // 300MB in bytes
    if (file.size > maxSize) {
      console.error('File too large:', file.size, 'bytes (max:', maxSize, 'bytes)');
      return new Response(
        JSON.stringify({ 
          error: 'Il file è troppo grande per AssemblyAI (max 300MB). Comprimi o accorcia il file.' 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Step 1: Upload file to AssemblyAI
    console.log('Uploading file to AssemblyAI...');
    const uploadResponse = await fetch('https://api.assemblyai.com/v2/upload', {
      method: 'POST',
      headers: {
        'Authorization': assemblyAIApiKey,
      },
      body: file,
    });

    if (!uploadResponse.ok) {
      const errorData = await uploadResponse.text();
      console.error('AssemblyAI upload error:', uploadResponse.status, errorData);
      return new Response(
        JSON.stringify({ error: 'Errore durante il caricamento del file' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { upload_url } = await uploadResponse.json();
    console.log('File uploaded successfully, URL:', upload_url);

    // Step 2: Create transcription job
    console.log('Creating transcription job with language:', languageCode);
    const transcriptResponse = await fetch('https://api.assemblyai.com/v2/transcript', {
      method: 'POST',
      headers: {
        'Authorization': assemblyAIApiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        audio_url: upload_url,
        language_code: languageCode,
        punctuate: true,
        format_text: true,
      }),
    });

    if (!transcriptResponse.ok) {
      const errorData = await transcriptResponse.text();
      console.error('AssemblyAI transcript creation error:', transcriptResponse.status, errorData);
      return new Response(
        JSON.stringify({ error: 'Errore durante la creazione del lavoro di trascrizione' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { id: transcriptId } = await transcriptResponse.json();
    console.log('Transcription job created with ID:', transcriptId);

    // Step 3: Poll for completion
    console.log('Polling for transcription completion...');
    let transcriptionResult;
    let attempts = 0;
    const maxAttempts = 60; // 5 minutes max (5 seconds * 60)

    while (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
      
      const pollResponse = await fetch(`https://api.assemblyai.com/v2/transcript/${transcriptId}`, {
        headers: {
          'Authorization': assemblyAIApiKey,
        },
      });

      if (!pollResponse.ok) {
        console.error('Error polling transcription status:', pollResponse.status);
        break;
      }

      transcriptionResult = await pollResponse.json();
      console.log('Transcription status:', transcriptionResult.status);

      if (transcriptionResult.status === 'completed') {
        break;
      } else if (transcriptionResult.status === 'error') {
        console.error('Transcription failed:', transcriptionResult.error);
        return new Response(
          JSON.stringify({ error: 'Errore durante la trascrizione: ' + transcriptionResult.error }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      attempts++;
    }

    if (attempts >= maxAttempts) {
      console.error('Transcription timed out');
      return new Response(
        JSON.stringify({ error: 'Timeout durante la trascrizione. Riprova con un file più piccolo.' }),
        { status: 408, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!transcriptionResult?.text || transcriptionResult.text.trim() === '') {
      console.error('No transcription content generated');
      return new Response(
        JSON.stringify({ error: 'Nessun contenuto trascritto generato. Il file potrebbe essere vuoto o danneggiato.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Transcription completed successfully, length:', transcriptionResult.text.length, 'Language used:', languageCode);
    return new Response(
      JSON.stringify({ 
        success: true, 
        transcription: transcriptionResult.text.trim(),
        fileName: file.name,
        languageCode: languageCode
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in transcription processing:', error);
    return new Response(
      JSON.stringify({ error: 'Errore durante l\'elaborazione della trascrizione' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}

async function handleAIProcessing(prompt: string, content: string, actionType: string) {
  if (!prompt || !content) {
    return new Response(
      JSON.stringify({ error: 'Prompt e contenuto sono richiesti' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  console.log('Processing AI request:', { actionType, promptLength: prompt.length, contentLength: content.length });

  const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
  if (!openAIApiKey) {
    console.error('OpenAI API key not found');
    return new Response(
      JSON.stringify({ error: 'Configurazione API mancante' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // Build the full prompt
  const fullPrompt = `${prompt}\n\nContenuto da elaborare:\n${content}`;

  console.log('Calling OpenAI API...');
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
          content: 'Sei un assistente IA che elabora contenuti in italiano. Fornisci risposte chiare, ben strutturate e professionali. Mantieni sempre il tono formale e professionale.'
        },
        {
          role: 'user',
          content: fullPrompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    }),
  });

  if (!response.ok) {
    const errorData = await response.text();
    console.error('OpenAI API error:', response.status, errorData);
    return new Response(
      JSON.stringify({ error: 'Errore nell\'elaborazione IA' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  const data = await response.json();
  const generatedContent = data.choices[0]?.message?.content;

  if (!generatedContent) {
    console.error('No content generated from OpenAI');
    return new Response(
      JSON.stringify({ error: 'Nessun contenuto generato' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  console.log('AI processing completed successfully');
  return new Response(
    JSON.stringify({ 
      success: true, 
      content: generatedContent,
      actionType: actionType 
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}
