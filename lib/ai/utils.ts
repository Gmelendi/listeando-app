import Ajv from 'ajv';
import { z } from 'zod';
import { OpenAIEmbeddings } from "@langchain/openai";
import { cosineSimilarity } from "@langchain/core/utils/math";

export function validateSchema(schemaString: string) {
    let schemaObject;
    try {
      schemaObject = JSON.parse(schemaString);
    } catch (e) {
      throw new Error(`Submitted schema is invalid. Could not deserialize. Error: ${e.message}`);
    }
  
    const ajv = new Ajv({ strict: true });
  
    try {
      ajv.compile(schemaObject);
    } catch (e) {
      if (e instanceof Ajv.MissingRefError || e instanceof Ajv.ValidationError) {
        throw new Error(`Submitted schema is invalid. ${e.message}`);
      } else {
        throw new Error(`Submitted schema is invalid. Unrecognized keywords: ${e.message}`);
      }
    }
  }


export const searchQueriesSchema = z.object({
    title: z.string().describe("The title of the user's list."),
    queries: z.array(z.string()).describe("The list of search queries to be used for retrieval."),
});


export async function deduplicateEntries(entries: Record<string, any>[], key: string, similarityThreshold: number = 0.9) {
  
    if (!entries?.length) {
        return [];
    }

    // Filter out invalid entries and those missing the key
    const validEntries = entries.filter(entry => 
        entry != null && 
        typeof entry === 'object' && 
        key in entry && 
        entry[key] != null
    );

    if (!validEntries.length) {
        return [];
    }

    const embeddings = new OpenAIEmbeddings({ model: "text-embedding-3-small" });
    
    try {
        const vectors = await embeddings.embedDocuments(validEntries.map(entry => String(entry[key])));

        const uniqueEntries: Record<string, any>[] = [];
        const uniqueVectors: number[][] = [];

        for (let i = 0; i < validEntries.length; i++) {
            const currentVector = vectors[i];
            let isDuplicate = false;

            for (let j = 0; j < uniqueVectors.length; j++) {
                const similarity = cosineSimilarity([currentVector], [uniqueVectors[j]]);
                if (similarity[0][0] >= similarityThreshold) {
                    isDuplicate = true;
                    break;
                }
            }

            if (!isDuplicate) {
                uniqueEntries.push(validEntries[i]);
                uniqueVectors.push(currentVector);
            }
        }

        return uniqueEntries;
    } catch (error) {
        console.error('Error generating embeddings:', error);
        throw new Error('Failed to generate embeddings for deduplication');
    }
}
