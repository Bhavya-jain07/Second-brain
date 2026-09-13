import { pipeline } from "@xenova/transformers";

// Lazily load the embedding model once and reuse it for every request.
// "Xenova/all-MiniLM-L6-v2" is a small (~90MB), fast sentence-embedding
// model that runs locally via ONNX — no API key, no per-call cost, no
// external network call. This is the tradeoff for not paying for OpenAI
// embeddings: slightly lower quality than text-embedding-3-small, but
// completely free and private (nothing leaves the server).
let embedderPromise: ReturnType<typeof pipeline> | null = null;

function getEmbedder() {
  if (!embedderPromise) {
    embedderPromise = pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
  }
  return embedderPromise;
}

export async function embedText(text: string): Promise<number[]> {
  const embedder = await getEmbedder();
  const output: any = await (embedder as any)(text, { pooling: "mean", normalize: true });
  return Array.from(output.data as Float32Array);
}

export function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0;
  for (let i = 0; i < a.length; i++) dot += a[i] * b[i];
  // Vectors from this model are already normalized (unit length), so the
  // dot product alone equals cosine similarity — no need to divide by
  // magnitudes separately.
  return dot;
}
