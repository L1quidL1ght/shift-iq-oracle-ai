-- Update search_documents function with improved similarity calculation and column names
CREATE OR REPLACE FUNCTION search_documents(
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
RETURNS TABLE (
  id uuid,
  document_id uuid,
  content_chunk text,
  similarity float,
  document_title text,
  document_category text
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    de.id,
    de.document_id,
    de.content_chunk,
    1 - (de.embedding <=> query_embedding) as similarity,
    d.title as document_title,
    d.category as document_category
  FROM document_embeddings de
  JOIN documents d on d.id = de.document_id
  WHERE 1 - (de.embedding <=> query_embedding) > match_threshold
  ORDER BY de.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION search_documents TO authenticated;