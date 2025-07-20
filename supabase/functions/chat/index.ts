import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import OpenAI from 'https://esm.sh/openai@4.28.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

    const { message, sessionId } = await req.json()

    if (!message || !sessionId) {
      return new Response(
        JSON.stringify({ error: 'Message and sessionId are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Generate embedding for the user message
    const embeddingResponse = await openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: message,
    })
    const queryEmbedding = embeddingResponse.data[0].embedding

    // Search documents using vector similarity
    const { data: searchResults, error: searchError } = await supabaseClient
      .rpc('search_documents', {
        query_embedding: queryEmbedding,
        similarity_threshold: 0.7,
        match_count: 3
      })

    if (searchError) {
      console.error('Vector search error:', searchError)
    }

    let response = ''
    let source = 'internal'
    let sourceDocuments = []

    // If we have good matches from internal documents
    if (searchResults && searchResults.length > 0 && searchResults[0].similarity >= 0.7) {
      // Use internal documents
      sourceDocuments = searchResults.map((doc: any) => ({
        title: doc.title,
        content: doc.content,
        similarity: doc.similarity,
        category: doc.category
      }))

      const context = searchResults.map((doc: any) => 
        `Document: ${doc.title}\nCategory: ${doc.category}\nContent: ${doc.content}`
      ).join('\n\n')

      const contextualResponse = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are ShiftIQ, an AI assistant for restaurant and hospitality operations. Use the provided internal documents to answer questions accurately and helpfully. If the documents don't contain enough information, say so clearly.

Context from internal documents:
${context}`
          },
          {
            role: 'user',
            content: message
          }
        ],
        temperature: 0.3,
        max_tokens: 500
      })

      response = contextualResponse.choices[0].message.content || 'I apologize, but I could not generate a response.'
      
    } else {
      // Fallback to GPT-4 with topic filtering
      source = 'gpt4_fallback'
      
      // First, classify the topic
      const topicClassification = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `Classify this question into one of these allowed topics: restaurant_operations, hospitality, pos_systems, craft_beer, cocktails. If it doesn't fit any of these topics, respond with "other". Only respond with the topic name.`
          },
          {
            role: 'user',
            content: message
          }
        ],
        temperature: 0.1,
        max_tokens: 50
      })

      const topic = topicClassification.choices[0].message.content?.toLowerCase() || 'other'
      const allowedTopics = ['restaurant_operations', 'hospitality', 'pos_systems', 'craft_beer', 'cocktails']

      if (!allowedTopics.includes(topic)) {
        response = "That topic isn't in the system. Ask your manager or submit it for review."
      } else {
        // Generate response for allowed topics
        const gptResponse = await openai.chat.completions.create({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: `You are ShiftIQ, an AI assistant specialized in restaurant operations, hospitality, POS systems, craft beer, and cocktails. Provide helpful, accurate information for ${topic} questions. Keep responses concise and practical.`
            },
            {
              role: 'user',
              content: message
            }
          ],
          temperature: 0.3,
          max_tokens: 500
        })

        response = gptResponse.choices[0].message.content || 'I apologize, but I could not generate a response.'
      }
    }

    // Save the message and response to chat history
    await supabaseClient
      .from('chat_messages')
      .insert([
        { session_id: sessionId, content: message, is_user: true },
        { session_id: sessionId, content: response, is_user: false }
      ])

    return new Response(
      JSON.stringify({
        response,
        source,
        sourceDocuments
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )

  } catch (error) {
    console.error('Chat API error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        response: 'I apologize, but I encountered an error processing your request. Please try again.',
        source: 'error',
        sourceDocuments: []
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})