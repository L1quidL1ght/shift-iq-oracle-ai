-- Create vector search function for document embeddings
CREATE OR REPLACE FUNCTION search_documents(
  query_embedding vector(1536),
  similarity_threshold float DEFAULT 0.7,
  match_count int DEFAULT 3
)
RETURNS TABLE (
  id uuid,
  document_id uuid,
  title text,
  content text,
  category text,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    de.id,
    de.document_id,
    d.title,
    de.content,
    d.category,
    (de.embedding <#> query_embedding) * -1 AS similarity
  FROM document_embeddings de
  JOIN documents d ON de.document_id = d.id
  WHERE (de.embedding <#> query_embedding) * -1 > similarity_threshold
  ORDER BY de.embedding <#> query_embedding ASC
  LIMIT match_count;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION search_documents TO authenticated;

-- Create index for faster vector similarity search if not exists
CREATE INDEX IF NOT EXISTS document_embeddings_embedding_idx 
ON document_embeddings 
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);