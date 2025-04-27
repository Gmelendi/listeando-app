import Ajv from 'ajv';
import { z } from 'zod';

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