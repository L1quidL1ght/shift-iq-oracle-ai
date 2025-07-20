import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import OpenAI from 'https://esm.sh/openai@4.28.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface DocumentChunk {
  content: string
  start: number
  end: number
}

function splitIntoChunks(text: string, chunkSize: number = 1000, overlap: number = 200): DocumentChunk[] {
  const chunks: DocumentChunk[] = []
  let start = 0
  
  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length)
    const chunk = text.slice(start, end)
    
    chunks.push({
      content: chunk.trim(),
      start,
      end
    })
    
    if (end >= text.length) break
    start = end - overlap
  }
  
  return chunks.filter(chunk => chunk.content.length > 50) // Filter out very small chunks
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    const openai = new OpenAI({
      apiKey: Deno.env.get('OPENAI_API_KEY') ?? '',
    })

    const { documentId } = await req.json()

    if (!documentId) {
      return new Response(
        JSON.stringify({ error: 'Document ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get the document
    const { data: document, error: docError } = await supabaseClient
      .from('documents')
      .select('*')
      .eq('id', documentId)
      .single()

    if (docError || !document) {
      return new Response(
        JSON.stringify({ error: 'Document not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Split document into chunks
    const chunks = splitIntoChunks(document.content)
    
    if (chunks.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No valid chunks created from document' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Generate embeddings for each chunk
    const embeddings = []
    
    for (const chunk of chunks) {
      try {
        const embeddingResponse = await openai.embeddings.create({
          model: 'text-embedding-ada-002',
          input: chunk.content,
        })

        embeddings.push({
          document_id: documentId,
          content: chunk.content,
          embedding: embeddingResponse.data[0].embedding
        })
      } catch (error) {
        console.error('Error generating embedding for chunk:', error)
        // Continue with other chunks
      }
    }

    if (embeddings.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Failed to generate any embeddings' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Delete existing embeddings for this document
    await supabaseClient
      .from('document_embeddings')
      .delete()
      .eq('document_id', documentId)

    // Insert new embeddings
    const { error: insertError } = await supabaseClient
      .from('document_embeddings')
      .insert(embeddings)

    if (insertError) {
      console.error('Error inserting embeddings:', insertError)
      return new Response(
        JSON.stringify({ error: 'Failed to store embeddings' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({
        success: true,
        chunksProcessed: embeddings.length,
        documentId: documentId
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )

  } catch (error) {
    console.error('Document processing error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})